import { useState, useMemo, useEffect } from 'react'
import PageLayout from '../../components/ui/PageLayout'
import { useNavigate } from 'react-router-dom'

const MONO = 'Share Tech Mono, monospace'
const CSS = `
  input::placeholder{color:rgba(240,237,232,0.2);}
  input:focus{outline:none;border-color:rgba(190,71,61,0.5)!important;}
  .topic-row{transition:all .18s;border-left:2px solid transparent;}
  .topic-row:hover{background:rgba(240,237,232,0.06)!important;border-left-color:#BE473D!important;}
  .topic-row:hover .topic-title{color:#F0EDE8!important;}

  @keyframes fin-drift-a { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-14px) rotate(6deg)} }
  @keyframes fin-drift-b { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(-4deg)} }
  @keyframes fin-pulse   { 0%,100%{opacity:0.11} 50%{opacity:0.21} }
  @keyframes fin-scan    { from{top:-2px} to{top:100%} }

  .fin-bg {
    position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden;
  }
  .fin-page-wrap { position:relative; z-index:1; }
`

var TOPICS=[
  {n:'01',title:'PAYSLIP DECODER',sub:'Understand your deductions: SSS, PhilHealth, Pag-IBIG, withholding tax',prompt:'Explain my payslip deductions in the Philippines — SSS, PhilHealth, Pag-IBIG and withholding tax. I am a fresh graduate earning ₱30,000/month.'},
  {n:'02',title:'50/30/20 BUDGETING',sub:'The simplest budgeting rule for fresh grads in the Philippines',prompt:'Explain the 50/30/20 budgeting rule for a fresh graduate in the Philippines earning ₱30,000/month. Give me a realistic breakdown with PH-specific examples.'},
  {n:'03',title:'EMERGENCY FUND',sub:'How much to save, where to keep it, and why it matters',prompt:'How do I build an emergency fund as a fresh graduate in the Philippines? How much should I save, and where should I keep it?'},
  {n:'04',title:'PAG-IBIG MP2',sub:'High-yield government savings — 6-7% annual dividend',prompt:'Explain Pag-IBIG MP2 to me as a fresh graduate. How do I enroll, what are the benefits, and is it better than a regular bank account?'},
  {n:'05',title:'UITFs & MUTUAL FUNDS',sub:'Investing basics for beginners in the Philippines',prompt:'What are UITFs and mutual funds in the Philippines? How do I start investing as a fresh graduate with a small amount?'},
  {n:'06',title:'SSS SALARY LOAN',sub:'How and when to use your SSS loan benefit',prompt:'How does the SSS salary loan work in the Philippines? When can I apply, how much can I borrow, and what are the requirements?'},
  {n:'07',title:'13TH MONTH PAY',sub:'Your legal right — how it is computed in PH',prompt:'How is the 13th month pay computed in the Philippines? Is it taxable? When should my employer pay it?'},
  {n:'08',title:'WITHHOLDING TAX',sub:'How to compute your BIR income tax in PH',prompt:'How is withholding tax computed in the Philippines for employees? I am a fresh graduate earning ₱30,000/month. How much tax will be deducted?'},
]

// PH Tax Computation (2023 TRAIN Law brackets)
function computeMonthlyTax(monthly){
  var annual=monthly*12
  var tax=0
  if(annual<=250000)tax=0
  else if(annual<=400000)tax=(annual-250000)*0.15
  else if(annual<=800000)tax=22500+(annual-400000)*0.20
  else if(annual<=2000000)tax=102500+(annual-800000)*0.25
  else if(annual<=8000000)tax=402500+(annual-2000000)*0.30
  else tax=2202500+(annual-8000000)*0.35
  return Math.round(tax/12)
}

