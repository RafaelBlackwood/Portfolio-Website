import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, Target, Compass } from 'lucide-react';

export default function ChroniclesSection() {
  return (
    <div className="space-y-12">
      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-amber-700 to-transparent opacity-50" />
        <p className="text-stone-300 text-lg leading-relaxed pl-4">
          I am <span className="text-amber-400 font-medium">Rafael Aghashirinov</span>, a Full Stack Software Engineer
          with a deep passion for UI/UX design. My journey spans across continents and disciplines,
          from the mathematical foundations of cybernetics to the human-centered world of interaction design.
        </p>
      </motion.div>

      {/* Philosophy cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-stone-900/60 to-stone-950/60 border border-stone-800/50 rounded-xl p-6 hover:border-amber-900/30 transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-900/30 rounded-lg">
              <Target className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-stone-200 text-lg" style={{ fontFamily: "'Cinzel', serif" }}>
              The Mission
            </h3>
          </div>
          <p className="text-stone-400 text-sm leading-relaxed">
            To create software that doesn't just function, but <span className="text-stone-300">feels right</span>.
            Every line of code I write serves the user experience. UX is more important than coding
            if the workflow isn't clear — that's my guiding principle.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-stone-900/60 to-stone-950/60 border border-stone-800/50 rounded-xl p-6 hover:border-amber-900/30 transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-900/30 rounded-lg">
              <Heart className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-stone-200 text-lg" style={{ fontFamily: "'Cinzel', serif" }}>
              The Passion
            </h3>
          </div>
          <p className="text-stone-400 text-sm leading-relaxed">
            Building tools that <span className="text-stone-300">actually solve problems</span>.
            When existing solutions don't fit, I create my own — like my personal task manager
            built specifically for my workflow. Every project is an opportunity to learn and improve.
          </p>
        </motion.div>
      </div>

      {/* Journey Map */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3
          className="text-xl text-amber-400 mb-6 tracking-wider uppercase flex items-center gap-3"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <Compass className="w-5 h-5" />
          The Path Traveled
        </h3>

        <div className="relative">
          {/* Path line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-amber-500/50 via-stone-700/30 to-transparent" />

          <div className="space-y-6">
            {[
              { location: 'Azerbaijan', period: '2018-2023', description: 'Where it began. Mathematics, cybernetics, and first steps into teaching.' },
              { location: 'Austria', period: '2023-2025', description: 'Deep dive into informatics. Professional software development experience.' },
              { location: 'Poland', period: '2025-Present', description: 'Mastering Human-Computer Interaction. Bridging the gap between technology and people.' },
            ].map((stop, index) => (
              <div key={stop.location} className="flex items-start gap-4 pl-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-900 border-2 border-amber-600/50 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-amber-500" />
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-stone-200 font-medium">{stop.location}</span>
                    <span className="text-xs text-stone-600 bg-stone-800/50 px-2 py-0.5 rounded">
                      {stop.period}
                    </span>
                  </div>
                  <p className="text-stone-500 text-sm">{stop.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Fun facts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-stone-900/30 rounded-xl p-6 border border-stone-800/30"
      >
        <h4 className="text-stone-300 text-sm uppercase tracking-wider mb-4">Quick Facts</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-2xl text-amber-400 block" style={{ fontFamily: "'Cinzel', serif" }}>4+</span>
            <span className="text-xs text-stone-500">Years Coding</span>
          </div>
          <div>
            <span className="text-2xl text-amber-400 block" style={{ fontFamily: "'Cinzel', serif" }}>4</span>
            <span className="text-xs text-stone-500">Languages Spoken</span>
          </div>
          <div>
            <span className="text-2xl text-amber-400 block" style={{ fontFamily: "'Cinzel', serif" }}>3</span>
            <span className="text-xs text-stone-500">Countries Lived</span>
          </div>
          <div>
            <span className="text-2xl text-amber-400 block" style={{ fontFamily: "'Cinzel', serif" }}>∞</span>
            <span className="text-xs text-stone-500">Curiosity</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}