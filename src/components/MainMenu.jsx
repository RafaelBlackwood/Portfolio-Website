import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

const menuItems = [
  { id: 'journey', label: 'The Journey', subtitle: 'Experience & Education' },
  { id: 'arsenal', label: 'The Arsenal', subtitle: 'Skills & Technologies' },
  { id: 'artifacts', label: 'Artifacts', subtitle: 'Projects & Creations' },
  { id: 'chronicles', label: 'Chronicles', subtitle: 'About Me' },
  { id: 'summon', label: 'Summon', subtitle: 'Contact' },
  { id: 'game', label: 'The Challenge', subtitle: 'Test Your Reflexes', isLink: true },
];

export default function MainMenu({ onSelect, activeSection }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <nav className="relative z-10">
      <ul className="space-y-2">
        {menuItems.map((item, index) => {
          const content = (
            <>
              {/* Hover background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-transparent rounded-r-lg"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{
                  opacity: hoveredItem === item.id || activeSection === item.id ? 1 : 0,
                  scaleX: hoveredItem === item.id || activeSection === item.id ? 1 : 0
                }}
                style={{ originX: 0 }}
                transition={{ duration: 0.2 }}
              />

              {/* Left border indicator */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600"
                initial={{ scaleY: 0 }}
                animate={{
                  scaleY: hoveredItem === item.id || activeSection === item.id ? 1 : 0
                }}
                transition={{ duration: 0.2 }}
              />

              <div className="relative flex items-center gap-4">
                <motion.span
                  animate={{
                    x: hoveredItem === item.id ? 8 : 0,
                    opacity: hoveredItem === item.id || activeSection === item.id ? 1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-5 h-5 text-amber-500" />
                </motion.span>

                <div>
                  <span
                    className="block text-xl tracking-wider uppercase"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {item.label}
                  </span>
                  <AnimatePresence>
                    {(hoveredItem === item.id || activeSection === item.id) && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="block text-xs text-stone-500 tracking-widest uppercase"
                      >
                        {item.subtitle}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          );

          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            >
              {item.isLink ? (
                <Link
                  to={createPageUrl('Game')}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="group relative w-full text-left py-3 px-6 transition-all duration-300 text-stone-400 hover:text-amber-300 block"
                >
                  {content}
                </Link>
              ) : (
                <button
                  onClick={() => onSelect(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`group relative w-full text-left py-3 px-6 transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-amber-400'
                      : 'text-stone-400 hover:text-amber-300'
                  }`}
                >
                  {content}
                </button>
              )}
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
}