import { useState, useEffect } from 'react'
import PageLayout from '../../components/ui/PageLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'

const MONO = 'Share Tech Mono, monospace'
const CSS = `
  .t-row{transition:all .18s;border-left:2px solid transparent;}
  .t-row:hover{background:rgba(240,237,232,0.06)!important;border-left-color:#BE473D!important;}
  .t-row:hover .t-role{color:#F0EDE8!important;}
  input::placeholder{color:rgba(240,237,232,0.2);}
  input:focus,select:focus,textarea:focus{outline:none;border-color:rgba(190,71,61,0.5)!important;}
  select{font-family:'Share Tech Mono',monospace!important;}
  .modal-sheet::-webkit-scrollbar{width:2px;}
  .modal-sheet::-webkit-scrollbar-thumb{background:#BE473D;}
`
var STATUSES=[
  {key:'WISHLIST',label:'Wishlist',color:'rgba(240,237,232,0.35)'},
  {key:'APPLIED',label:'Applied',color:'#60A5FA'},
  {key:'INTERVIEW',label:'Interview',color:'#FBBF24'},
  {key:'OFFER',label:'Offer',color:'#34D399'},
  {key:'ACCEPTED',label:'Accepted',color:'#BE473D'},
  {key:'REJECTED',label:'Rejected',color:'rgba(240,237,232,0.25)'},
  {key:'GHOSTED',label:'Ghosted',color:'#C4B5FD'},
]
function gs(key){return STATUSES.find(function(s){return s.key===key})||STATUSES[1]}

function Inp({value,onChange,placeholder,type='text'}){
  return(
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
             style={{width:'100%',padding:'12px 14px',background:'rgba(240,237,232,0.05)',border:'1px solid rgba(240,237,232,0.07)',color:'#F0EDE8',fontFamily:MONO,fontSize:12,letterSpacing:.5,transition:'border-color .18s'}}
             onFocus={function(e){e.target.style.borderColor='rgba(190,71,61,0.5)'}}
             onBlur={function(e){e.target.style.borderColor='rgba(240,237,232,0.1)'}} />
  )
}

