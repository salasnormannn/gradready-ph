export default function Input({
  label, error, type = 'text',
  placeholder, register, className = ''
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wide text-[#888]">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className={`w-full px-4 py-3 rounded-xl border text-sm text-[#1C0A08]
          bg-white outline-none transition-all
          border-[#EAE4DC] focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/10
          placeholder:text-gray-300
          ${error ? 'border-red-400' : ''}
          ${className}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}