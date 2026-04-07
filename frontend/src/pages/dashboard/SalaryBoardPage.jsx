import { useState } from 'react'
import PageLayout from '../../components/ui/PageLayout'
import { useQuery } from '@tanstack/react-query'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'

const MONO = 'Share Tech Mono, monospace'
const CSS = `
  input::placeholder{color:rgba(240,237,232,0.2);}
  input:focus,select:focus,textarea:focus{outline:none;border-color:rgba(190,71,61,0.5)!important;}
  select{font-family:'Share Tech Mono',monospace!important;}
  .sal-row{transition:all .18s;border-left:2px solid transparent;}
  .sal-row:hover{background:rgba(240,237,232,0.03)!important;border-left-color:#BE473D!important;}
  .modal-sheet::-webkit-scrollbar{width:2px;}
  .modal-sheet::-webkit-scrollbar-thumb{background:#BE473D;}
`
var INDUSTRIES=['Technology','Banking','BPO','Healthcare','Pharmaceutical','Audit','Engineering','Manufacturing','FMCG','Telecommunications','E-commerce','Fintech','Real Estate','IT Services','Retail','Food and Beverage','Aviation','Semiconductor','Conglomerate','Other']
var WORK_SETUPS=['Hybrid','WFH','Onsite','Field']

function useSearch(params){
  return useQuery({queryKey:['salary-search',params],queryFn:async function(){
    var q=[]
    if(params.industry)q.push('industry='+encodeURIComponent(params.industry))
    if(params.company)q.push('company='+encodeURIComponent(params.company))
    if(params.jobTitle)q.push('jobTitle='+encodeURIComponent(params.jobTitle))
    var r=await api.get('/api/salary/search'+(q.length?'?'+q.join('&'):''))
    return r.data
  }})
}
function useIndustries(){
  return useQuery({queryKey:['salary-industries'],queryFn:async function(){var r=await api.get('/api/salary/industries');return r.data}})
}

function Inp({value,onChange,placeholder,type='text'}){
  return(
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{width:'100%',padding:'12px 14px',background:'rgba(240,237,232,0.05)',border:'1px solid rgba(240,237,232,0.1)',color:'#F0EDE8',fontFamily:MONO,fontSize:12,letterSpacing:.5,transition:'border-color .18s'}}
      onFocus={function(e){e.target.style.borderColor='rgba(190,71,61,0.5)'}}
      onBlur={function(e){e.target.style.borderColor='rgba(240,237,232,0.1)'}} />
  )
}

