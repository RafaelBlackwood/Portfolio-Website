import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';
import MainMenu from '../components/MainMenu';
import JourneySection from '../components/sections/JourneySection';
import ArsenalSection from '../components/sections/ArsenalSection';
import ArtifactsSection from '../components/sections/ArtifactsSection';
import ChroniclesSection from '../components/sections/ChroniclesSection';
import SummonSection from '../components/sections/SummonSection';
import { X, Volume2, VolumeX, ChevronDown } from 'lucide-react';

const sectionComponents = {
  journey: JourneySection,
  arsenal: ArsenalSection,
  artifacts: ArtifactsSection,
  chronicles: ChroniclesSection,
  summon: SummonSection
};

const sectionTitles = {
  journey: 'The Journey',
  arsenal: 'The Arsenal',
  artifacts: 'Artifacts',
  chronicles: 'Chronicles',
  summon: 'Summon'
};

export default function Home() {
  const [activeSection, setActiveSection] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [introPhase, setIntroPhase] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    // Intro animation sequence
    const timers = [
      setTimeout(() => setIntroPhase(1), 500),
      setTimeout(() => setIntroPhase(2), 1500),
      setTimeout(() => setIntroPhase(3), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEnter = () => {
    setShowIntro(false);
  };

  const handleSectionSelect = (sectionId) => {
    setActiveSection(sectionId);
    // Scroll to content on mobile
    if (contentRef.current && window.innerWidth < 1024) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClose = () => {
    setActiveSection(null);
  };

  const ActiveSectionComponent = activeSection ? sectionComponents[activeSection] : null;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-300 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950" />
      <div
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120, 100, 80, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(201, 162, 39, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.3) 0%, transparent 100%)
          `
        }}
      />

      <ParticleBackground />

      {/* Intro Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950"
          >
            <div className="text-center px-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: introPhase >= 1 ? 1 : 0 }}
                transition={{ duration: 1 }}
                className="mb-2"
              >
                <span className="text-stone-600 text-sm uppercase tracking-[0.5em]">
                  The Chronicle of
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: introPhase >= 2 ? 1 : 0, y: introPhase >= 2 ? 0 : 20 }}
                transition={{ duration: 1 }}
                className="text-5xl md:text-7xl text-stone-100 mb-4"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Rafael Aghashirinov
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: introPhase >= 2 ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="mb-12"
              >
                <span className="text-amber-500/80 text-sm uppercase tracking-[0.3em]">
                  Full Stack Engineer · UI/UX Designer
                </span>
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: introPhase >= 3 ? 1 : 0 }}
                transition={{ duration: 1 }}
                onClick={handleEnter}
                className="group relative px-12 py-4 overflow-hidden"
              >
                <div className="absolute inset-0 border border-amber-700/50 rounded-sm" />
                <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/20 transition-colors duration-500" />
                <span className="relative text-amber-500 uppercase tracking-[0.3em] text-sm group-hover:text-amber-400 transition-colors">
                  Enter
                </span>
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: introPhase >= 3 ? 0.5 : 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
              >
                <ChevronDown className="w-6 h-6 text-stone-600 animate-bounce" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {!showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative z-10 min-h-screen"
          >
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 bg-gradient-to-b from-stone-950 via-stone-950/95 to-transparent backdrop-blur-sm">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h2
                    className="text-xl text-stone-300 cursor-pointer hover:text-amber-400 transition-colors"
                    style={{ fontFamily: "'Cinzel', serif" }}
                    onClick={() => setActiveSection(null)}
                  >
                    R.A.
                  </h2>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-stone-600 hover:text-stone-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </motion.button>
              </div>
            </header>

            {/* Main Layout */}
            <div className="min-h-screen pt-20 pb-10 px-6">
              <div className="max-w-7xl mx-auto grid lg:grid-cols-[350px_1fr] gap-12 items-start">
                {/* Left Side - Name & Menu */}
                <div className="lg:sticky lg:top-24">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-10"
                  >
                    <h1
                      className="text-4xl md:text-5xl text-stone-100 mb-2"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Rafael
                    </h1>
                    <h1
                      className="text-4xl md:text-5xl text-amber-500/90 mb-4"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Aghashirinov
                    </h1>
                    <p className="text-stone-500 text-sm uppercase tracking-widest">
                      Full Stack Engineer · UI/UX Design
                    </p>
                  </motion.div>

                  <MainMenu
                    onSelect={handleSectionSelect}
                    activeSection={activeSection}
                  />

                  {/* Subtle CTA when no section is selected */}
                  <AnimatePresence>
                    {!activeSection && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 1.5 }}
                        className="mt-8 text-stone-600 text-sm italic pl-6"
                      >
                        Select a path to explore...
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Side - Content */}
                <div ref={contentRef} className="min-h-[60vh]">
                  <AnimatePresence mode="wait">
                    {activeSection && ActiveSectionComponent && (
                      <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }}
                        className="relative"
                      >
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-8">
                          <h2
                            className="text-3xl text-stone-200 tracking-wider"
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {sectionTitles[activeSection]}
                          </h2>
                          <button
                            onClick={handleClose}
                            className="p-2 text-stone-600 hover:text-stone-400 transition-colors lg:hidden"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Section Content */}
                        <div className="pb-20">
                          <ActiveSectionComponent />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Empty state with atmospheric element */}
                  {!activeSection && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="flex items-center justify-center min-h-[50vh]"
                    >
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto mb-6 relative">
                          <div className="absolute inset-0 border border-stone-800/50 rounded-full animate-pulse" />
                          <div className="absolute inset-4 border border-amber-900/30 rounded-full" />
                          <div className="absolute inset-8 border border-stone-800/30 rounded-full" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl text-amber-600/50" style={{ fontFamily: "'Cinzel', serif" }}>
                              ◆
                            </span>
                          </div>
                        </div>
                        <p className="text-stone-600 text-sm">
                          Your journey awaits
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 py-6 px-6 border-t border-stone-900/50">
              <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
                <span>© 2025 Rafael Aghashirinov</span>
                <span className="hidden md:block">Crafted with passion and precision</span>
                <a
                  href="mailto:rafael.agashirinov@gmail.com"
                  className="hover:text-amber-500 transition-colors"
                >
                  rafael.agashirinov@gmail.com
                </a>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
