import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/ui/PageLayout'
import useAuthStore from '../../store/authStore'

const MONO = 'Share Tech Mono, monospace'
const CSS = `
  .gov-row{transition:all .18s;border-left:2px solid transparent;}
  .gov-row:hover{background:rgba(240,237,232,0.06)!important;border-left-color:#BE473D!important;}
  .gov-row:hover .gov-name{color:#F0EDE8!important;}

  @keyframes gov-drift-a { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(5deg)} }
  @keyframes gov-drift-b { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(-4deg)} }
  @keyframes gov-pulse   { 0%,100%{opacity:0.12} 50%{opacity:0.22} }
  @keyframes gov-scan    { from{top:-2px} to{top:100%} }

  .gov-bg {
    position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden;
  }
  .gov-page-wrap { position:relative; z-index:1; }
`

var ITEMS=[
  {id:'tin',icon:'🪪',name:'TIN / BIR',desc:'Tax Identification Number',time:'30 mins (online)',fee:'Free',link:'https://orus.bir.gov.ph',kuyaPrompt:'How do I register for TIN as a fresh graduate in the Philippines?',requirements:['Valid government ID','Personal email address','Home address'],steps:['Go to orus.bir.gov.ph and create a BIR ORUS account','Click "New Application" and select Form 1902 (employed) or Form 1901 (self-employed)','Fill out all required personal details and upload a valid government ID','Submit online — your TIN will be issued digitally','Download your Digital TIN ID from the ORUS portal','Note: TIN is FREE. Never pay anyone to get your TIN.']},
  {id:'sss',icon:'🛡️',name:'SSS',desc:'Social Security System',time:'30 mins (online)',fee:'Free',link:'https://my.sss.gov.ph',kuyaPrompt:'How do I register for SSS online as a fresh graduate?',requirements:['Valid government ID','Personal email address','Mobile number'],steps:['Go to my.sss.gov.ph and click "Not yet registered in My.SSS?"','Select membership type: Employed, Self-Employed, or Voluntary','Fill out your personal details and upload a valid ID','Submit — your SS Number will be emailed within 1-3 days','Your employer will deduct monthly contributions from your salary']},
  {id:'nbi',icon:'📋',name:'NBI Clearance',desc:'National Bureau of Investigation',time:'1-3 hours',fee:'₱155',link:'https://clearance.nbi.gov.ph',kuyaPrompt:'How do I get an NBI clearance? What documents do I need?',requirements:['Printed application form with QR code','Official receipt of payment','1 valid government ID'],steps:['Go to clearance.nbi.gov.ph and create an account','Apply for NBI Clearance and choose your branch and date','Pay ₱155 online or at Bayad Center / 7-Eleven','Print your Application Form with QR code','On appointment day: bring form, receipt, and one valid ID','If "No Hit": clearance released same day','If "Hit": come back after 7-10 days with birth certificate']},
  {id:'philhealth',icon:'🏥',name:'PhilHealth',desc:'Philippine Health Insurance',time:'30 mins',fee:'Free',link:'https://www.philhealth.gov.ph',kuyaPrompt:'How do I register for PhilHealth as a fresh graduate?',requirements:['Valid government ID','Personal email address'],steps:['Go to philhealth.gov.ph > Online Services > Member Registration','Fill out the PMRF form with your personal details','Submit — your PhilHealth PIN will be emailed','Inform your HR of your PIN for automatic deduction','If self-paying: pay monthly at PhilHealth offices or GCash']},
  {id:'pagibig',icon:'🏠',name:'Pag-IBIG / HDMF',desc:'Housing Development Mutual Fund',time:'30 mins',fee:'Free',link:'https://www.pagibigfund.gov.ph',kuyaPrompt:'How do I register for Pag-IBIG as a fresh graduate?',requirements:['Valid government ID','Personal email address'],steps:['Go to pagibigfund.gov.ph > Member > Online Membership Registration','Fill out the MRF-1 form with your personal details','Submit — your Pag-IBIG MID Number is generated immediately','Inform your HR for automatic monthly deductions','Consider enrolling in MP2 for 6-7% annual dividends']},
  {id:'philsys',icon:'🇵🇭',name:'National ID (PhilSys)',desc:'Philippine Identification System',time:'1-2 hours',fee:'Free',link:'https://philsys.gov.ph',kuyaPrompt:'How do I get my Philippine National ID (PhilSys)?',requirements:['PSA Birth Certificate','Any secondary ID (school ID, barangay ID)'],steps:['Go to philsys.gov.ph or download the PhilSys app to pre-register','Fill out your info and choose a registration center','Go to your scheduled center with your documents','Have your photo, fingerprints, and iris scan captured','Receive your PhilSys Number (PSN) via transaction slip','Physical card arrives in 2-6 months via PhilPost']},
]

