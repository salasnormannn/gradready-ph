import { useState } from 'react'
import PageLayout from '../../components/ui/PageLayout'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'

const MONO = 'Share Tech Mono, monospace'
const CSS = `
  input::placeholder{color:rgba(240,237,232,0.2);}
  input:focus,select:focus{outline:none;border-color:rgba(190,71,61,0.5)!important;}
  select{font-family:'Share Tech Mono',monospace!important;}
  .sched-row{transition:all .18s;border-left:2px solid transparent;}
  .sched-row:hover{background:rgba(240,237,232,0.04)!important;border-left-color:#BE473D!important;}
  .sched-row:hover .sched-name{color:#F0EDE8!important;}
  .tip-row{transition:all .18s;}
  .tip-row:hover{background:rgba(240,237,232,0.04)!important;}
`

function useBoardExams(){
  return useQuery({queryKey:['board-exams'],queryFn:async function(){var r=await api.get('/api/board-exams');return r.data}})
}

function useStudyPlan(){
  return useMutation({mutationFn:async function(data){var r=await api.post('/api/board-exams/study-plan',data);return r.data}})
}

var TIPS=[
  {n:'01',title:'START 6 MONTHS BEFORE',sub:'Most reviewers recommend 6 months minimum for PRC board exams'},
  {n:'02',title:'GET OFFICIAL REVIEWERS',sub:'Buy PRC-accredited review materials — not random online summaries'},
  {n:'03',title:'DO PAST EXAM QUESTIONS',sub:'PRC releases past board exam questions — practice these religiously'},
  {n:'04',title:'JOIN A REVIEW CENTER',sub:'Structured review centers give you accountability and peer pressure'},
  {n:'05',title:'REGISTER EARLY',sub:'PRC opens registration months before the exam — don\'t miss the deadline'},
  {n:'06',title:'PREPARE VALID IDs',sub:'You need government-issued IDs on exam day — expired IDs are rejected'},
]

function daysUntil(dateStr){
  if(!dateStr)return null
  var target=new Date(dateStr)
  var now=new Date()
  var diff=Math.ceil((target-now)/(1000*60*60*24))
  return diff
}

function urgencyColor(days){
  if(days===null)return 'rgba(240,237,232,0.25)'
  if(days<0)return 'rgba(240,237,232,0.18)'
  if(days<30)return '#BE473D'
  if(days<90)return '#FBBF24'
  return '#34D399'
}

