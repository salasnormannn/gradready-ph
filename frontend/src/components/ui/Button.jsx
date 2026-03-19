export default function Button({
  children, onClick, type = 'button',
  variant = 'primary', disabled = false, className = ''
}) {
  const base = 'w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-[#C0392B] text-white hover:bg-[#922B21]',
    secondary: 'bg-[#F7F3EE] text-[#1C0A08] border border-[#EAE4DC] hover:bg-[#EAE4DC]',
    gold: 'bg-[#F4C430] text-[#1C0A08] hover:bg-[#D4A017]',
    ghost: 'text-[#C0392B] hover:bg-[#FEF2F0]',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}