var SC={done:{label:'DONE',color:'#34D399',border:'rgba(52,211,153,0.3)'},in_progress:{label:'IN PROGRESS',color:'#FBBF24',border:'rgba(251,191,36,0.3)'},not_started:{label:'NOT STARTED',color:'rgba(240,237,232,0.25)',border:'rgba(240,237,232,0.1)'}}

function sk(email){return 'gradready-gov-statuses-'+(email||'guest')}
function load(email){try{var s=localStorage.getItem(sk(email));if(s)return JSON.parse(s)}catch(e){}var d={};ITEMS.forEach(function(i){d[i.id]='not_started'});return d}
function save(statuses,email){try{localStorage.setItem(sk(email),JSON.stringify(statuses))}catch(e){}}

function GovRow({item,status,onCycle,navigate}){
  var [open,setOpen]=useState(false)
  var [steps,setSteps]=useState(false)
  var cfg=SC[status]
  return(
      <div style={{borderBottom:'1px solid rgba(240,237,232,0.05)'}}>
        <div className="gov-row" onClick={function(){setOpen(!open)}} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 12px 14px 14px',cursor:'pointer',background:'transparent'}}>
          <div style={{width:36,height:36,background:'rgba(190,71,61,0.1)',border:'1px solid rgba(190,71,61,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>{item.icon}</div>
          <div style={{flex:1,minWidth:0}}>
            <div className="gov-name" style={{fontFamily:MONO,fontSize:14,color:'rgba(240,237,232,0.85)',letterSpacing:.5,marginBottom:3,transition:'color .18s'}}>{item.name}</div>
            <div style={{fontFamily:'monospace',fontSize:11,color:'rgba(240,237,232,0.42)'}}>{item.desc} · {item.time} · {item.fee}</div>
          </div>
          <button onClick={function(e){e.stopPropagation();onCycle()}} style={{padding:'4px 10px',border:'1px solid',borderColor:cfg.border,background:'transparent',color:cfg.color,fontFamily:MONO,fontSize:9,letterSpacing:1,cursor:'pointer',flexShrink:0,transition:'all .15s'}}>{cfg.label}</button>
          <span style={{fontFamily:MONO,fontSize:16,color:'rgba(240,237,232,0.28)',flexShrink:0}}>{open?'∨':'›'}</span>
        </div>
        {open&&(
            <div style={{padding:'0 12px 16px 62px'}}>
              <div style={{marginBottom:10}}>
                <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.35)',letterSpacing:2,marginBottom:6}}>// REQUIREMENTS</div>
                {item.requirements.map(function(r){return<div key={r} style={{fontFamily:'monospace',fontSize:12,color:'rgba(240,237,232,0.55)',lineHeight:1.7}}>› {r}</div>})}
              </div>
              <button onClick={function(){setSteps(!steps)}} style={{background:'transparent',border:'none',cursor:'pointer',fontFamily:MONO,fontSize:10,color:'#BE473D',letterSpacing:1,padding:0,marginBottom:steps?10:0}} onMouseEnter={function(e){e.currentTarget.style.opacity='.7'}} onMouseLeave={function(e){e.currentTarget.style.opacity='1'}}>{steps?'─ HIDE GUIDE':'+ SHOW STEP-BY-STEP GUIDE'}</button>
              {steps&&(
                  <div style={{marginBottom:12}}>
                    {item.steps.map(function(step,i){return(
                        <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:6}}>
                          <div style={{width:20,height:20,background:'#BE473D',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:MONO,fontSize:9,color:'#F0EDE8',flexShrink:0}}>{i+1}</div>
                          <div style={{fontFamily:'monospace',fontSize:12,color:'rgba(240,237,232,0.55)',lineHeight:1.65}}>{step}</div>
                        </div>
                    )})}
                  </div>
              )}
              <div style={{display:'flex',gap:8}}>
                <button onClick={function(){navigate('/dashboard/chat',{state:{initialMessage:item.kuyaPrompt}})}} style={{flex:1,padding:'11px',background:'#BE473D',border:'none',cursor:'pointer',fontFamily:MONO,fontSize:10,color:'#F0EDE8',letterSpacing:1,transition:'opacity .18s'}} onMouseEnter={function(e){e.currentTarget.style.opacity='.85'}} onMouseLeave={function(e){e.currentTarget.style.opacity='1'}}>ASK KUYA AI</button>
                <button onClick={function(){window.open(item.link,'_blank','noopener,noreferrer')}} style={{flex:1,padding:'11px',background:'transparent',border:'1px solid rgba(240,237,232,0.07)',cursor:'pointer',fontFamily:MONO,fontSize:10,color:'rgba(240,237,232,0.5)',letterSpacing:1,transition:'all .18s'}} onMouseEnter={function(e){e.currentTarget.style.color='#F0EDE8';e.currentTarget.style.borderColor='rgba(240,237,232,0.3)'}} onMouseLeave={function(e){e.currentTarget.style.color='rgba(240,237,232,0.5)';e.currentTarget.style.borderColor='rgba(240,237,232,0.1)'}}>OFFICIAL SITE</button>
              </div>
            </div>
        )}
      </div>
  )
}

