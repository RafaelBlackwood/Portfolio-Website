export function Button({ className = '', ...props }) {
  return <button className={`rounded px-4 py-2 ${className}`} {...props} />
}
