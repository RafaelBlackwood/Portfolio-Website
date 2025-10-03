
import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function EducationCard({ degree, school, location, period, status }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="relative bg-black/60 border-2 border-purple-500/30 p-6 md:p-8 backdrop-blur-sm hover:scale-105 transition-transform duration-300 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              {degree}
            </h3>
            <p className="text-base md:text-lg text-gray-100 mb-1 font-semibold">{school}</p>
            <p className="text-xs md:text-sm text-gray-300">{location}</p>
          </div>
          <div className="text-right">
            <Badge className={`mb-2 text-xs md:text-sm ${status === 'In Progress' ? 'bg-cyan-500/30 text-cyan-200 border-cyan-500/50' : 'bg-green-500/30 text-green-200 border-green-500/50'}`}>
              {status}
            </Badge>
            <p className="text-xs md:text-sm text-gray-300">{period}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
