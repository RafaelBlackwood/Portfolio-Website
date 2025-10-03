import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

export default function SkillCategory({ title, skills, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white/5 border-white/10 p-5 md:p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
        <h3 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
          {title}
        </h3>
        <div className="space-y-3 md:space-y-4">
          {skills.map(skill => (
            <div key={skill.name}>
              <div className="flex justify-between mb-2">
                <span className="text-xs md:text-sm font-medium text-gray-200">{skill.name}</span>
                <span className="text-xs md:text-sm text-gray-400">{skill.level}%</span>
              </div>
              <div className="h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${color} rounded-full`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