function AddModal({onClose,onSave}){
  var [f,setF]=useState({company:'',role:'',location:'',workSetup:'',salaryMin:'',salaryMax:'',jobUrl:'',notes:'',status:'APPLIED'})
  var [loading,setLoading]=useState(false)
  function u(k,v){setF(function(p){return Object.assign({},p,{[k]:v})})}

  async function save(){
    if(!f.company||!f.role)return
    setLoading(true)
    try{
      await api.post('/api/tracker',{
        company:f.company,role:f.role,location:f.location||null,
        workSetup:f.workSetup||null,salaryMin:f.salaryMin?parseInt(f.salaryMin):null,
        salaryMax:f.salaryMax?parseInt(f.salaryMax):null,jobUrl:f.jobUrl||null,
        notes:f.notes||null,status:f.status
      })
      onSave();onClose()
    }catch(e){console.error(e)}finally{setLoading(false)}
  }

  return(
      /* Overlay — zIndex 600 to sit ABOVE the bottom nav (zIndex 200) */
      <div style={{position:'fixed',inset:0,background:'rgba(28,5,18,0.88)',zIndex:600,display:'flex',alignItems:'flex-end',justifyContent:'center'}}
           onClick={function(e){if(e.target===e.currentTarget)onClose()}}>

        {/* Sheet — paddingBottom accounts for bottom nav (72px) + breathing room (24px) */}
        <div className="modal-sheet" style={{
          background:'#2A0515',border:'1px solid rgba(240,237,232,0.07)',
          borderBottom:'none',
          width:'100%',maxWidth:560,
          maxHeight:'88vh',overflowY:'auto',
          padding:24,
          paddingBottom:'calc(72px + 32px)',  /* ← KEY FIX */
        }}>
          <style>{CSS}</style>

          {/* Header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 12px 4px 8px',border:'1px solid rgba(240,237,232,0.07)'}}>
              <span style={{fontSize:11,color:'#BE473D'}}>NEW</span>
              <span style={{fontSize:11,letterSpacing:2,color:'rgba(240,237,232,0.55)'}}>APPLICATION</span>
            </div>
            <button onClick={onClose} style={{background:'transparent',border:'1px solid rgba(240,237,232,0.07)',color:'rgba(240,237,232,0.4)',width:32,height:32,cursor:'pointer',fontFamily:MONO,fontSize:12,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
          </div>

          {/* Status pills */}
          <div style={{marginBottom:18}}>
            <div style={{fontFamily:MONO,fontSize:10,color:'rgba(240,237,232,0.42)',letterSpacing:2,marginBottom:8}}>// STATUS</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {STATUSES.map(function(s){
                var a=f.status===s.key
                return(
                    <button key={s.key} onClick={function(){u('status',s.key)}} style={{padding:'5px 11px',border:'1px solid',borderColor:a?s.color:'rgba(240,237,232,0.1)',background:a?'rgba(240,237,232,0.04)':'transparent',color:a?s.color:'rgba(240,237,232,0.25)',fontFamily:MONO,fontSize:9,letterSpacing:1,cursor:'pointer',transition:'all .15s'}}>
                      {s.label.toUpperCase()}
                    </button>
                )
              })}
            </div>
          </div>

          {/* Fields */}
          {[
            {k:'company',l:'COMPANY *',p:'e.g. GCash'},
            {k:'role',l:'ROLE *',p:'e.g. Junior Software Engineer'},
            {k:'location',l:'LOCATION',p:'e.g. BGC, Taguig'},
            {k:'workSetup',l:'WORK SETUP',p:'Hybrid / WFH / Onsite'},
            {k:'jobUrl',l:'JOB URL',p:'https://...'},
          ].map(function(fi){
            return(
                <div key={fi.k} style={{marginBottom:12}}>
                  <div style={{fontFamily:MONO,fontSize:10,color:'rgba(240,237,232,0.42)',letterSpacing:2,marginBottom:6}}>// {fi.l}</div>
                  <Inp value={f[fi.k]} onChange={function(e){u(fi.k,e.target.value)}} placeholder={fi.p}/>
                </div>
            )
          })}

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
            <div>
              <div style={{fontFamily:MONO,fontSize:10,color:'rgba(240,237,232,0.42)',letterSpacing:2,marginBottom:6}}>// MIN SALARY (PHP)</div>
              <Inp type="number" value={f.salaryMin} onChange={function(e){u('salaryMin',e.target.value)}} placeholder="35000"/>
            </div>
            <div>
              <div style={{fontFamily:MONO,fontSize:10,color:'rgba(240,237,232,0.42)',letterSpacing:2,marginBottom:6}}>// MAX SALARY (PHP)</div>
              <Inp type="number" value={f.salaryMax} onChange={function(e){u('salaryMax',e.target.value)}} placeholder="50000"/>
            </div>
          </div>

          <div style={{marginBottom:20}}>
            <div style={{fontFamily:MONO,fontSize:10,color:'rgba(240,237,232,0.42)',letterSpacing:2,marginBottom:6}}>// NOTES</div>
            <textarea value={f.notes} onChange={function(e){u('notes',e.target.value)}} placeholder="Notes, next steps..."
                      rows={3} style={{width:'100%',padding:'12px 14px',background:'rgba(240,237,232,0.05)',border:'1px solid rgba(240,237,232,0.07)',color:'#F0EDE8',fontFamily:MONO,fontSize:11,resize:'none',letterSpacing:.3,transition:'border-color .18s'}}
                      onFocus={function(e){e.target.style.borderColor='rgba(190,71,61,0.5)'}}
                      onBlur={function(e){e.target.style.borderColor='rgba(240,237,232,0.1)'}} />
          </div>

          {/* Save button — big, always fully visible above the padding */}
          <button onClick={save} disabled={loading||!f.company||!f.role}
                  style={{width:'100%',padding:'16px',background:loading||!f.company||!f.role?'rgba(190,71,61,0.3)':'#BE473D',border:'none',cursor:loading||!f.company||!f.role?'not-allowed':'pointer',fontFamily:MONO,fontSize:11,color:'#F0EDE8',letterSpacing:3,transition:'opacity .18s'}}
                  onMouseEnter={function(e){if(!loading&&f.company&&f.role)e.currentTarget.style.opacity='.85'}}
                  onMouseLeave={function(e){e.currentTarget.style.opacity='1'}}>
            {loading?'SAVING...':'SAVE APPLICATION'}
          </button>
        </div>
      </div>
  )
}

