import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/ui/PageLayout'
import { useProfile } from '../../hooks/useProfile'
import useAuthStore from '../../store/authStore'
import { useQueryClient } from '@tanstack/react-query'

const MONO = 'Share Tech Mono, monospace'

var STATUS_MAP = {
  job_hunting:     { label:'JOB HUNTING',     n:'01' },
  employed:        { label:'EMPLOYED',         n:'02' },
  freelancing:     { label:'FREELANCING',      n:'03' },
  board_exam:      { label:'BOARD EXAM PREP', n:'04' },
  further_studies: { label:'FURTHER STUDIES', n:'05' },
}

function Row(props) {
  return (
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, padding:'11px 0', borderBottom:'1px solid rgba(240,237,232,0.05)' }}>
        <span style={{ fontFamily:MONO, fontSize:9, color:'rgba(240,237,232,0.28)', letterSpacing:2, flexShrink:0, paddingTop:1 }}>{props.label}</span>
        <span style={{ fontFamily:'monospace', fontSize:11, color: props.value ? '#F0EDE8' : 'rgba(240,237,232,0.18)', letterSpacing:.3, textAlign:'right', lineHeight:1.5 }}>
        {props.value || '—'}
      </span>
      </div>
  )
}

function SectionTag(props) {
  return (
      <div style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:14, marginTop: props.mt || 0 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px 4px 8px', border:'1px solid rgba(240,237,232,0.1)' }}>
          <span style={{ fontSize:9, color:'#BE473D' }}>{props.n}</span>
          <span style={{ fontSize:9, letterSpacing:2, color:'rgba(240,237,232,0.4)' }}>{props.label}</span>
        </div>
        <div style={{ display:'flex', gap:3 }}>
          <div style={{ width:2, height:13, background:'rgba(240,237,232,0.15)' }} />
          <div style={{ width:2, height:13, background:'rgba(240,237,232,0.15)' }} />
        </div>
      </div>
  )
}