export default function BoardExamPage(){
  var {user}=useAuthStore()
  var navigate=useNavigate()
  var {data:exams=[],isLoading}=useBoardExams()
  var studyPlan=useStudyPlan()

  var [examDate,setExamDate]=useState('')
  var [profession,setProfession]=useState(user?.course||'')
  var [planResult,setPlanResult]=useState(null)
  var [generating,setGenerating]=useState(false)

  async function handleGenerate(e){
    e.preventDefault()
    if(!examDate||!profession)return
    setGenerating(true)
    try{
      var result=await studyPlan.mutateAsync({examDate,profession})
      setPlanResult(result)
    }catch(err){
      navigate('/dashboard/chat',{state:{initialMessage:'Create a board exam study plan for '+profession+' with exam date on '+examDate+'. Give me a week-by-week schedule.'}})
    }finally{setGenerating(false)}
  }

  return(
    <PageLayout title="BOARD EXAMS" subtitle="// PRC SCHEDULES + AI STUDY PLANS">
      <style>{CSS}</style>

      {/* Intro */}
      <div style={{padding:'16px',border:'1px solid rgba(240,237,232,0.08)',background:'rgba(240,237,232,0.02)',marginBottom:20,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:'radial-gradient(circle,rgba(190,71,61,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.3)',letterSpacing:2,marginBottom:4}}>// PRC BOARD EXAM TRACKER</div>
        <div style={{fontFamily:'monospace',fontSize:10,color:'rgba(240,237,232,0.4)',lineHeight:1.7}}>
          Check upcoming PRC schedules and generate an AI study plan tailored to your exam date.
        </div>
      </div>

      {/* AI Study Plan Generator */}
      <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 12px 4px 8px',border:'1px solid rgba(240,237,232,0.1)',marginBottom:14}}>
        <span style={{fontSize:9,color:'#BE473D'}}>01</span>
        <span style={{fontSize:9,letterSpacing:2,color:'rgba(240,237,232,0.38)'}}>AI STUDY PLAN GENERATOR</span>
      </div>

      <form onSubmit={handleGenerate}>
        <div style={{marginBottom:12}}>
          <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.3)',letterSpacing:2,marginBottom:6}}>// YOUR PROFESSION / COURSE</div>
          <input type="text" value={profession} onChange={function(e){setProfession(e.target.value)}} placeholder="e.g. Nursing, Civil Engineering, CPA"
            style={{width:'100%',padding:'12px 14px',background:'rgba(240,237,232,0.05)',border:'1px solid rgba(240,237,232,0.1)',color:'#F0EDE8',fontFamily:MONO,fontSize:12,letterSpacing:.5,transition:'border-color .18s'}}
            onFocus={function(e){e.target.style.borderColor='rgba(190,71,61,0.5)'}}
            onBlur={function(e){e.target.style.borderColor='rgba(240,237,232,0.1)'}}/>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.3)',letterSpacing:2,marginBottom:6}}>// EXAM DATE</div>
          <input type="date" value={examDate} onChange={function(e){setExamDate(e.target.value)}}
            style={{width:'100%',padding:'12px 14px',background:'rgba(240,237,232,0.05)',border:'1px solid rgba(240,237,232,0.1)',color:'#F0EDE8',fontFamily:MONO,fontSize:12,letterSpacing:.5,transition:'border-color .18s',colorScheme:'dark'}}
            onFocus={function(e){e.target.style.borderColor='rgba(190,71,61,0.5)'}}
            onBlur={function(e){e.target.style.borderColor='rgba(240,237,232,0.1)'}}/>
        </div>
        <button type="submit" disabled={generating||!examDate||!profession}
          style={{width:'100%',padding:'13px',background:generating||!examDate||!profession?'rgba(190,71,61,0.3)':'#BE473D',border:'none',cursor:generating||!examDate||!profession?'not-allowed':'pointer',fontFamily:MONO,fontSize:10,color:'#F0EDE8',letterSpacing:3,marginBottom:20,transition:'opacity .18s'}}
          onMouseEnter={function(e){if(!generating&&examDate&&profession)e.currentTarget.style.opacity='.85'}}
          onMouseLeave={function(e){e.currentTarget.style.opacity='1'}}>
          {generating?'GENERATING PLAN...':'GENERATE AI STUDY PLAN'}
        </button>
      </form>

      {/* Plan result */}
      {planResult&&(
        <div style={{padding:'16px',border:'1px solid rgba(190,71,61,0.25)',background:'rgba(190,71,61,0.05)',marginBottom:20}}>
          <div style={{fontFamily:MONO,fontSize:9,color:'#BE473D',letterSpacing:2,marginBottom:10}}>// YOUR STUDY PLAN</div>
          <div style={{fontFamily:'monospace',fontSize:11,color:'rgba(240,237,232,0.55)',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{typeof planResult==='string'?planResult:planResult.plan||JSON.stringify(planResult)}</div>
        </div>
      )}

      {/* Upcoming schedules */}
      <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 12px 4px 8px',border:'1px solid rgba(240,237,232,0.1)',marginBottom:14}}>
        <span style={{fontSize:9,color:'#BE473D'}}>02</span>
        <span style={{fontSize:9,letterSpacing:2,color:'rgba(240,237,232,0.38)'}}>UPCOMING PRC SCHEDULES</span>
      </div>

      {isLoading&&<div style={{border:'1px solid rgba(240,237,232,0.06)',padding:24,textAlign:'center',fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.2)',letterSpacing:2,marginBottom:20}}>LOADING SCHEDULES...</div>}

      {!isLoading&&exams.length===0&&(
        <div style={{border:'1px solid rgba(240,237,232,0.06)',padding:24,marginBottom:20}}>
          <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.25)',letterSpacing:1,marginBottom:6}}>NO SCHEDULES LOADED</div>
          <div style={{fontFamily:'monospace',fontSize:10,color:'rgba(240,237,232,0.18)',lineHeight:1.6}}>Check the official PRC website for the latest board exam schedules.</div>
          <button onClick={function(){window.open('https://www.prc.gov.ph','_blank','noopener,noreferrer')}}
            style={{marginTop:12,padding:'9px 16px',background:'transparent',border:'1px solid rgba(240,237,232,0.1)',cursor:'pointer',fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.4)',letterSpacing:1,transition:'all .18s'}}
            onMouseEnter={function(e){e.currentTarget.style.color='#F0EDE8';e.currentTarget.style.borderColor='rgba(240,237,232,0.3)'}}
            onMouseLeave={function(e){e.currentTarget.style.color='rgba(240,237,232,0.4)';e.currentTarget.style.borderColor='rgba(240,237,232,0.1)'}}>
            VISIT PRC.GOV.PH
          </button>
        </div>
      )}

      {!isLoading&&exams.length>0&&(
        <div style={{border:'1px solid rgba(240,237,232,0.07)',borderBottom:'none',marginBottom:20}}>
          {exams.map(function(exam,i){
            var days=daysUntil(exam.examDate||exam.date)
            var color=urgencyColor(days)
            return(
              <div key={exam.id||i} className="sched-row"
                style={{display:'flex',alignItems:'center',gap:14,padding:'14px 12px 14px 14px',borderBottom:'1px solid rgba(240,237,232,0.06)',background:'transparent'}}>
                <div style={{width:32,height:32,background:'rgba(190,71,61,0.1)',border:'1px solid rgba(190,71,61,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:MONO,fontSize:10,color:'#BE473D',flexShrink:0,letterSpacing:0}}>
                  PRC
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="sched-name" style={{fontFamily:MONO,fontSize:11,color:'rgba(240,237,232,0.65)',letterSpacing:.3,marginBottom:2,transition:'color .18s'}}>{exam.profession||exam.examName}</div>
                  <div style={{fontFamily:'monospace',fontSize:9,color:'rgba(240,237,232,0.28)'}}>{exam.examDate||exam.date}{exam.venue?' · '+exam.venue:''}</div>
                </div>
                {days!==null&&(
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontFamily:MONO,fontSize:14,color:color,letterSpacing:'-0.5px',lineHeight:1}}>{days<0?'DONE':days}</div>
                    <div style={{fontFamily:MONO,fontSize:8,color:'rgba(240,237,232,0.2)',marginTop:2}}>{days<0?'PASSED':'DAYS LEFT'}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Tips */}
      <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 12px 4px 8px',border:'1px solid rgba(240,237,232,0.1)',marginBottom:14}}>
        <span style={{fontSize:9,color:'#BE473D'}}>03</span>
        <span style={{fontSize:9,letterSpacing:2,color:'rgba(240,237,232,0.38)'}}>EXAM TIPS</span>
      </div>

      <div style={{border:'1px solid rgba(240,237,232,0.07)',borderBottom:'none'}}>
        {TIPS.map(function(t){
          return(
            <div key={t.n} className="tip-row" style={{display:'flex',alignItems:'center',gap:14,padding:'13px 12px 13px 14px',borderBottom:'1px solid rgba(240,237,232,0.06)',background:'transparent'}}>
              <span style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.18)',letterSpacing:1,flexShrink:0,width:22}}>{t.n}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:MONO,fontSize:11,color:'rgba(240,237,232,0.6)',letterSpacing:.3,marginBottom:2}}>{t.title}</div>
                <div style={{fontFamily:'monospace',fontSize:9.5,color:'rgba(240,237,232,0.22)',lineHeight:1.5}}>{t.sub}</div>
              </div>
            </div>
          )
        })}
      </div>

    </PageLayout>
  )
}