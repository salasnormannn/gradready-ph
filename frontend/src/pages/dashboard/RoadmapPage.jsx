import { useState } from 'react'
import PageLayout from '../../components/ui/PageLayout'
import { useRoadmap, useRoadmapProgress, useToggleRoadmapItem } from '../../hooks/useRoadmap'

const CATEGORY_COLORS = {
  government: { bg: 'bg-green-50', text: 'text-green-800', label: 'Gov' },
  career: { bg: 'bg-blue-50', text: 'text-blue-800', label: 'Career' },
  finance: { bg: 'bg-amber-50', text: 'text-amber-800', label: 'Finance' },
  board_exam: { bg: 'bg-purple-50', text: 'text-purple-800', label: 'Board exam' },
}

export default function RoadmapPage() {
  const { data: items, isLoading } = useRoadmap()
  const { data: progress } = useRoadmapProgress()
  const { mutate: toggle, isPending } = useToggleRoadmapItem()
  const [expanded, setExpanded] = useState(null)

  const grouped = items?.reduce((acc, item) => {
    const week = `Week ${item.weekNumber}`
    if (!acc[week]) acc[week] = []
    acc[week].push(item)
    return acc
  }, {}) ?? {}

  const pct = progress?.percentage ?? 0
  const completed = progress?.completed ?? 0
  const total = progress?.total ?? 0

  return (
    <PageLayout title="My roadmap">

      {/* Progress header */}
      <div className="bg-[#1C0A08] rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-white">Overall progress</span>
          <span className="text-sm font-black text-[#F4C430]">{pct}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-[#F4C430] rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-xs text-white/40">{completed} of {total} tasks completed</div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-[#EAE4DC]" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([week, weekItems]) => (
            <div key={week}>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                {week}
              </div>
              <div className="flex flex-col gap-0">
                {weekItems.map((item, idx) => {
                  const cat = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.government
                  const isExpanded = expanded === item.id
                  const isLast = idx === weekItems.length - 1

                  return (
                    <div key={item.id} className="flex gap-0 items-start relative">

                      {/* Timeline */}
                      <div className="flex flex-col items-center w-10 flex-shrink-0 pt-3">
                        <button
                          onClick={() => toggle(item.id)}
                          disabled={isPending}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                            text-xs font-bold transition-all z-10 flex-shrink-0
                            ${item.completed
                              ? 'bg-[#C0392B] border-[#C0392B] text-white'
                              : 'bg-white border-[#EAE4DC] hover:border-[#C0392B]'
                            }`}
                        >
                          {item.completed ? '✓' : ''}
                        </button>
                        {!isLast && (
                          <div className="w-0.5 bg-[#EAE4DC] flex-1 mt-1 min-h-[24px]" />
                        )}
                      </div>

                      {/* Card */}
                      <div
                        className={`flex-1 bg-white border rounded-2xl p-4 mb-3 ml-2 cursor-pointer
                          transition-all hover:border-[#C0392B]/30
                          ${item.completed ? 'opacity-60' : ''}
                          ${isExpanded ? 'border-[#C0392B]/30' : 'border-[#EAE4DC]'}`}
                        onClick={() => setExpanded(isExpanded ? null : item.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className={`text-sm font-bold text-[#1C0A08] leading-tight
                              ${item.completed ? 'line-through text-gray-400' : ''}`}>
                              {item.title}
                            </div>
                            {isExpanded && (
                              <div className="text-xs text-gray-500 mt-2 leading-relaxed">
                                {item.description}
                              </div>
                            )}
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0
                            ${cat.bg} ${cat.text}`}>
                            {cat.label}
                          </span>
                        </div>
                        {item.completedAt && (
                          <div className="text-[10px] text-gray-400 mt-2">
                            ✓ Completed {new Date(item.completedAt).toLocaleDateString('en-PH')}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}