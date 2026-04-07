import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/ui/PageLayout'
import useAuthStore from '../../store/authStore'

const MONO = 'Share Tech Mono, monospace'
const CSS = `
  .gov-row{transition:all .18s;border-left:2px solid transparent;}
  .gov-row:hover{background:rgba(240,237,232,0.04)!important;border-left-color:#BE473D!important;}
  .gov-row:hover .gov-name{color:#F0EDE8!important;}
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
    <div style={{borderBottom:'1px solid rgba(240,237,232,0.06)'}}>
      <div className="gov-row" onClick={function(){setOpen(!open)}} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 12px 14px 14px',cursor:'pointer',background:'transparent'}}>
        <div style={{width:36,height:36,background:'rgba(190,71,61,0.1)',border:'1px solid rgba(190,71,61,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>{item.icon}</div>
        <div style={{flex:1,minWidth:0}}>
          <div className="gov-name" style={{fontFamily:MONO,fontSize:11,color:'rgba(240,237,232,0.7)',letterSpacing:.5,marginBottom:2,transition:'color .18s'}}>{item.name}</div>
          <div style={{fontFamily:'monospace',fontSize:9,color:'rgba(240,237,232,0.25)'}}>{item.desc} · {item.time} · {item.fee}</div>
        </div>
        <button onClick={function(e){e.stopPropagation();onCycle()}} style={{padding:'3px 8px',border:'1px solid',borderColor:cfg.border,background:'transparent',color:cfg.color,fontFamily:MONO,fontSize:8,letterSpacing:1,cursor:'pointer',flexShrink:0,transition:'all .15s'}}>{cfg.label}</button>
        <span style={{fontFamily:MONO,fontSize:13,color:'rgba(240,237,232,0.18)',flexShrink:0}}>{open?'∨':'›'}</span>
      </div>
      {open&&(
        <div style={{padding:'0 12px 16px 62px'}}>
          <div style={{marginBottom:10}}>
            <div style={{fontFamily:MONO,fontSize:8,color:'rgba(240,237,232,0.25)',letterSpacing:2,marginBottom:6}}>// REQUIREMENTS</div>
            {item.requirements.map(function(r){return<div key={r} style={{fontFamily:'monospace',fontSize:10,color:'rgba(240,237,232,0.42)',lineHeight:1.7}}>› {r}</div>})}
          </div>
          <button onClick={function(){setSteps(!steps)}} style={{background:'transparent',border:'none',cursor:'pointer',fontFamily:MONO,fontSize:9,color:'#BE473D',letterSpacing:1,padding:0,marginBottom:steps?10:0}} onMouseEnter={function(e){e.currentTarget.style.opacity='.7'}} onMouseLeave={function(e){e.currentTarget.style.opacity='1'}}>{steps?'─ HIDE GUIDE':'+ SHOW STEP-BY-STEP GUIDE'}</button>
          {steps&&(
            <div style={{marginBottom:12}}>
              {item.steps.map(function(step,i){return(
                <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:6}}>
                  <div style={{width:18,height:18,background:'#BE473D',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:MONO,fontSize:8,color:'#F0EDE8',flexShrink:0}}>{i+1}</div>
                  <div style={{fontFamily:'monospace',fontSize:10,color:'rgba(240,237,232,0.42)',lineHeight:1.65}}>{step}</div>
                </div>
              )})}
            </div>
          )}
          <div style={{display:'flex',gap:8}}>
            <button onClick={function(){navigate('/dashboard/chat',{state:{initialMessage:item.kuyaPrompt}})}} style={{flex:1,padding:'9px',background:'#BE473D',border:'none',cursor:'pointer',fontFamily:MONO,fontSize:9,color:'#F0EDE8',letterSpacing:1,transition:'opacity .18s'}} onMouseEnter={function(e){e.currentTarget.style.opacity='.85'}} onMouseLeave={function(e){e.currentTarget.style.opacity='1'}}>ASK KUYA AI</button>
            <button onClick={function(){window.open(item.link,'_blank','noopener,noreferrer')}} style={{flex:1,padding:'9px',background:'transparent',border:'1px solid rgba(240,237,232,0.1)',cursor:'pointer',fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.4)',letterSpacing:1,transition:'all .18s'}} onMouseEnter={function(e){e.currentTarget.style.color='#F0EDE8';e.currentTarget.style.borderColor='rgba(240,237,232,0.3)'}} onMouseLeave={function(e){e.currentTarget.style.color='rgba(240,237,232,0.4)';e.currentTarget.style.borderColor='rgba(240,237,232,0.1)'}}>OFFICIAL SITE</button>
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
  useEffect(function(){save(statuses,email);window.dispatchEvent(new Event('gov-status-updated'))},[statuses])
  function cycle(id){var order=['not_started','in_progress','done'];setStatuses(function(prev){var next=order[(order.indexOf(prev[id])+1)%order.length];return Object.assign({},prev,{[id]:next})})}
  var doneCount=Object.values(statuses).filter(function(s){return s==='done'}).length
  var pct=Math.round((doneCount/ITEMS.length)*100)
  return(
    <PageLayout title="GOV REGISTRATIONS" subtitle="// YOUR POST-GRAD CHECKLIST">
      <style>{CSS}</style>
      <div style={{padding:'16px',border:'1px solid rgba(240,237,232,0.08)',background:'rgba(240,237,232,0.02)',marginBottom:20,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:'radial-gradient(circle,rgba(190,71,61,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <span style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.3)',letterSpacing:2}}>// REGISTRATION PROGRESS</span>
          <span style={{fontFamily:MONO,fontSize:9,color:'#BE473D'}}>{doneCount}/{ITEMS.length}</span>
        </div>
        <div style={{height:2,background:'rgba(240,237,232,0.07)',position:'relative',overflow:'hidden',marginBottom:8}}>
          <div style={{position:'absolute',inset:0,width:pct+'%',background:'linear-gradient(90deg,#BE473D,#C8A84B)',boxShadow:'0 0 10px rgba(190,71,61,0.7)',transition:'width .8s cubic-bezier(.16,1,.3,1)'}}/>
        </div>
        <div style={{fontFamily:'monospace',fontSize:10,color:'rgba(240,237,232,0.28)',lineHeight:1.6}}>Tap any registration to expand. Tap the status badge to update progress.</div>
      </div>
      <div style={{border:'1px solid rgba(240,237,232,0.07)',borderBottom:'none'}}>
        {ITEMS.map(function(item){return<GovRow key={item.id} item={item} status={statuses[item.id]} navigate={navigate} onCycle={function(){cycle(item.id)}}/>})}
      </div>
    </PageLayout>
  )
}