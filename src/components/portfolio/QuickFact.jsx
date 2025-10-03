import React from 'react'

export default function QuickFact({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 md:py-3 border-b border-cyan-500/20">
      <span className="text-sm md:text-base text-gray-200 font-medium">{label}</span>
      <span className="font-semibold text-sm md:text-base text-cyan-300">{value}</span>
    </div>
  )
}
