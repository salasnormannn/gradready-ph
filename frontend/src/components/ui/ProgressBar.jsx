export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-[#888]">Step {current} of {total}</span>
        <span className="text-xs font-bold text-[#C0392B]">{pct}%</span>
      </div>
      <div className="h-1.5 bg-[#EAE4DC] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#C0392B] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}