function AppRow({app,onStatusChange,onDelete}){
  var [open,setOpen]=useState(false)
  var s=gs(app.status)
  function openJob(e){
    e.stopPropagation()
    var url=app.jobUrl;if(!url)return
    if(!url.startsWith('http'))url='https://'+url
    window.open(url,'_blank','noopener,noreferrer')
  }
  return(
      <div style={{borderBottom:'1px solid rgba(240,237,232,0.05)'}}>
        <div className="t-row" onClick={function(){setOpen(!open)}}
             style={{display:'flex',alignItems:'center',gap:14,padding:'14px 12px 14px 14px',cursor:'pointer',background:'transparent'}}>
          <div style={{width:32,height:32,background:'rgba(190,71,61,0.12)',border:'1px solid rgba(190,71,61,0.22)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:MONO,fontSize:13,color:'#BE473D',flexShrink:0}}>
            {app.company?app.company.charAt(0).toUpperCase():'C'}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div className="t-role" style={{fontFamily:MONO,fontSize:14,color:'rgba(240,237,232,0.85)',letterSpacing:.5,marginBottom:3,transition:'color .18s'}}>{app.role}</div>
            <div style={{fontFamily:'monospace',fontSize:9,color:'rgba(240,237,232,0.25)'}}>{app.company}{app.location?' · '+app.location:''}</div>
          </div>
          <div onClick={function(e){e.stopPropagation()}}>
            <select value={app.status} onChange={function(e){onStatusChange(app.id,e.target.value)}}
                    style={{background:'rgba(240,237,232,0.05)',border:'1px solid rgba(240,237,232,0.07)',color:s.color,fontFamily:MONO,fontSize:10,letterSpacing:1,padding:'5px 8px',cursor:'pointer'}}>
              {STATUSES.map(function(st){return<option key={st.key} value={st.key}>{st.label}</option>})}
            </select>
          </div>
          <span style={{fontFamily:MONO,fontSize:16,color:'rgba(240,237,232,0.28)',flexShrink:0}}>{open?'∨':'›'}</span>
        </div>
        {open&&(
            <div style={{padding:'0 12px 14px 60px'}}>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:app.notes?8:10}}>
                {app.workSetup&&<span style={{fontFamily:MONO,fontSize:10,color:'rgba(240,237,232,0.42)',padding:'3px 9px',border:'1px solid rgba(240,237,232,0.07)'}}>{app.workSetup}</span>}
                {app.salaryMin&&app.salaryMax&&<span style={{fontFamily:MONO,fontSize:10,color:'rgba(240,237,232,0.42)',padding:'3px 9px',border:'1px solid rgba(240,237,232,0.07)'}}>₱{Number(app.salaryMin).toLocaleString()}–{Number(app.salaryMax).toLocaleString()}</span>}
              </div>
              {app.notes&&<div style={{fontFamily:'monospace',fontSize:12,color:'rgba(240,237,232,0.45)',lineHeight:1.65,marginBottom:10,padding:'8px 10px',background:'rgba(240,237,232,0.03)',border:'1px solid rgba(240,237,232,0.05)'}}>{app.notes}</div>}
              <div style={{display:'flex',gap:8}}>
                {app.jobUrl&&(
                    <button onClick={openJob} style={{flex:1,padding:'9px',background:'transparent',border:'1px solid rgba(240,237,232,0.07)',fontFamily:MONO,fontSize:10,color:'rgba(240,237,232,0.55)',cursor:'pointer',letterSpacing:1,transition:'all .18s'}}
                            onMouseEnter={function(e){e.currentTarget.style.color='#F0EDE8';e.currentTarget.style.borderColor='rgba(190,71,61,0.4)'}}
                            onMouseLeave={function(e){e.currentTarget.style.color='rgba(240,237,232,0.45)';e.currentTarget.style.borderColor='rgba(240,237,232,0.1)'}}>VIEW POST</button>
                )}
                <button onClick={function(){if(window.confirm('Remove this application?'))onDelete(app.id)}}
                        style={{flex:1,padding:'9px',background:'transparent',border:'1px solid rgba(190,71,61,0.18)',fontFamily:MONO,fontSize:10,color:'rgba(190,71,61,0.65)',cursor:'pointer',letterSpacing:1,transition:'all .18s'}}
                        onMouseEnter={function(e){e.currentTarget.style.color='#BE473D';e.currentTarget.style.borderColor='rgba(190,71,61,0.5)'}}
                        onMouseLeave={function(e){e.currentTarget.style.color='rgba(190,71,61,0.55)';e.currentTarget.style.borderColor='rgba(190,71,61,0.18)'}}>REMOVE</button>
              </div>
            </div>
        )}
      </div>
  )
}