function computeDeductions(monthly){
  // SSS: based on table, approximate
  var sss=monthly<=3250?135:monthly<=3750?157.50:monthly<=4250?180:monthly<=4750?202.50:monthly<=5250?225:monthly<=5750?247.50:monthly<=6250?270:monthly<=6750?292.50:monthly<=7250?315:monthly<=7750?337.50:monthly<=8250?360:monthly<=8750?382.50:monthly<=9250?405:monthly<=9750?427.50:monthly<=10250?450:monthly<=10750?472.50:monthly<=11250?495:monthly<=11750?517.50:monthly<=12250?540:monthly<=12750?562.50:monthly<=13250?585:monthly<=13750?607.50:monthly<=14250?630:monthly<=14750?652.50:monthly<=15250?675:monthly<=15750?697.50:monthly<=16250?720:monthly<=16750?742.50:monthly<=17250?765:monthly<=17750?787.50:monthly<=18250?810:monthly<=18750?832.50:monthly<=19250?855:monthly<=19750?877.50:900
  var philhealth=Math.min(Math.max(monthly*0.05/2,500/2),5000/2)
  var pagibig=Math.min(monthly*0.02,100)
  var wt=computeMonthlyTax(monthly)
  return {sss:Math.round(sss),philhealth:Math.round(philhealth),pagibig:Math.round(pagibig),wt,total:Math.round(sss+philhealth+pagibig+wt)}
}

