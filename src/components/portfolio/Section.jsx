import React from 'react'
import { motion, useInView } from 'framer-motion'

const Section = React.forwardRef(({ title, icon, children }, ref) => {
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <section ref={ref} className="relative py-16 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 md:gap-3 mb-4">
            <div className="text-cyan-400">{icon}</div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {title}
            </h2>
          </div>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
        </motion.div>
        {children}
      </div>
    </section>
  )
})

export default Section