export default function JobTrackerPage(){
  var qc=useQueryClient()
  useEffect(function(){ window.scrollTo(0, 0) }, [])
  var {data:apps=[],isLoading}=useQuery({queryKey:['tracker'],queryFn:async function(){var r=await api.get('/api/tracker');return r.data}})
  var {data:stats={}}=useQuery({queryKey:['tracker-stats'],queryFn:async function(){var r=await api.get('/api/tracker/stats');return r.data}})
  var [showAdd,setShowAdd]=useState(false)
  var [filter,setFilter]=useState('ALL')
  var upd=useMutation({mutationFn:async function(p){return api.patch('/api/tracker/'+p.id,{status:p.status})},onSuccess:function(){qc.invalidateQueries({queryKey:['tracker']});qc.invalidateQueries({queryKey:['tracker-stats']})}})
  var del=useMutation({mutationFn:async function(id){return api.delete('/api/tracker/'+id)},onSuccess:function(){qc.invalidateQueries({queryKey:['tracker']});qc.invalidateQueries({queryKey:['tracker-stats']})}})
  function onSaved(){qc.invalidateQueries({queryKey:['tracker']});qc.invalidateQueries({queryKey:['tracker-stats']})}
  var filtered=filter==='ALL'?apps:apps.filter(function(a){return a.status===filter})

  return(
      <PageLayout title="JOB TRACKER" subtitle="// TRACK EVERY APPLICATION">
        <style>{CSS}</style>

        {/* Stats grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:'rgba(240,237,232,0.05)',marginBottom:20}}>
          {[{l:'TOTAL',v:stats.total||0},{l:'APPLIED',v:stats.applied||0},{l:'INTERVIEW',v:stats.interview||0},{l:'OFFERS',v:stats.offer||0},{l:'ACCEPTED',v:stats.accepted||0},{l:'REJECTED',v:stats.rejected||0}].map(function(c){
            return(
                <div key={c.l} style={{padding:'12px',background:'#3C091E'}}>
                  <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.32)',letterSpacing:2,marginBottom:4}}>{c.l}</div>
                  <div style={{fontFamily:MONO,fontSize:20,color:'#F0EDE8',letterSpacing:'-1px'}}>{c.v}</div>
                </div>
            )
          })}
        </div>

        {/* Add button */}
        <button onClick={function(){setShowAdd(true)}}
                style={{width:'100%',padding:'13px',background:'#BE473D',border:'none',cursor:'pointer',fontFamily:MONO,fontSize:10,color:'#F0EDE8',letterSpacing:3,marginBottom:14,transition:'opacity .18s'}}
                onMouseEnter={function(e){e.currentTarget.style.opacity='.85'}}
                onMouseLeave={function(e){e.currentTarget.style.opacity='1'}}>
          + ADD APPLICATION
        </button>

        {/* Filter tabs */}
        <div style={{display:'flex',gap:6,overflowX:'auto',marginBottom:16,paddingBottom:4}}>
          {['ALL'].concat(STATUSES.map(function(s){return s.key})).map(function(key){
            var active=filter===key
            var count=key==='ALL'?apps.length:apps.filter(function(a){return a.status===key}).length
            return(
                <button key={key} onClick={function(){setFilter(key)}}
                        style={{flexShrink:0,padding:'5px 11px',border:'1px solid',borderColor:active?'#BE473D':'rgba(240,237,232,0.1)',background:'transparent',color:active?'#BE473D':'rgba(240,237,232,0.3)',fontFamily:MONO,fontSize:10,letterSpacing:1,cursor:'pointer',whiteSpace:'nowrap',transition:'all .15s'}}>
                  {key==='ALL'?'ALL':gs(key).label.toUpperCase()}{count>0?' ('+count+')':''}
                </button>
            )
          })}
        </div>

        {/* List */}
        {isLoading&&(
            <div style={{border:'1px solid rgba(240,237,232,0.05)',padding:28,textAlign:'center',fontFamily:MONO,fontSize:11,color:'rgba(240,237,232,0.28)',letterSpacing:2}}>LOADING...</div>
        )}
        {!isLoading&&filtered.length===0&&(
            <div style={{border:'1px solid rgba(240,237,232,0.05)',padding:32,textAlign:'center'}}>
              <div style={{fontFamily:MONO,fontSize:12,color:'rgba(240,237,232,0.42)',letterSpacing:1,marginBottom:6}}>
                {filter==='ALL'?'NO APPLICATIONS YET':'NO '+gs(filter).label.toUpperCase()+' APPLICATIONS'}
              </div>
              <div style={{fontFamily:'monospace',fontSize:12,color:'rgba(240,237,232,0.32)'}}>
                {filter==='ALL'?'Tap "+ Add Application" to start tracking.':'Try a different filter above.'}
              </div>
            </div>
        )}
        {!isLoading&&filtered.length>0&&(
            <div style={{border:'1px solid rgba(240,237,232,0.07)',borderBottom:'none'}}>
              {filtered.map(function(app){
                return<AppRow key={app.id} app={app}
                              onStatusChange={function(id,status){upd.mutate({id,status})}}
                              onDelete={function(id){del.mutate(id)}}/>
              })}
            </div>
        )}

        {showAdd&&<AddModal onClose={function(){setShowAdd(false)}} onSave={onSaved}/>}
      </PageLayout>
  )
}