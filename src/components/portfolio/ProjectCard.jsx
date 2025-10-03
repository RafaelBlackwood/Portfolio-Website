import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Code, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function ProjectCard({ title, description, tech, github, gradient, borderGradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.05, y: -10 }}
    >
      <Card
        className={`relative bg-gradient-to-br ${gradient} border-2 bg-black/40 backdrop-blur-sm h-full flex flex-col overflow-hidden group`}
        style={{ borderImage: `linear-gradient(135deg, var(--tw-gradient-stops)) 1`, borderImageSlice: 1 }}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${borderGradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
        <div className="relative p-5 md:p-6">
          <div className="flex items-start justify-between mb-4">
            <Code className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
            <a href={github} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-white hover:text-cyan-400" />
            </a>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">{title}</h3>
          <p className="text-sm md:text-base text-gray-100 mb-6 flex-1 leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tech.map(t => (
              <Badge key={t} variant="outline" className="border-white/40 text-white bg-white/5">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
