import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Database, Cloud, Wrench } from 'lucide-react';

const skillCategories = [
  {
    id: 'frontend',
    name: 'Frontend Arts',
    icon: Code,
    skills: [
      { name: 'React', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Next.js', level: 80 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'JavaScript', level: 95 },
      { name: 'HTML/CSS', level: 95 },
    ]
  },
  {
    id: 'backend',
    name: 'Backend Mastery',
    icon: Database,
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 80 },
      { name: 'Python', level: 75 },
      { name: 'MongoDB', level: 80 },
      { name: 'Java', level: 85 },
      { name: 'C++', level: 70 },
    ]
  },
  {
    id: 'design',
    name: 'Design Craft',
    icon: Palette,
    skills: [
      { name: 'UI/UX Design', level: 85 },
      { name: 'Figma', level: 80 },
      { name: 'Product Design', level: 75 },
      { name: 'Responsive Design', level: 90 },
    ]
  },
  {
    id: 'devops',
    name: 'Infrastructure',
    icon: Cloud,
    skills: [
      { name: 'Docker', level: 75 },
      { name: 'Kubernetes', level: 70 },
      { name: 'CI/CD', level: 80 },
      { name: 'Git', level: 90 },
      { name: 'Linux', level: 75 },
    ]
  },
  {
    id: 'tools',
    name: 'Artifacts & Tools',
    icon: Wrench,
    skills: [
      { name: 'Machine Learning', level: 65 },
      { name: 'JUnit Testing', level: 75 },
      { name: 'Axios', level: 85 },
      { name: 'Bootstrap', level: 85 },
    ]
  }
];

const languages = [
  { name: 'English', level: 'C1', flag: '🇬🇧' },
  { name: 'Russian', level: 'C2', flag: '🇷🇺' },
  { name: 'Azerbaijani', level: 'C2', flag: '🇦🇿' },
  { name: 'German', level: 'A2-B1', flag: '🇩🇪' },
];

export default function ArsenalSection() {
  const [activeCategory, setActiveCategory] = useState('frontend');

  return (
    <div className="space-y-12">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {skillCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-amber-900/40 text-amber-400 border border-amber-600/50'
                  : 'bg-stone-900/40 text-stone-500 border border-stone-800/50 hover:text-stone-300 hover:border-stone-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wider">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Skills display */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid gap-4"
      >
        {skillCategories.find(c => c.id === activeCategory)?.skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-stone-300 group-hover:text-amber-300 transition-colors">
                {skill.name}
              </span>
              <span className="text-xs text-stone-600">{skill.level}%</span>
            </div>
            <div className="h-2 bg-stone-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full rounded-full relative"
                style={{
                  background: `linear-gradient(90deg, #92400e 0%, #c9a227 ${skill.level}%)`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent animate-pulse" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Languages */}
      <div>
        <h3
          className="text-xl text-amber-400 mb-6 tracking-wider uppercase"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Tongues Spoken
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-stone-900/50 border border-stone-800/50 rounded-lg p-4 text-center hover:border-amber-800/50 transition-colors"
            >
              <span className="text-2xl mb-2 block">{lang.flag}</span>
              <span className="text-stone-300 block">{lang.name}</span>
              <span className="text-amber-500 text-sm">{lang.level}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}