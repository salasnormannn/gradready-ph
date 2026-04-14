import {useEffect, useState} from 'react'
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
  .sched-row:hover{background:rgba(240,237,232,0.06)!important;border-left-color:#BE473D!important;}
  .sched-row:hover .sched-name{color:#F0EDE8!important;}
  .tip-row{transition:all .18s;}
  .tip-row:hover{background:rgba(240,237,232,0.06)!important;}
`

// Official PRC 2026 Schedule — Resolution No. 2113 s. 2025
var PRC_2026=[
  {id:2,  profession:'Architects',                       examDate:'Jan 20 & 22, 2026',          examSort:'2026-01-20',appOpen:'Nov 11, 2025',appDeadline:'Dec 15, 2025',results:'Jan 27, 2026', courses:['architecture']},
  {id:3,  profession:'Sanitary Engineers',               examDate:'Jan 26–28, 2026',             examSort:'2026-01-26',appOpen:'Nov 11, 2025',appDeadline:'Dec 29, 2025',results:'Jan 30, 2026', courses:['sanitary engineering']},
  {id:4,  profession:'Criminologists',                   examDate:'Feb 4–6, 2026',               examSort:'2026-02-04',appOpen:'Nov 11, 2025',appDeadline:'Dec 29, 2025',results:'Mar 13, 2026', courses:['criminology']},
  {id:5,  profession:'Respiratory Therapists',           examDate:'Feb 9–10, 2026',              examSort:'2026-02-09',appOpen:'Nov 11, 2025',appDeadline:'Jan 12, 2026',results:'Feb 13, 2026', courses:['respiratory therapy']},
  {id:6,  profession:'Mechanical Engineers',             examDate:'Feb 11–13, 2026',             examSort:'2026-02-11',appOpen:'Nov 13, 2025',appDeadline:'Jan 12, 2026',results:'Feb 19, 2026', courses:['mechanical engineering']},
  {id:8,  profession:'Master Plumbers',                  examDate:'Feb 19–20, 2026',             examSort:'2026-02-19',appOpen:'Nov 21, 2025',appDeadline:'Jan 20, 2026',results:'Feb 25, 2026', courses:['master plumber','plumbing']},
  {id:9,  profession:'Nurses (PNLE)',                    examDate:'Feb 26–27, 2026',             examSort:'2026-02-26',appOpen:'Nov 28, 2025',appDeadline:'Jan 27, 2026',results:'Mar 19, 2026', courses:['nursing','nurse']},
  {id:10, profession:'Medical Technologists (MTLE)',     examDate:'Mar 5–6, 2026',               examSort:'2026-03-05',appOpen:'Dec 5, 2025', appDeadline:'Feb 3, 2026', results:'Mar 11, 2026', courses:['medical technology','medtech']},
  {id:11, profession:'Professional Teachers (LET)',      examDate:'Mar 15, 2026',                examSort:'2026-03-15',appOpen:'Dec 3, 2025', appDeadline:'Feb 3, 2026', results:'May 15, 2026', courses:['education','teacher']},
  {id:12, profession:'Electronics Engineers (ECE)',      examDate:'Mar 17–18, 2026',             examSort:'2026-03-17',appOpen:'Dec 17, 2025',appDeadline:'Feb 16, 2026',results:'Mar 24, 2026', courses:['electronics engineering','ece']},
  {id:14, profession:'Physicians (PLE)',                 examDate:'Mar 23–24 & 30–31, 2026',    examSort:'2026-03-23',appOpen:'Dec 23, 2025',appDeadline:'Feb 23, 2026',results:'Apr 8, 2026',  courses:['medicine','physician','medical']},
  {id:15, profession:'Civil Engineers (CELE)',           examDate:'Mar 26–27, 2026',             examSort:'2026-03-26',appOpen:'Dec 26, 2025',appDeadline:'Feb 24, 2026',results:'Apr 7, 2026',  courses:['civil engineering']},
  {id:18, profession:'Pharmacists',                      examDate:'Apr 18–19, 2026',             examSort:'2026-04-18',appOpen:'Jan 16, 2026',appDeadline:'Mar 20, 2026',results:'Apr 22, 2026', courses:['pharmacy']},
  {id:19, profession:'Registered Electrical Engineers',  examDate:'Apr 21–22, 2026',             examSort:'2026-04-21',appOpen:'Jan 21, 2026',appDeadline:'Mar 23, 2026',results:'Apr 28, 2026', courses:['electrical engineering','ree']},
  {id:21, profession:'Dentists',                         examDate:'May 4–6 & 11–18, 2026',      examSort:'2026-05-04',appOpen:'Feb 3, 2026', appDeadline:'Apr 6, 2026', results:'May 20, 2026', courses:['dentistry','dental']},
  {id:26, profession:'Chemical Engineers',               examDate:'May 20–22, 2026',             examSort:'2026-05-20',appOpen:'Feb 19, 2026',appDeadline:'Apr 20, 2026',results:'May 26, 2026', courses:['chemical engineering']},
  {id:27, profession:'Certified Public Accountants (CPALE)',examDate:'May 24–26, 2026',          examSort:'2026-05-24',appOpen:'Feb 6, 2026', appDeadline:'Apr 10, 2026',results:'Jun 2, 2026',  courses:['accountancy','cpa','accounting']},
  {id:29, profession:'Physical Therapists',              examDate:'Jun 2–3, 2026',               examSort:'2026-06-02',appOpen:'Mar 4, 2026', appDeadline:'May 4, 2026', results:'Jun 5, 2026',  courses:['physical therapy']},
  {id:30, profession:'Occupational Therapists',          examDate:'Jun 4, 2026',                 examSort:'2026-06-04',appOpen:'Mar 6, 2026', appDeadline:'May 5, 2026', results:'Jun 8, 2026',  courses:['occupational therapy']},
  {id:31, profession:'Architects (2nd Sched)',           examDate:'Jun 8 & 10, 2026',            examSort:'2026-06-08',appOpen:'Mar 10, 2026',appDeadline:'May 11, 2026',results:'Jun 16, 2026', courses:['architecture']},
  {id:32, profession:'Interior Designers',               examDate:'Jul 1–3, 2026',               examSort:'2026-07-01',appOpen:'Mar 31, 2026',appDeadline:'Jun 1, 2026', results:'Jul 22, 2026', courses:['interior design']},
  {id:34, profession:'Landscape Architects',             examDate:'Jul 8–10, 2026',              examSort:'2026-07-08',appOpen:'Apr 8, 2026', appDeadline:'Jun 8, 2026', results:'Jul 14, 2026', courses:['landscape architecture']},
  {id:36, profession:'Criminologists (2nd Sched)',       examDate:'Aug 1–3, 2026',               examSort:'2026-08-01',appOpen:'Apr 17, 2026',appDeadline:'Jun 17, 2026',results:'Sep 4, 2026',  courses:['criminology']},
  {id:37, profession:'Mechanical Engineers (2nd Sched)', examDate:'Aug 7–9, 2026',               examSort:'2026-08-07',appOpen:'May 8, 2026', appDeadline:'Jul 8, 2026', results:'Aug 12, 2026', courses:['mechanical engineering']},
  {id:40, profession:'Medical Technologists (2nd Sched)',examDate:'Aug 15–16, 2026',             examSort:'2026-08-15',appOpen:'May 15, 2026',appDeadline:'Jul 17, 2026',results:'Aug 19, 2026', courses:['medical technology','medtech']},
  {id:41, profession:'Guidance Counselors',              examDate:'Aug 17–18, 2026',             examSort:'2026-08-17',appOpen:'May 19, 2026',appDeadline:'Jul 20, 2026',results:'Aug 24, 2026', courses:['guidance counseling','psychology']},
  {id:42, profession:'Psychologists',                    examDate:'Aug 19–20, 2026',             examSort:'2026-08-19',appOpen:'May 21, 2026',appDeadline:'Jul 20, 2026',results:'Aug 27, 2026', courses:['psychology']},
  {id:45, profession:'Nurses (PNLE) — 2nd Sched',       examDate:'Aug 29–30, 2026',             examSort:'2026-08-29',appOpen:'May 15, 2026',appDeadline:'Jul 15, 2026',results:'Sep 18, 2026', courses:['nursing','nurse']},
  {id:47, profession:'Librarians',                       examDate:'Sep 3–4, 2026',               examSort:'2026-09-03',appOpen:'Jun 5, 2026', appDeadline:'Aug 4, 2026', results:'Sep 8, 2026',  courses:['library science','librarian']},
  {id:48, profession:'Registered Electrical Engineers (2nd)',examDate:'Sep 5–6, 2026',           examSort:'2026-09-05',appOpen:'Jun 5, 2026', appDeadline:'Aug 6, 2026', results:'Sep 10, 2026', courses:['electrical engineering','ree']},
  {id:51, profession:'Social Workers',                   examDate:'Sep 9–11, 2026',              examSort:'2026-09-09',appOpen:'Jun 11, 2026',appDeadline:'Aug 12, 2026',results:'Sep 16, 2026', courses:['social work']},
  {id:52, profession:'Professional Teachers (LET) — 2nd',examDate:'Sep 20, 2026',               examSort:'2026-09-20',appOpen:'May 22, 2026',appDeadline:'Jul 23, 2026',results:'Nov 27, 2026', courses:['education','teacher']},
  {id:53, profession:'Geodetic Engineers',               examDate:'Sep 23–24, 2026',             examSort:'2026-09-23',appOpen:'Jun 25, 2026',appDeadline:'Aug 27, 2026',results:'Sep 28, 2026', courses:['geodetic engineering']},
  {id:54, profession:'Civil Engineers (2nd Sched)',      examDate:'Sep 26–27, 2026',             examSort:'2026-09-26',appOpen:'Jun 11, 2026',appDeadline:'Aug 12, 2026',results:'Oct 2, 2026',  courses:['civil engineering']},
  {id:58, profession:'Physicians (PLE) — 2nd Sched',    examDate:'Oct 3–4 & 10–11, 2026',      examSort:'2026-10-03',appOpen:'Jul 3, 2026', appDeadline:'Sep 3, 2026', results:'Oct 16, 2026', courses:['medicine','physician','medical']},
  {id:62, profession:'Professional Foresters',           examDate:'Oct 8–9, 2026',               examSort:'2026-10-08',appOpen:'Jul 10, 2026',appDeadline:'Sep 8, 2026', results:'Oct 13, 2026', courses:['forestry','forester']},
  {id:65, profession:'Pharmacists (2nd Sched)',          examDate:'Oct 15–16, 2026',             examSort:'2026-10-15',appOpen:'Jul 31, 2026',appDeadline:'Sep 29, 2026',results:'Oct 21, 2026', courses:['pharmacy']},
  {id:66, profession:'Electronics Engineers (2nd Sched)',examDate:'Oct 17–18, 2026',             examSort:'2026-10-17',appOpen:'Jul 17, 2026',appDeadline:'Sep 17, 2026',results:'Oct 23, 2026', courses:['electronics engineering','ece']},
  {id:70, profession:'CPAs (CPALE) — 2nd Sched',        examDate:'Oct 24–26, 2026',             examSort:'2026-10-24',appOpen:'Jul 10, 2026',appDeadline:'Sep 9, 2026', results:'Nov 3, 2026',  courses:['accountancy','cpa','accounting']},
  {id:71, profession:'Veterinarians',                    examDate:'Nov 4–6, 2026',               examSort:'2026-11-04',appOpen:'Aug 6, 2026', appDeadline:'Oct 5, 2026', results:'Nov 10, 2026', courses:['veterinary','veterinarian']},
  {id:74, profession:'Nutritionist-Dietitians',          examDate:'Nov 12–13, 2026',             examSort:'2026-11-12',appOpen:'Aug 14, 2026',appDeadline:'Oct 13, 2026',results:'Nov 17, 2026', courses:['nutrition','dietetics','nutritionist']},
  {id:75, profession:'Chemical Engineers (2nd Sched)',   examDate:'Nov 14–16, 2026',             examSort:'2026-11-14',appOpen:'Aug 14, 2026',appDeadline:'Oct 15, 2026',results:'Nov 18, 2026', courses:['chemical engineering']},
  {id:78, profession:'Dentists (2nd Sched)',             examDate:'Nov 22–24 & Dec 5, 2026',    examSort:'2026-11-22',appOpen:'Aug 24, 2026',appDeadline:'Oct 23, 2026',results:'Dec 14, 2026', courses:['dentistry','dental']},
  {id:82, profession:'Agriculturists (LEA)',             examDate:'Dec 1–3, 2026',               examSort:'2026-12-01',appOpen:'Sep 2, 2026', appDeadline:'Nov 3, 2026', results:'Dec 10, 2026', courses:['agriculture','agriculturist']},
  {id:84, profession:'Physical Therapists (2nd Sched)', examDate:'Dec 5–6, 2026',               examSort:'2026-12-05',appOpen:'Sep 4, 2026', appDeadline:'Nov 4, 2026', results:'Dec 9, 2026',  courses:['physical therapy']},
  {id:87, profession:'Radiologic Technologists',         examDate:'Dec 10–11, 2026',             examSort:'2026-12-10',appOpen:'Sep 11, 2026',appDeadline:'Nov 10, 2026',results:'Dec 16, 2026', courses:['radiologic technology','radiology','x-ray']},
]

function useBoardExams(){
  return useQuery({
    queryKey:['board-exams'],
    queryFn:async function(){
      try{var r=await api.get('/api/board-exams');if(r.data&&r.data.length>0)return r.data}catch(e){}
      return PRC_2026
    }
  })
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

  useEffect(function(){ window.scrollTo(0, 0) }, [])

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
        <div style={{padding:'16px',border:'1px solid rgba(240,237,232,0.07)',background:'rgba(240,237,232,0.02)',marginBottom:20,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:'radial-gradient(circle,rgba(190,71,61,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{fontFamily:MONO,fontSize:10,color:'rgba(240,237,232,0.42)',letterSpacing:2,marginBottom:4}}>// PRC BOARD EXAM TRACKER</div>
          <div style={{fontFamily:'monospace',fontSize:12,color:'rgba(240,237,232,0.52)',lineHeight:1.7}}>
            Check upcoming PRC schedules and generate an AI study plan tailored to your exam date.
          </div>
        </div>

        {isLoading&&<div style={{padding:24,textAlign:'center',fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.2)',letterSpacing:2,marginBottom:20}}>LOADING...</div>}

        {!isLoading&&(function(){
          var userCourse=(user?.course||'').toLowerCase()
          var matched=exams.filter(function(exam){
            if(!exam.courses)return false
            return exam.courses.some(function(c){ return userCourse.includes(c) })
          })

          // ── NON-BOARD TAKER ──────────────────────────────────────────
          if(matched.length===0){
            return(
                <div style={{marginBottom:20}}>
                  <div style={{padding:'20px 16px',border:'1px solid rgba(240,237,232,0.08)',background:'rgba(240,237,232,0.02)',position:'relative',overflow:'hidden'}}>
                    {[{top:8,left:8},{top:8,right:8},{bottom:8,left:8},{bottom:8,right:8}].map(function(pos,i){
                      return(
                          <div key={i} style={{position:'absolute',...pos,width:10,height:10,
                            borderTop:pos.top!==undefined?'1px solid rgba(190,71,61,0.25)':'none',
                            borderBottom:pos.bottom!==undefined?'1px solid rgba(190,71,61,0.25)':'none',
                            borderLeft:pos.left!==undefined?'1px solid rgba(190,71,61,0.25)':'none',
                            borderRight:pos.right!==undefined?'1px solid rgba(190,71,61,0.25)':'none',
                          }}/>
                      )
                    })}
                    <div style={{fontFamily:MONO,fontSize:11,color:'rgba(240,237,232,0.28)',letterSpacing:2,marginBottom:10}}>// STATUS CHECK</div>
                    <div style={{fontFamily:MONO,fontSize:18,color:'#F0EDE8',letterSpacing:'-0.5px',marginBottom:6,lineHeight:1.2}}>NO BOARD EXAM</div>
                    <div style={{fontFamily:MONO,fontSize:18,color:'#BE473D',letterSpacing:'-0.5px',marginBottom:16,lineHeight:1.2}}>REQUIRED.</div>
                    <div style={{fontFamily:'monospace',fontSize:12,color:'rgba(240,237,232,0.42)',lineHeight:1.8,marginBottom:20}}>
                      Your course — <span style={{color:'rgba(240,237,232,0.7)'}}>{user?.course||'your course'}</span> — does not require a PRC licensure exam. Focus on job hunting, government registrations, and building your career.
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                      <button
                          onClick={function(){navigate('/dashboard/chat',{state:{initialMessage:'What certifications or professional credentials should a '+(user?.course||'fresh graduate')+' pursue to boost their career? List specific ones with brief descriptions.'}})}}
                          style={{width:'100%',padding:'13px',background:'#BE473D',border:'none',cursor:'pointer',fontFamily:MONO,fontSize:10,color:'#F0EDE8',letterSpacing:3,transition:'opacity .18s'}}
                          onMouseEnter={function(e){e.currentTarget.style.opacity='.85'}}
                          onMouseLeave={function(e){e.currentTarget.style.opacity='1'}}>
                        ASK KUYA AI FOR CERTIFICATIONS
                      </button>
                      <button
                          onClick={function(){navigate('/dashboard')}}
                          style={{width:'100%',padding:'13px',background:'transparent',border:'1px solid rgba(240,237,232,0.12)',cursor:'pointer',fontFamily:MONO,fontSize:10,color:'rgba(240,237,232,0.5)',letterSpacing:3,transition:'all .18s'}}
                          onMouseEnter={function(e){e.currentTarget.style.color='#F0EDE8';e.currentTarget.style.borderColor='rgba(240,237,232,0.3)'}}
                          onMouseLeave={function(e){e.currentTarget.style.color='rgba(240,237,232,0.5)';e.currentTarget.style.borderColor='rgba(240,237,232,0.12)'}}>
                        BACK TO DASHBOARD
                      </button>
                    </div>
                  </div>
                </div>
            )
          }

          // ── BOARD TAKER ──────────────────────────────────────────────
          var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December']
          var grouped={}
          matched.forEach(function(exam){
            var d=new Date(exam.examSort)
            var m=MONTHS[d.getMonth()]
            if(!grouped[m])grouped[m]=[]
            grouped[m].push(exam)
          })

          return(
              <>
                {/* AI Study Plan Generator */}
                <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 12px 4px 8px',border:'1px solid rgba(240,237,232,0.07)',marginBottom:14}}>
                  <span style={{fontSize:11,color:'#BE473D'}}>01</span>
                  <span style={{fontSize:11,letterSpacing:2,color:'rgba(240,237,232,0.5)'}}>AI STUDY PLAN GENERATOR</span>
                </div>

                <form onSubmit={handleGenerate}>
                  <div style={{marginBottom:12}}>
                    <div style={{fontFamily:MONO,fontSize:10,color:'rgba(240,237,232,0.42)',letterSpacing:2,marginBottom:6}}>// YOUR PROFESSION / COURSE</div>
                    <input type="text" value={profession} onChange={function(e){setProfession(e.target.value)}} placeholder="e.g. Nursing, Civil Engineering, CPA"
                           style={{width:'100%',padding:'12px 14px',background:'rgba(240,237,232,0.05)',border:'1px solid rgba(240,237,232,0.07)',color:'#F0EDE8',fontFamily:MONO,fontSize:14,letterSpacing:.5,transition:'border-color .18s'}}
                           onFocus={function(e){e.target.style.borderColor='rgba(190,71,61,0.5)'}}
                           onBlur={function(e){e.target.style.borderColor='rgba(240,237,232,0.1)'}}/>
                  </div>
                  <div style={{marginBottom:16}}>
                    <div style={{fontFamily:MONO,fontSize:10,color:'rgba(240,237,232,0.42)',letterSpacing:2,marginBottom:6}}>// EXAM DATE</div>
                    <input type="date" value={examDate} onChange={function(e){setExamDate(e.target.value)}}
                           style={{width:'100%',padding:'12px 14px',background:'rgba(240,237,232,0.05)',border:'1px solid rgba(240,237,232,0.07)',color:'#F0EDE8',fontFamily:MONO,fontSize:12,letterSpacing:.5,transition:'border-color .18s',colorScheme:'dark'}}
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

                {planResult&&(
                    <div style={{padding:'16px',border:'1px solid rgba(190,71,61,0.25)',background:'rgba(190,71,61,0.05)',marginBottom:20}}>
                      <div style={{fontFamily:MONO,fontSize:9,color:'#BE473D',letterSpacing:2,marginBottom:10}}>// YOUR STUDY PLAN</div>
                      <div style={{fontFamily:'monospace',fontSize:13,color:'rgba(240,237,232,0.65)',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{typeof planResult==='string'?planResult:planResult.plan||JSON.stringify(planResult)}</div>
                    </div>
                )}

                {/* PRC 2026 Schedules */}
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                  <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 12px 4px 8px',border:'1px solid rgba(240,237,232,0.07)'}}>
                    <span style={{fontSize:11,color:'#BE473D'}}>02</span>
                    <span style={{fontSize:11,letterSpacing:2,color:'rgba(240,237,232,0.5)'}}>2026 PRC SCHEDULES</span>
                  </div>
                  <button onClick={function(){window.open('https://www.prc.gov.ph/2026-schedule-examination','_blank','noopener,noreferrer')}}
                          style={{padding:'4px 10px',background:'transparent',border:'1px solid rgba(240,237,232,0.07)',cursor:'pointer',fontFamily:MONO,fontSize:8,color:'rgba(240,237,232,0.35)',letterSpacing:1,transition:'all .18s'}}
                          onMouseEnter={function(e){e.currentTarget.style.color='#F0EDE8';e.currentTarget.style.borderColor='rgba(240,237,232,0.3)'}}
                          onMouseLeave={function(e){e.currentTarget.style.color='rgba(240,237,232,0.35)';e.currentTarget.style.borderColor='rgba(240,237,232,0.07)'}}>
                    OFFICIAL SITE
                  </button>
                </div>
                <div style={{fontFamily:'monospace',fontSize:9,color:'rgba(240,237,232,0.22)',marginBottom:16,letterSpacing:.3}}>
                  Source: PRC Resolution No. 2113 s. 2025 · Showing schedules for your course only
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:20,marginBottom:20}}>
                  {Object.keys(grouped).map(function(month){
                    return(
                        <div key={month}>
                          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                            <div style={{fontFamily:MONO,fontSize:9,color:'#BE473D',letterSpacing:3}}>{month.toUpperCase()}</div>
                            <div style={{flex:1,height:1,background:'rgba(190,71,61,0.2)'}}/>
                          </div>
                          <div style={{display:'flex',flexDirection:'column',gap:8}}>
                            {grouped[month].map(function(exam){
                              var days=daysUntil(exam.examSort)
                              var color=urgencyColor(days)
                              var passed=days!==null&&days<0
                              return(
                                  <div key={exam.id} style={{border:'1px solid rgba(240,237,232,0.08)',background:'rgba(240,237,232,0.02)',opacity:passed?0.4:1}}>
                                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',borderBottom:'1px solid rgba(240,237,232,0.06)'}}>
                                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                                        <div style={{width:26,height:26,background:'rgba(190,71,61,0.12)',border:'1px solid rgba(190,71,61,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:MONO,fontSize:7,color:'#BE473D',flexShrink:0}}>PRC</div>
                                        <div style={{fontFamily:MONO,fontSize:12,color:'rgba(240,237,232,0.9)',letterSpacing:.3}}>{exam.profession}</div>
                                      </div>
                                      <div style={{display:'flex',alignItems:'center',gap:5,flexShrink:0}}>
                                        <div style={{fontFamily:MONO,fontSize:passed?9:15,color:color,letterSpacing:'-0.5px',lineHeight:1}}>{passed?'PASSED':days}</div>
                                        {!passed&&<div style={{fontFamily:MONO,fontSize:8,color:'rgba(240,237,232,0.28)'}}>DAYS</div>}
                                      </div>
                                    </div>
                                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr'}}>
                                      <div style={{padding:'9px 12px',borderRight:'1px solid rgba(240,237,232,0.05)'}}>
                                        <div style={{fontFamily:MONO,fontSize:7,color:'rgba(240,237,232,0.25)',letterSpacing:1.5,marginBottom:4}}>EXAM DATE</div>
                                        <div style={{fontFamily:MONO,fontSize:9,color:passed?'rgba(240,237,232,0.3)':'#F0EDE8',lineHeight:1.4}}>{exam.examDate}</div>
                                      </div>
                                      <div style={{padding:'9px 12px',borderRight:'1px solid rgba(240,237,232,0.05)'}}>
                                        <div style={{fontFamily:MONO,fontSize:7,color:'rgba(240,237,232,0.25)',letterSpacing:1.5,marginBottom:4}}>APP OPENS</div>
                                        <div style={{fontFamily:MONO,fontSize:9,color:'rgba(240,237,232,0.5)',lineHeight:1.4}}>{exam.appOpen||'TBA'}</div>
                                      </div>
                                      <div style={{padding:'9px 12px'}}>
                                        <div style={{fontFamily:MONO,fontSize:7,color:'rgba(240,237,232,0.25)',letterSpacing:1.5,marginBottom:4}}>DEADLINE</div>
                                        <div style={{fontFamily:MONO,fontSize:9,color:passed?'rgba(240,237,232,0.3)':'#FBBF24',lineHeight:1.4}}>{exam.appDeadline||'TBA'}</div>
                                      </div>
                                    </div>
                                    {exam.results&&(
                                        <div style={{padding:'5px 12px 7px',borderTop:'1px solid rgba(240,237,232,0.04)',display:'flex',gap:6,alignItems:'center'}}>
                                          <div style={{fontFamily:MONO,fontSize:7,color:'rgba(240,237,232,0.2)',letterSpacing:1}}>TARGET RESULTS:</div>
                                          <div style={{fontFamily:MONO,fontSize:8,color:'rgba(240,237,232,0.38)'}}>{exam.results}</div>
                                        </div>
                                    )}
                                  </div>
                              )
                            })}
                          </div>
                        </div>
                    )
                  })}
                </div>

                {/* Tips */}
                <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 12px 4px 8px',border:'1px solid rgba(240,237,232,0.07)',marginBottom:14}}>
                  <span style={{fontSize:11,color:'#BE473D'}}>03</span>
                  <span style={{fontSize:11,letterSpacing:2,color:'rgba(240,237,232,0.5)'}}>EXAM TIPS</span>
                </div>
                <div style={{border:'1px solid rgba(240,237,232,0.07)',borderBottom:'none'}}>
                  {TIPS.map(function(t){
                    return(
                        <div key={t.n} className="tip-row" style={{display:'flex',alignItems:'center',gap:14,padding:'18px 14px 18px 16px',borderBottom:'1px solid rgba(240,237,232,0.05)',background:'transparent'}}>
                          <span style={{fontFamily:MONO,fontSize:11,color:'rgba(240,237,232,0.32)',letterSpacing:1,flexShrink:0,width:26}}>{t.n}</span>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontFamily:MONO,fontSize:15,color:'rgba(240,237,232,0.85)',letterSpacing:.3,marginBottom:4}}>{t.title}</div>
                            <div style={{fontFamily:'monospace',fontSize:12,color:'rgba(240,237,232,0.42)',lineHeight:1.5}}>{t.sub}</div>
                          </div>
                        </div>
                    )
                  })}
                </div>
              </>
          )
        })()}

      </PageLayout>
  )
}