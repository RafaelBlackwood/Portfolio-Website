
import React from 'react'
import { motion } from 'framer-motion'

export default function FloatingNav({ items, onClick }) {
  return (
    <motion.nav
      className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 backdrop-blur-xl bg-black/40 border border-cyan-500/30 rounded-full px-4 md:px-8 py-3 md:py-4 shadow-2xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex gap-2 md:gap-6 items-center text-xs md:text-sm">
        {items.map(item => (
          <button
            key={item.label}
            onClick={() => onClick(item.ref)}
            className="font-medium hover:text-cyan-400 transition-colors duration-300 px-2 md:px-0"
          >
            {item.label}
          </button>
        ))}
      </div>
    </motion.nav>
  )
}