export default function FinancePage(){
  var navigate=useNavigate()
  var [salary,setSalary]=useState('30000')

  useEffect(function(){ window.scrollTo(0, 0) }, [])
  var num=parseInt(salary.replace(/,/g,''))||0
  var deductions=useMemo(function(){return computeDeductions(num)},[num])
  var takehome=num-deductions.total
  var budget50=Math.round(takehome*0.5)
  var budget30=Math.round(takehome*0.3)
  var budget20=Math.round(takehome*0.2)

  return(
      <PageLayout title="FINANCE GUIDE" subtitle="// MONEY SKILLS FOR FRESH GRADS">
        <style>{CSS}</style>

        {/* ── Background layer ── */}
        <div className="fin-bg" aria-hidden="true">
          {/* Gold-tinted center glow */}
          <div style={{position:'absolute',top:'20%',left:'50%',transform:'translateX(-50%)',width:'min(90vw,520px)',height:'min(90vw,520px)',borderRadius:'50%',background:'radial-gradient(circle,rgba(200,138,75,0.12) 0%,rgba(190,71,61,0.04) 40%,transparent 68%)',animation:'fin-pulse 8s ease-in-out infinite'}}/>
          {/* Crimson top-left blob */}
          <div style={{position:'absolute',top:'-6%',left:'-6%',width:250,height:250,borderRadius:'50%',background:'radial-gradient(circle,rgba(190,71,61,0.08) 0%,transparent 65%)',animation:'fin-pulse 11s ease-in-out infinite 2s'}}/>
          {/* Bottom-right blob */}
          <div style={{position:'absolute',bottom:'8%',right:'-5%',width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(200,138,75,0.06) 0%,transparent 65%)'}}/>
          {/* Floating diamond shapes */}
          <div style={{position:'absolute',top:'6%',right:'6%',width:42,height:42,border:'1px solid rgba(200,138,75,0.18)',transform:'rotate(45deg)',animation:'fin-drift-a 10s ease-in-out infinite'}}/>
          <div style={{position:'absolute',top:'48%',right:'3%',width:24,height:24,border:'1px solid rgba(190,71,61,0.14)',transform:'rotate(30deg)',animation:'fin-drift-b 13s ease-in-out infinite 1.5s'}}/>
          <div style={{position:'absolute',bottom:'20%',left:'3%',width:32,height:32,border:'1px solid rgba(240,237,232,0.07)',transform:'rotate(20deg)',animation:'fin-drift-a 16s ease-in-out infinite 3s'}}/>
          {/* Small circle */}
          <div style={{position:'absolute',top:'32%',left:'4%',width:18,height:18,borderRadius:'50%',border:'1px solid rgba(200,138,75,0.12)',animation:'fin-drift-b 11s ease-in-out infinite 0.5s'}}/>
          {/* Corner brackets */}
          <div style={{position:'absolute',top:16,left:16,width:28,height:28,borderTop:'1px solid rgba(200,138,75,0.22)',borderLeft:'1px solid rgba(200,138,75,0.22)'}}/>
          <div style={{position:'absolute',bottom:16,right:16,width:28,height:28,borderBottom:'1px solid rgba(200,138,75,0.22)',borderRight:'1px solid rgba(200,138,75,0.22)'}}/>
          {/* Diagonal rules */}
          <div style={{position:'absolute',top:'25%',right:0,width:'32%',height:1,background:'linear-gradient(270deg,rgba(200,138,75,0.08),transparent)',transform:'rotate(8deg)',transformOrigin:'right'}}/>
          <div style={{position:'absolute',bottom:'35%',left:0,width:'26%',height:1,background:'linear-gradient(90deg,rgba(190,71,61,0.07),transparent)',transform:'rotate(-6deg)',transformOrigin:'left'}}/>
          {/* Ambient label */}
          <div style={{position:'absolute',top:'11%',right:'2%',fontFamily:'monospace',fontSize:8,color:'rgba(240,237,232,0.05)',letterSpacing:2,lineHeight:2,userSelect:'none',textAlign:'right'}}>{'// SALARY\n// DEDUCTIONS\n// SAVINGS'}</div>
          <div style={{position:'absolute',bottom:'15%',left:'2%',fontFamily:'monospace',fontSize:8,color:'rgba(240,237,232,0.045)',letterSpacing:2,lineHeight:2,userSelect:'none'}}>{'₱ 50/30/20\n// BUDGET'}</div>
          {/* Scanline */}
          <div style={{position:'absolute',left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(200,138,75,0.09),transparent)',animation:'fin-scan 16s linear infinite'}}/>
        </div>

        <div className="fin-page-wrap">
          {/* Salary calculator */}
          <div style={{marginBottom:20}}>
            {/* Tag */}
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 12px 4px 8px',border:'1px solid rgba(240,237,232,0.07)',marginBottom:14}}>
              <span style={{fontSize:11,color:'#BE473D'}}>01</span>
              <span style={{fontSize:11,letterSpacing:2,color:'rgba(240,237,232,0.5)'}}>SALARY CALCULATOR</span>
            </div>

            {/* Input */}
            <div style={{marginBottom:14}}>
              <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.3)',letterSpacing:2,marginBottom:6}}>// MONTHLY GROSS SALARY (PHP)</div>
              <input type="number" value={salary} onChange={function(e){setSalary(e.target.value)}} placeholder="e.g. 30000"
                     style={{width:'100%',padding:'13px 14px',background:'rgba(240,237,232,0.05)',border:'1px solid rgba(240,237,232,0.07)',color:'#F0EDE8',fontFamily:MONO,fontSize:14,letterSpacing:.5,transition:'border-color .18s'}}
                     onFocus={function(e){e.target.style.borderColor='rgba(190,71,61,0.5)'}}
                     onBlur={function(e){e.target.style.borderColor='rgba(240,237,232,0.1)'}}/>
            </div>

            {num>0&&(
                <div>
                  {/* Deductions */}
                  <div style={{border:'1px solid rgba(240,237,232,0.07)',borderBottom:'none',marginBottom:1}}>
                    {[
                      {l:'SSS (Employee Share)',v:deductions.sss,color:'rgba(240,237,232,0.55)'},
                      {l:'PhilHealth (Employee Share)',v:deductions.philhealth,color:'rgba(240,237,232,0.55)'},
                      {l:'Pag-IBIG (Employee Share)',v:deductions.pagibig,color:'rgba(240,237,232,0.55)'},
                      {l:'Withholding Tax (Est.)',v:deductions.wt,color:'rgba(240,237,232,0.55)'},
                    ].map(function(d){
                      return(
                          <div key={d.l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',borderBottom:'1px solid rgba(240,237,232,0.05)'}}>
                            <span style={{fontFamily:'monospace',fontSize:12,color:'rgba(240,237,232,0.52)'}}>{d.l}</span>
                            <span style={{fontFamily:MONO,fontSize:13,color:d.color,letterSpacing:.5}}>- ₱{d.v.toLocaleString()}</span>
                          </div>
                      )
                    })}
                  </div>

                  {/* Total deduction */}
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 14px',background:'rgba(190,71,61,0.07)',border:'1px solid rgba(190,71,61,0.2)',marginBottom:1}}>
                    <span style={{fontFamily:MONO,fontSize:12,color:'rgba(240,237,232,0.62)',letterSpacing:1}}>TOTAL DEDUCTIONS</span>
                    <span style={{fontFamily:MONO,fontSize:14,color:'#BE473D',letterSpacing:.5}}>- ₱{deductions.total.toLocaleString()}</span>
                  </div>

                  {/* Take-home */}
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px',background:'rgba(240,237,232,0.06)',border:'1px solid rgba(240,237,232,0.07)',marginBottom:20}}>
                    <span style={{fontFamily:MONO,fontSize:12,color:'rgba(240,237,232,0.72)',letterSpacing:1}}>MONTHLY TAKE-HOME</span>
                    <span style={{fontFamily:MONO,fontSize:20,color:'#F0EDE8',letterSpacing:'-0.5px'}}>₱{takehome.toLocaleString()}</span>
                  </div>

                  {/* 50/30/20 budget */}
                  <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 12px 4px 8px',border:'1px solid rgba(240,237,232,0.07)',marginBottom:12}}>
                    <span style={{fontSize:11,color:'#BE473D'}}>50/30/20</span>
                    <span style={{fontSize:11,letterSpacing:2,color:'rgba(240,237,232,0.5)'}}>BUDGET BREAKDOWN</span>
                  </div>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:1,background:'rgba(240,237,232,0.05)',marginBottom:20}}>
                    {[
                      {l:'NEEDS (50%)',v:budget50,sub:'Rent, food, transport, utilities',accent:'#BE473D'},
                      {l:'WANTS (30%)',v:budget30,sub:'Leisure, dining out, subscriptions',accent:'#C8A84B'},
                      {l:'SAVINGS (20%)',v:budget20,sub:'Emergency fund, investments',accent:'#34D399'},
                    ].map(function(b){
                      return(
                          <div key={b.l} style={{padding:'14px 12px',background:'#3C091E',position:'relative',overflow:'hidden'}}>
                            <div style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:b.accent}}/>
                            <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.38)',letterSpacing:1.5,marginBottom:6,lineHeight:1.3}}>{b.l}</div>
                            <div style={{fontFamily:MONO,fontSize:18,color:'#F0EDE8',letterSpacing:'-0.5px',marginBottom:4}}>₱{b.v.toLocaleString()}</div>
                            <div style={{fontFamily:'monospace',fontSize:10,color:'rgba(240,237,232,0.35)',lineHeight:1.5}}>{b.sub}</div>
                          </div>
                      )
                    })}
                  </div>
                </div>
            )}
          </div>

          {/* Topics */}
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 12px 4px 8px',border:'1px solid rgba(240,237,232,0.07)',marginBottom:14}}>
            <span style={{fontSize:11,color:'#BE473D'}}>02</span>
            <span style={{fontSize:11,letterSpacing:2,color:'rgba(240,237,232,0.5)'}}>MONEY TOPICS</span>
          </div>

          <div style={{border:'1px solid rgba(240,237,232,0.07)',borderBottom:'none'}}>
            {TOPICS.map(function(t){
              return(
                  <button key={t.n} className="topic-row" onClick={function(){navigate('/dashboard/chat',{state:{initialMessage:t.prompt}})}}
                          style={{width:'100%',display:'flex',alignItems:'center',gap:14,padding:'18px 14px 18px 16px',borderBottom:'1px solid rgba(240,237,232,0.05)',background:'transparent',border:'none',borderBottom:'1px solid rgba(240,237,232,0.05)',cursor:'pointer',textAlign:'left'}}>
                    <span style={{fontFamily:MONO,fontSize:11,color:'rgba(240,237,232,0.32)',letterSpacing:1,width:26,flexShrink:0}}>{t.n}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div className="topic-title" style={{fontFamily:MONO,fontSize:15,color:'rgba(240,237,232,0.85)',letterSpacing:.5,marginBottom:5,transition:'color .18s'}}>{t.title}</div>
                      <div style={{fontFamily:'monospace',fontSize:12,color:'rgba(240,237,232,0.42)',lineHeight:1.5}}>{t.sub}</div>
                    </div>
                    <span style={{fontFamily:MONO,fontSize:22,color:'rgba(240,237,232,0.28)',flexShrink:0}}>›</span>
                  </button>
              )
            })}
          </div>
        </div>
      </PageLayout>
  )
}