export default function GovPage(){
  var navigate=useNavigate()
  var {user}=useAuthStore()
  var email=user?(user.email||user.username||''):''
  var [statuses,setStatuses]=useState(function(){return load(email)})
  useEffect(function(){if(email){save(statuses,email);window.dispatchEvent(new Event('gov-status-updated'))}},[statuses,email])
  function cycle(id){var order=['not_started','in_progress','done'];setStatuses(function(prev){var next=order[(order.indexOf(prev[id])+1)%order.length];return Object.assign({},prev,{[id]:next})})}
  var doneCount=Object.values(statuses).filter(function(s){return s==='done'}).length
  var pct=Math.round((doneCount/ITEMS.length)*100)
  return(
      <PageLayout title="GOV REGISTRATIONS" subtitle="// YOUR POST-GRAD CHECKLIST">
        <style>{CSS}</style>

        {/* ── Background layer ── */}
        <div className="gov-bg" aria-hidden="true">
          {/* Central crimson glow */}
          <div style={{position:'absolute',top:'18%',left:'50%',transform:'translateX(-50%)',width:'min(90vw,600px)',height:'min(90vw,600px)',borderRadius:'50%',background:'radial-gradient(circle,rgba(190,71,61,0.14) 0%,rgba(190,71,61,0.04) 40%,transparent 70%)',animation:'gov-pulse 6s ease-in-out infinite'}}/>
          {/* Top-right accent blob */}
          <div style={{position:'absolute',top:'-5%',right:'-5%',width:260,height:260,borderRadius:'50%',background:'radial-gradient(circle,rgba(200,138,75,0.08) 0%,transparent 65%)',animation:'gov-pulse 9s ease-in-out infinite'}}/>
          {/* Bottom-left accent blob */}
          <div style={{position:'absolute',bottom:'10%',left:'-8%',width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(190,71,61,0.07) 0%,transparent 65%)'}}/>
          {/* Floating diamond — top right */}
          <div style={{position:'absolute',top:'8%',right:'6%',width:44,height:44,border:'1px solid rgba(190,71,61,0.18)',transform:'rotate(45deg)',animation:'gov-drift-a 11s ease-in-out infinite'}}/>
          {/* Floating diamond — bottom left */}
          <div style={{position:'absolute',bottom:'22%',left:'4%',width:28,height:28,border:'1px solid rgba(240,237,232,0.07)',transform:'rotate(45deg)',animation:'gov-drift-b 8s ease-in-out infinite 1s'}}/>
          {/* Floating ring */}
          <div style={{position:'absolute',top:'38%',right:'3%',width:56,height:56,borderRadius:'50%',border:'1px solid rgba(190,71,61,0.1)',animation:'gov-drift-b 13s ease-in-out infinite 2s'}}/>
          {/* Corner bracket — top left */}
          <div style={{position:'absolute',top:16,left:16,width:32,height:32,borderTop:'1px solid rgba(190,71,61,0.22)',borderLeft:'1px solid rgba(190,71,61,0.22)'}}/>
          {/* Corner bracket — bottom right */}
          <div style={{position:'absolute',bottom:16,right:16,width:32,height:32,borderBottom:'1px solid rgba(190,71,61,0.22)',borderRight:'1px solid rgba(190,71,61,0.22)'}}/>
          {/* Diagonal rule lines */}
          <div style={{position:'absolute',top:'30%',left:0,width:'35%',height:1,background:'linear-gradient(90deg,transparent,rgba(190,71,61,0.08),transparent)',transform:'rotate(-8deg)',transformOrigin:'left'}}/>
          <div style={{position:'absolute',bottom:'30%',right:0,width:'28%',height:1,background:'linear-gradient(90deg,transparent,rgba(240,237,232,0.05),transparent)',transform:'rotate(6deg)',transformOrigin:'right'}}/>
          {/* Binary ambient text */}
          <div style={{position:'absolute',top:'12%',left:'2%',fontFamily:'monospace',fontSize:8,color:'rgba(240,237,232,0.055)',letterSpacing:2,lineHeight:2,userSelect:'none'}}>{'01001010\n10110100\n00101101'}</div>
          <div style={{position:'absolute',bottom:'14%',right:'2%',fontFamily:'monospace',fontSize:8,color:'rgba(240,237,232,0.045)',letterSpacing:2,lineHeight:2,userSelect:'none',textAlign:'right'}}>{'10011010\n01100101'}</div>
          {/* Scanline */}
          <div style={{position:'absolute',left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(190,71,61,0.1),transparent)',animation:'gov-scan 12s linear infinite'}}/>
        </div>

        <div className="gov-page-wrap">
          <div style={{padding:'16px',border:'1px solid rgba(240,237,232,0.07)',background:'rgba(30,4,15,0.6)',marginBottom:20,position:'relative',overflow:'hidden',backdropFilter:'blur(2px)'}}>
            <div style={{position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:'radial-gradient(circle,rgba(190,71,61,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <span style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.3)',letterSpacing:2}}>// REGISTRATION PROGRESS</span>
              <span style={{fontFamily:MONO,fontSize:9,color:'#BE473D'}}>{doneCount}/{ITEMS.length}</span>
            </div>
            <div style={{height:2,background:'rgba(240,237,232,0.07)',position:'relative',overflow:'hidden',marginBottom:8}}>
              <div style={{position:'absolute',inset:0,width:pct+'%',background:'linear-gradient(90deg,#BE473D,#C8A84B)',boxShadow:'0 0 10px rgba(190,71,61,0.7)',transition:'width .8s cubic-bezier(.16,1,.3,1)'}}/>
            </div>
            <div style={{fontFamily:'monospace',fontSize:12,color:'rgba(240,237,232,0.42)',lineHeight:1.6}}>Tap any registration to expand. Tap the status badge to update progress.</div>
          </div>
          <div style={{border:'1px solid rgba(240,237,232,0.07)',borderBottom:'none'}}>
            {ITEMS.map(function(item){return<GovRow key={item.id} item={item} status={statuses[item.id]} navigate={navigate} onCycle={function(){cycle(item.id)}}/>})}
          </div>
        </div>
      </PageLayout>
  )
}