import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Sparkles, ArrowRight } from 'lucide-react';

const projects = [
  {
    id: 'edvora',
    name: 'Edvora',
    subtitle: 'University Application Platform',
    status: 'In Progress',
    description: 'A comprehensive platform to help students with the entire university application process - from searching and comparing universities to completing applications and managing the move.',
    longDescription: 'The current state of affairs indicates that there is no complete application that can help students with the entire university application process. Edvora aims to make this entire procedure simple and organized.',
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    futureTech: ['Python', 'AI/ML Integration'],
    highlights: [
      'Currently designing UI and product workflows',
      'UX-first approach before coding',
      'Planning AI features for intelligent recommendations'
    ],
    github: 'https://github.com/RafaelBlackwood',
    rarity: 'legendary'
  },
  {
    id: 'taskmanager',
    name: 'Task Manager',
    subtitle: 'Full-Stack Productivity Application',
    status: 'Completed',
    description: 'A personal task management system built from scratch to match specific productivity methodology - minimal features, maximum efficiency.',
    techStack: ['React', 'React Router', 'Axios', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    highlights: [
      'MERN stack for quick development',
      'Extensible architecture',
      'Daily usage optimized'
    ],
    github: 'https://github.com/RafaelBlackwood',
    rarity: 'epic'
  },
  {
    id: 'housingprice',
    name: 'Housing Price Prediction',
    subtitle: 'Machine Learning Regression Project',
    status: 'Completed',
    description: 'A complete ML project from data acquisition to model evaluation - learning machine learning by doing instead of tutorials.',
    techStack: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
    highlights: [
      'Kaggle-style workflow',
      'Complete pipeline: preprocessing → training → evaluation',
      'Classic regression problem with real-world relevance'
    ],
    github: 'https://github.com/RafaelBlackwood',
    rarity: 'rare'
  }
];

const rarityStyles = {
  legendary: {
    border: 'border-amber-500/50',
    glow: 'shadow-amber-500/20',
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    gradient: 'from-amber-900/20 via-stone-900/80 to-stone-950'
  },
  epic: {
    border: 'border-purple-500/50',
    glow: 'shadow-purple-500/20',
    badge: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    gradient: 'from-purple-900/20 via-stone-900/80 to-stone-950'
  },
  rare: {
    border: 'border-blue-500/50',
    glow: 'shadow-blue-500/20',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    gradient: 'from-blue-900/20 via-stone-900/80 to-stone-950'
  }
};

export default function ArtifactsSection() {
  const [expandedProject, setExpandedProject] = useState(null);

  return (
    <div className="space-y-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-stone-500 text-sm italic mb-8"
      >
        Artifacts discovered throughout the journey. Each tells a story of challenges overcome.
      </motion.p>

      {projects.map((project, index) => {
        const style = rarityStyles[project.rarity];
        const isExpanded = expandedProject === project.id;

        return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className={`relative bg-gradient-to-br ${style.gradient} border ${style.border} rounded-xl overflow-hidden hover:shadow-lg ${style.glow} transition-all duration-500`}
          >
            {/* Rarity indicator */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3
                      className="text-xl text-stone-200"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {project.name}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded border ${style.badge} uppercase tracking-wider`}>
                      {project.rarity}
                    </span>
                  </div>
                  <p className="text-amber-500/70 text-sm">{project.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  {project.status === 'In Progress' && (
                    <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                      <Sparkles className="w-3 h-3" />
                      Active
                    </span>
                  )}
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-stone-500 hover:text-amber-400 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <p className="text-stone-400 text-sm mb-4">{project.description}</p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 bg-stone-800/50 text-stone-400 rounded border border-stone-700/50"
                  >
                    {tech}
                  </span>
                ))}
                {project.futureTech?.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 bg-amber-900/20 text-amber-600 rounded border border-amber-800/30 italic"
                  >
                    {tech} (planned)
                  </span>
                ))}
              </div>

              {/* Expand/Collapse */}
              <button
                onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                className="flex items-center gap-2 text-sm text-stone-500 hover:text-amber-400 transition-colors"
              >
                <span>{isExpanded ? 'Show less' : 'View details'}</span>
                <motion.span
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-4 border-t border-stone-800/50">
                      <h4 className="text-stone-300 text-sm mb-2">Key Achievements:</h4>
                      <ul className="space-y-1">
                        {project.highlights.map((highlight, i) => (
                          <li key={i} className="text-stone-500 text-sm flex items-start gap-2">
                            <span className="text-amber-600">›</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