function SubmitModal({onClose,onSave,user}){
  var [f,setF]=useState({jobTitle:'',company:'',industry:'',monthlySalary:'',yearsExp:'0',region:user?.region||'',workSetup:'',isAnonymous:true})
  var [loading,setLoading]=useState(false)
  function u(k,v){setF(function(p){return Object.assign({},p,{[k]:v})})}

  async function submit(){
    if(!f.jobTitle||!f.company||!f.industry||!f.monthlySalary)return
    setLoading(true)
    try{
      await api.post('/api/salary',{jobTitle:f.jobTitle,company:f.company,industry:f.industry,monthlySalary:parseInt(f.monthlySalary),yearsExp:parseInt(f.yearsExp)||0,region:f.region||null,workSetup:f.workSetup||null,isAnonymous:f.isAnonymous})
      onSave();onClose()
    }catch(e){console.error(e)}finally{setLoading(false)}
  }

  var can=f.jobTitle&&f.company&&f.industry&&f.monthlySalary

  return(
    /* zIndex 600 — above bottom nav (zIndex 200) */
    <div style={{position:'fixed',inset:0,background:'rgba(28,5,18,0.88)',zIndex:600,display:'flex',alignItems:'flex-end',justifyContent:'center'}}
      onClick={function(e){if(e.target===e.currentTarget)onClose()}}>

      <div className="modal-sheet" style={{
        background:'#2A0515',border:'1px solid rgba(240,237,232,0.1)',borderBottom:'none',
        width:'100%',maxWidth:560,maxHeight:'88vh',overflowY:'auto',
        padding:24,
        paddingBottom:'calc(72px + 32px)',  /* ← KEY FIX: clears the bottom nav */
      }}>
        <style>{CSS}</style>

        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 12px 4px 8px',border:'1px solid rgba(240,237,232,0.1)'}}>
            <span style={{fontSize:9,color:'#BE473D'}}>NEW</span>
            <span style={{fontSize:9,letterSpacing:2,color:'rgba(240,237,232,0.4)'}}>SALARY ENTRY</span>
          </div>
          <button onClick={onClose} style={{background:'transparent',border:'1px solid rgba(240,237,232,0.1)',color:'rgba(240,237,232,0.4)',width:32,height:32,cursor:'pointer',fontFamily:MONO,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
        </div>

        {/* Anonymous toggle */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px',background:'rgba(240,237,232,0.04)',border:'1px solid rgba(240,237,232,0.07)',marginBottom:18}}>
          <div>
            <div style={{fontFamily:MONO,fontSize:10,color:'#F0EDE8',letterSpacing:.5,marginBottom:2}}>POST ANONYMOUSLY</div>
            <div style={{fontFamily:'monospace',fontSize:9,color:'rgba(240,237,232,0.3)'}}>Your name won't appear publicly</div>
          </div>
          <button onClick={function(){u('isAnonymous',!f.isAnonymous)}}
            style={{width:44,height:24,borderRadius:12,border:'none',cursor:'pointer',background:f.isAnonymous?'#BE473D':'rgba(240,237,232,0.12)',position:'relative',transition:'background .2s',flexShrink:0}}>
            <span style={{position:'absolute',top:3,left:f.isAnonymous?23:3,width:18,height:18,background:'#F0EDE8',borderRadius:'50%',transition:'left .2s',display:'block'}}/>
          </button>
        </div>

        {/* Text fields */}
        {[{k:'jobTitle',l:'JOB TITLE *',p:'e.g. Junior Software Engineer'},{k:'company',l:'COMPANY *',p:'e.g. GCash'}].map(function(fi){
          return(
            <div key={fi.k} style={{marginBottom:12}}>
              <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.3)',letterSpacing:2,marginBottom:6}}>// {fi.l}</div>
              <Inp value={f[fi.k]} onChange={function(e){u(fi.k,e.target.value)}} placeholder={fi.p}/>
            </div>
          )
        })}

        {/* Industry */}
        <div style={{marginBottom:12}}>
          <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.3)',letterSpacing:2,marginBottom:6}}>// INDUSTRY *</div>
          <select value={f.industry} onChange={function(e){u('industry',e.target.value)}}
            style={{width:'100%',padding:'12px 14px',background:'rgba(240,237,232,0.05)',border:'1px solid rgba(240,237,232,0.1)',color:f.industry?'#F0EDE8':'rgba(240,237,232,0.25)',fontFamily:MONO,fontSize:12,appearance:'auto',transition:'border-color .18s'}}
            onFocus={function(e){e.target.style.borderColor='rgba(190,71,61,0.5)'}}
            onBlur={function(e){e.target.style.borderColor='rgba(240,237,232,0.1)'}}>
            <option value="">Select industry</option>
            {INDUSTRIES.map(function(i){return<option key={i} value={i}>{i}</option>})}
          </select>
        </div>

        {/* Salary + exp */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
          <div>
            <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.3)',letterSpacing:2,marginBottom:6}}>// MONTHLY SALARY *</div>
            <Inp type="number" value={f.monthlySalary} onChange={function(e){u('monthlySalary',e.target.value)}} placeholder="e.g. 35000"/>
          </div>
          <div>
            <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.3)',letterSpacing:2,marginBottom:6}}>// YEARS EXP</div>
            <Inp type="number" value={f.yearsExp} onChange={function(e){u('yearsExp',e.target.value)}} placeholder="0"/>
          </div>
        </div>

        {/* Work setup */}
        <div style={{marginBottom:20}}>
          <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.3)',letterSpacing:2,marginBottom:8}}>// WORK SETUP</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {WORK_SETUPS.map(function(ws){
              var a=f.workSetup===ws
              return(
                <button key={ws} onClick={function(){u('workSetup',a?'':ws)}}
                  style={{padding:'5px 12px',border:'1px solid',borderColor:a?'#BE473D':'rgba(240,237,232,0.1)',background:a?'rgba(190,71,61,0.1)':'transparent',color:a?'#BE473D':'rgba(240,237,232,0.3)',fontFamily:MONO,fontSize:9,letterSpacing:1,cursor:'pointer',transition:'all .15s'}}>
                  {ws}
                </button>
              )
            })}
          </div>
        </div>

        {/* Submit — always accessible */}
        <button onClick={submit} disabled={loading||!can}
          style={{width:'100%',padding:'16px',background:loading||!can?'rgba(190,71,61,0.3)':'#BE473D',border:'none',cursor:loading||!can?'not-allowed':'pointer',fontFamily:MONO,fontSize:11,color:'#F0EDE8',letterSpacing:3,transition:'opacity .18s'}}
          onMouseEnter={function(e){if(!loading&&can)e.currentTarget.style.opacity='.85'}}
          onMouseLeave={function(e){e.currentTarget.style.opacity='1'}}>
          {loading?'SUBMITTING...':'SHARE ANONYMOUSLY'}
        </button>
      </div>
    </div>
  )
}

