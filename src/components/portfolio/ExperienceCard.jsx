

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

export default function ExperienceCard({ title, company, period, description, side }) {
  const isLeft = side === 'left'
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      <div className={`flex-1 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
        <Card className="relative bg-black/60 border-2 border-cyan-500/30 p-5 md:p-6 backdrop-blur-sm hover:scale-105 transition-transform duration-300 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-cyan-300">{title}</h3>
            <p className="text-base md:text-lg text-purple-300 mb-2 font-semibold">{company}</p>
            <p className="text-xs md:text-sm text-gray-300 mb-3 md:mb-4">{period}</p>
            <p className="text-sm md:text-base text-gray-100 leading-relaxed">{description}</p>
          </div>
        </Card>
      </div>
      <div className="hidden md:block absolute left-1/2 w-4 h-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transform -translate-x-1/2 border-4 border-[#0a0e27] shadow-lg shadow-cyan-500/50" />
      <div className="flex-1 hidden md:block" />
    </motion.div>
  )
}
