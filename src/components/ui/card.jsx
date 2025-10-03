export function Card({ className = '', ...props }) {
  return <div className={`rounded-xl border border-white/10 ${className}`} {...props} />
}