function SalaryRow({s}){
  var expLabel=s.yearsExp===0?'Fresh grad':s.yearsExp+' yr'+(s.yearsExp>1?'s':'')+' exp'
  return(
    <div className="sal-row" style={{display:'flex',alignItems:'flex-start',gap:14,padding:'16px 12px 16px 14px',borderBottom:'1px solid rgba(240,237,232,0.06)',background:'transparent'}}>
      <div style={{width:32,height:32,background:'rgba(190,71,61,0.12)',border:'1px solid rgba(190,71,61,0.22)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:MONO,fontSize:13,color:'#BE473D',flexShrink:0}}>
        {s.company?s.company.charAt(0).toUpperCase():'C'}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:MONO,fontSize:11,color:'rgba(240,237,232,0.7)',letterSpacing:.5,marginBottom:2}}>{s.jobTitle}</div>
        <div style={{fontFamily:'monospace',fontSize:9,color:'rgba(240,237,232,0.28)',marginBottom:6}}>{s.company}{s.industry?' · '+s.industry:''}</div>
        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          {s.workSetup&&<span style={{fontFamily:MONO,fontSize:8,color:'rgba(240,237,232,0.28)',padding:'2px 6px',border:'1px solid rgba(240,237,232,0.07)'}}>{s.workSetup}</span>}
          <span style={{fontFamily:MONO,fontSize:8,color:'rgba(240,237,232,0.28)',padding:'2px 6px',border:'1px solid rgba(240,237,232,0.07)'}}>{expLabel}</span>
          {s.region&&<span style={{fontFamily:MONO,fontSize:8,color:'rgba(240,237,232,0.2)',padding:'2px 6px',border:'1px solid rgba(240,237,232,0.06)'}}>{s.region.split('(')[0].trim()}</span>}
        </div>
      </div>
      <div style={{textAlign:'right',flexShrink:0}}>
        <div style={{fontFamily:MONO,fontSize:16,color:'#BE473D',letterSpacing:'-0.5px',lineHeight:1}}>₱{Number(s.monthlySalary).toLocaleString()}</div>
        <div style={{fontFamily:MONO,fontSize:8,color:'rgba(240,237,232,0.2)',marginTop:2}}>/ MONTH</div>
      </div>
    </div>
  )
}