export default function ProfilePage() {
  const { logout } = useAuthStore()
  const { data: profile, isLoading } = useProfile()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  var initials = profile?.fullName?.split(' ').map(function(n) { return n[0] }).slice(0,2).join('').toUpperCase() ?? '?'
  var status = STATUS_MAP[profile?.status]

  function handleLogout() {
    queryClient.clear()
    logout()
    navigate('/')
  }

  return (
      <PageLayout title="PROFILE" subtitle="// YOUR DETAILS">

        {isLoading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[1,2,3,4,5].map(function(i) {
                return <div key={i} style={{ height:44, border:'1px solid rgba(240,237,232,0.05)', background:'rgba(240,237,232,0.02)' }} />
              })}
            </div>
        ) : (
            <div>

              {/* ── AVATAR HERO — like landing dark info card ── */}
              <div style={{ padding:'24px 20px', border:'1px solid rgba(240,237,232,0.08)', background:'rgba(240,237,232,0.03)', marginBottom:24, position:'relative', overflow:'hidden', textAlign:'center' }}>
                {/* Corner brackets — like landing loader */}
                {[{top:8,left:8},{top:8,right:8},{bottom:8,left:8},{bottom:8,right:8}].map(function(pos, i) {
                  return (
                      <div key={i} style={{ position:'absolute', ...pos, width:14, height:14,
                        borderTop: pos.top !== undefined ? '1px solid rgba(190,71,61,0.35)' : 'none',
                        borderBottom: pos.bottom !== undefined ? '1px solid rgba(190,71,61,0.35)' : 'none',
                        borderLeft: pos.left !== undefined ? '1px solid rgba(190,71,61,0.35)' : 'none',
                        borderRight: pos.right !== undefined ? '1px solid rgba(190,71,61,0.35)' : 'none',
                      }} />
                  )
                })}
                {/* Grid bg */}
                <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(240,237,232,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(240,237,232,0.025) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />
                {/* Radial glow */}
                <div style={{ position:'absolute', top:'30%', right:'10%', width:120, height:120, borderRadius:'50%', background:'radial-gradient(circle,rgba(190,71,61,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />

                {/* Avatar */}
                <div style={{ width:56, height:56, background:'#BE473D', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:MONO, fontSize:20, color:'#F0EDE8', margin:'0 auto 14px', position:'relative', zIndex:1 }}>
                  {initials}
                </div>

                {/* Name */}
                <div style={{ fontFamily:MONO, fontSize:'clamp(14px,3.5vw,22px)', color:'#F0EDE8', letterSpacing:'0px', lineHeight:1.15, marginBottom:8, position:'relative', zIndex:1, wordBreak:'break-word', padding:'0 8px' }}>
                  {profile?.fullName?.toUpperCase()}
                </div>

                {/* Email */}
                <div style={{ fontFamily:'monospace', fontSize:11, color:'rgba(240,237,232,0.65)', letterSpacing:1, marginBottom:12, position:'relative', zIndex:1 }}>
                  {profile?.email}
                </div>

                {/* Status tag */}
                {status && (
                    <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px 5px 10px', border:'1px solid rgba(190,71,61,0.3)', background:'rgba(190,71,61,0.07)', position:'relative', zIndex:1 }}>
                      <span style={{ fontSize:9, color:'#BE473D' }}>{status.n}</span>
                      <span style={{ fontFamily:MONO, fontSize:9, color:'rgba(240,237,232,0.75)', letterSpacing:2 }}>{status.label}</span>
                    </div>
                )}
              </div>

              {/* ── EDUCATION ── */}
              <SectionTag n="01" label="EDUCATION" />
              <div style={{ border:'1px solid rgba(240,237,232,0.07)', padding:'0 14px', marginBottom:20 }}>
                <Row label="COURSE"    value={profile?.course?.toUpperCase()} />
                <Row label="SCHOOL"    value={profile?.school?.toUpperCase()} />
                <Row label="GRAD YEAR" value={profile?.graduationYear?.toString()} />
              </div>

              {/* ── LOCATION ── */}
              <SectionTag n="02" label="LOCATION" />
              <div style={{ border:'1px solid rgba(240,237,232,0.07)', padding:'0 14px', marginBottom:20 }}>
                <Row label="REGION" value={profile?.region?.toUpperCase()} />
              </div>

              {/* ── ACCOUNT ── */}
              <SectionTag n="03" label="ACCOUNT" />
              <div style={{ border:'1px solid rgba(240,237,232,0.07)', padding:'0 14px', marginBottom:28 }}>
                <Row label="EMAIL" value={profile?.email} />
                <Row label="MEMBER SINCE" value={
                  profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString('en-PH', { year:'numeric', month:'long', day:'numeric' }).toUpperCase()
                      : null
                } />
              </div>

              {/* ── ACTIONS — like landing CTA buttons ── */}
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <button onClick={function() { navigate('/dashboard/profile/edit') }}
                        style={{ width:'100%', padding:'14px', background:'rgba(240,237,232,0.04)', border:'1px solid rgba(240,237,232,0.1)', fontFamily:MONO, fontSize:11, color:'#F0EDE8', letterSpacing:3, cursor:'pointer', transition:'all .2s' }}
                        onMouseEnter={function(e) { e.currentTarget.style.background='rgba(190,71,61,0.1)'; e.currentTarget.style.borderColor='rgba(190,71,61,0.4)' }}
                        onMouseLeave={function(e) { e.currentTarget.style.background='rgba(240,237,232,0.04)'; e.currentTarget.style.borderColor='rgba(240,237,232,0.1)' }}>
                  EDIT PROFILE
                </button>
                <button onClick={handleLogout}
                        style={{ width:'100%', padding:'14px', background:'transparent', border:'1px solid rgba(190,71,61,0.2)', fontFamily:MONO, fontSize:11, color:'#BE473D', letterSpacing:3, cursor:'pointer', transition:'all .2s' }}
                        onMouseEnter={function(e) { e.currentTarget.style.background='rgba(190,71,61,0.08)'; e.currentTarget.style.borderColor='rgba(190,71,61,0.5)' }}
                        onMouseLeave={function(e) { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(190,71,61,0.2)' }}>
                  SIGN OUT
                </button>
              </div>

            </div>
        )}
      </PageLayout>
  )
}