export default function SalaryBoardPage(){
  var {user}=useAuthStore()
  var [showModal,setShowModal]=useState(false)
  var [search,setSearch]=useState({industry:'',company:'',jobTitle:''})
  var [active,setActive]=useState({industry:'',company:'',jobTitle:''})
  var [indFilter,setIndFilter]=useState('')
  var {data:salaries=[],isLoading,refetch}=useSearch(active)
  var {data:industries=[]}=useIndustries()

  function doSearch(e){e.preventDefault();setActive(Object.assign({},search))}
  function setInd(ind){setIndFilter(ind);var next=Object.assign({},search,{industry:ind});setSearch(next);setActive(next)}

  var avg=salaries.length>0?Math.round(salaries.reduce(function(s,x){return s+x.monthlySalary},0)/salaries.length):null
  var fresh=salaries.filter(function(s){return s.yearsExp===0})
  var freshAvg=fresh.length>0?Math.round(fresh.reduce(function(s,x){return s+x.monthlySalary},0)/fresh.length):null

  return(
    <PageLayout title="SALARY BOARD" subtitle="// REAL ANONYMOUS PH SALARIES">
      <style>{CSS}</style>

      {/* Summary */}
      <div style={{padding:'16px',border:'1px solid rgba(240,237,232,0.08)',background:'rgba(240,237,232,0.02)',marginBottom:16,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:'radial-gradient(circle,rgba(190,71,61,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.3)',letterSpacing:2,marginBottom:4}}>// COMMUNITY-POWERED · ANONYMOUS</div>
        <div style={{fontFamily:'monospace',fontSize:10,color:'rgba(240,237,232,0.35)',marginBottom:avg?14:0}}>{salaries.length} salary records in the database</div>
        {avg&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:1,background:'rgba(240,237,232,0.05)'}}>
            <div style={{padding:'12px',background:'#3C091E'}}>
              <div style={{fontFamily:MONO,fontSize:8,color:'rgba(240,237,232,0.22)',letterSpacing:2,marginBottom:4}}>AVG SALARY</div>
              <div style={{fontFamily:MONO,fontSize:20,color:'#BE473D',letterSpacing:'-1px'}}>₱{Number(avg).toLocaleString()}</div>
              <div style={{fontFamily:MONO,fontSize:8,color:'rgba(240,237,232,0.18)',marginTop:2}}>{salaries.length} ENTRIES</div>
            </div>
            {freshAvg&&(
              <div style={{padding:'12px',background:'#3C091E'}}>
                <div style={{fontFamily:MONO,fontSize:8,color:'rgba(240,237,232,0.22)',letterSpacing:2,marginBottom:4}}>FRESH GRAD AVG</div>
                <div style={{fontFamily:MONO,fontSize:20,color:'#F0EDE8',letterSpacing:'-1px'}}>₱{Number(freshAvg).toLocaleString()}</div>
                <div style={{fontFamily:MONO,fontSize:8,color:'rgba(240,237,232,0.18)',marginTop:2}}>{fresh.length} ENTRIES</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share CTA */}
      <button onClick={function(){setShowModal(true)}}
        style={{width:'100%',padding:'12px',background:'transparent',border:'1px solid rgba(190,71,61,0.35)',cursor:'pointer',fontFamily:MONO,fontSize:10,color:'#BE473D',letterSpacing:3,marginBottom:14,transition:'all .18s'}}
        onMouseEnter={function(e){e.currentTarget.style.background='rgba(190,71,61,0.08)'}}
        onMouseLeave={function(e){e.currentTarget.style.background='transparent'}}>
        + SHARE YOUR SALARY
      </button>

      {/* Search */}
      <form onSubmit={doSearch} style={{display:'flex',gap:8,marginBottom:10}}>
        <input type="text" value={search.jobTitle} onChange={function(e){setSearch(Object.assign({},search,{jobTitle:e.target.value}))}} placeholder="Search role or company..."
          style={{flex:1,padding:'10px 14px',background:'rgba(240,237,232,0.05)',border:'1px solid rgba(240,237,232,0.1)',color:'#F0EDE8',fontFamily:MONO,fontSize:11,letterSpacing:.5,transition:'border-color .18s'}}
          onFocus={function(e){e.target.style.borderColor='rgba(190,71,61,0.5)'}}
          onBlur={function(e){e.target.style.borderColor='rgba(240,237,232,0.1)'}}/>
        <button type="submit" style={{padding:'10px 16px',background:'#BE473D',border:'none',cursor:'pointer',fontFamily:MONO,fontSize:9,color:'#F0EDE8',letterSpacing:1,flexShrink:0}}>SEARCH</button>
      </form>

      {/* Industry tabs */}
      <div style={{display:'flex',gap:6,overflowX:'auto',marginBottom:16,paddingBottom:4}}>
        {['All'].concat(industries).map(function(ind){
          var key=ind==='All'?'':ind
          var isActive=indFilter===key
          return(
            <button key={ind} onClick={function(){setInd(key)}}
              style={{flexShrink:0,padding:'4px 10px',border:'1px solid',borderColor:isActive?'#BE473D':'rgba(240,237,232,0.1)',background:'transparent',color:isActive?'#BE473D':'rgba(240,237,232,0.3)',fontFamily:MONO,fontSize:8,letterSpacing:1,cursor:'pointer',whiteSpace:'nowrap',transition:'all .15s'}}>
              {ind}
            </button>
          )
        })}
      </div>

      {/* Results */}
      {isLoading&&<div style={{border:'1px solid rgba(240,237,232,0.06)',padding:28,textAlign:'center',fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.2)',letterSpacing:2}}>LOADING...</div>}
      {!isLoading&&salaries.length===0&&<div style={{border:'1px solid rgba(240,237,232,0.06)',padding:28,textAlign:'center',fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.25)',letterSpacing:1}}>NO RESULTS. TRY DIFFERENT FILTERS.</div>}
      {!isLoading&&salaries.length>0&&(
        <div style={{border:'1px solid rgba(240,237,232,0.07)',borderBottom:'none'}}>
          {salaries.map(function(s){return<SalaryRow key={s.id} s={s}/>})}
        </div>
      )}

      {showModal&&<SubmitModal onClose={function(){setShowModal(false)}} onSave={refetch} user={user}/>}
    </PageLayout>
  )
}