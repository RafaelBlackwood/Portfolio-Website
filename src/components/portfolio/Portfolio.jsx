'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Github, Mail, Phone, MapPin, Code, Briefcase, GraduationCap, Award, Sparkles, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import dynamic from 'next/dynamic'
const Background = dynamic(() => import('./Background'), { ssr: false })
import FloatingNav from './FloatingNav'
import Section from './Section'
import QuickFact from './QuickFact'
import SkillCategory from './SkillCategory'
import ExperienceCard from './ExperienceCard'
import EducationCard from './EducationCard'
import ProjectCard from './ProjectCard'

export default function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const skillsRef = useRef(null)
  const experienceRef = useRef(null)
  const educationRef = useRef(null)
  const projectsRef = useRef(null)
  const contactRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = e => setMousePosition({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToSection = ref => ref.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="relative bg-gradient-to-br from-[#0a0e27] via-[#16213e] to-[#000000] text-white overflow-hidden">
      <Background mousePosition={mousePosition} />

      <FloatingNav
        items={[
          { label: 'About', ref: aboutRef },
          { label: 'Skills', ref: skillsRef },
          { label: 'Experience', ref: experienceRef },
          { label: 'Education', ref: educationRef },
          { label: 'Projects', ref: projectsRef },
          { label: 'Contact', ref: contactRef }
        ]}
        onClick={scrollToSection}
      />

      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 md:px-6">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)'
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative z-10 text-center max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div
              className="inline-flex items-center gap-2 mb-6 px-3 md:px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/40"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
              <span className="text-xs md:text-sm">Available for Opportunities</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black mb-3 md:mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              RAFAEL
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              AGHASHIRINOV
            </h2>
            <p className="text-base md:text-xl lg:text-2xl text-gray-200 mb-8 md:mb-12 px-4">
              Software Developer | Full-Stack Engineer | Tech Educator
            </p>
            <div className="flex gap-3 md:gap-4 justify-center flex-wrap px-4">
   <Button
  onClick={() => scrollToSection(projectsRef)}
  className="inline-flex items-center justify-center gap-2 shrink-0 min-w-[220px] md:min-w-[260px] whitespace-nowrap
             bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white
             px-6 md:px-10 py-4 md:py-5 text-sm md:text-lg rounded-full shadow-lg shadow-cyan-500/50"
>
  <Code className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
  <span>View Projects</span>
</Button>

<Button
  onClick={() => scrollToSection(contactRef)}
  className="inline-flex items-center justify-center gap-2 shrink-0 min-w-[220px] md:min-w-[260px] whitespace-nowrap
             bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white
             px-6 md:px-10 py-4 md:py-5 text-sm md:text-lg rounded-full shadow-lg shadow-purple-500/50"
>
  <Mail className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
  <span>Get in Touch</span>
</Button>
            </div>
          </motion.div>
        </div>
        <motion.div className="absolute bottom-8 md:bottom-12" animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
        </motion.div>
      </section>

      <Section ref={aboutRef} title="About Me" icon={<Sparkles />}>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Passionate Developer with a Mathematical Mind
            </h3>
            <p className="text-base md:text-lg text-gray-200 leading-relaxed mb-4">
              Junior Developer with a strong foundation in applied mathematics and cybernetics, specializing in Java programming and software development. My journey combines technical expertise with a passion for education, having taught programming to hundreds of students.
            </p>
            <p className="text-base md:text-lg text-gray-200 leading-relaxed mb-6">
              Currently pursuing a Master's in Human Computer Interaction at Technical University of Lodz, I bring a unique blend of mathematical rigor, software engineering skills, and user-centric design thinking to every project.
            </p>
            <div className="flex gap-3 md:gap-4 flex-wrap">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50 px-3 md:px-4 py-2 text-xs md:text-sm">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Lodz, Poland
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 px-3 md:px-4 py-2 text-xs md:text-sm">
                <Award className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Math & CS Background
              </Badge>
            </div>
          </motion.div>

          <motion.div className="relative" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <Card className="relative bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/30 bg-black/40 backdrop-blur-sm p-6 md:p-8 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <h4 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-cyan-400">Quick Facts</h4>
                <div className="space-y-3 md:space-y-4">
                  <QuickFact label="Languages Spoken" value="5 (Azerbaijani, Russian, English, German, Turkish)" />
                  <QuickFact label="Years Teaching" value="3+ years" />
                  <QuickFact label="Current Role" value="Software Developer & Student" />
                  <QuickFact label="Specialization" value="Java, C++, Python, Web Development" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </Section>

      <Section ref={skillsRef} title="Technical Arsenal" icon={<Code />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <SkillCategory
            title="Languages"
            skills={[
              { name: 'Java', level: 90 },
              { name: 'Python', level: 85 },
              { name: 'C++', level: 85 },
              { name: 'C#', level: 80 },
              { name: 'JavaScript', level: 85 },
              { name: 'Kotlin', level: 75 }
            ]}
            color="from-cyan-500 to-blue-500"
          />
          <SkillCategory
            title="Frameworks & Tools"
            skills={[
              { name: 'Spring Framework', level: 85 },
              { name: 'Docker', level: 75 },
              { name: 'Kubernetes', level: 70 },
              { name: '.NET', level: 80 },
              { name: 'Android Studio', level: 75 },
              { name: 'REST API', level: 90 }
            ]}
            color="from-purple-500 to-pink-500"
          />
          <SkillCategory
            title="Technologies"
            skills={[
              { name: 'PostgreSQL', level: 85 },
              { name: 'Git', level: 90 },
              { name: 'VMWare', level: 70 },
              { name: 'WPF', level: 75 },
              { name: 'HTML/CSS', level: 95 },
              { name: 'React', level: 80 }
            ]}
            color="from-pink-500 to-orange-500"
          />
        </div>
      </Section>

      <Section ref={experienceRef} title="Professional Journey" icon={<Briefcase />}>
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500" />
          <div className="space-y-8 md:space-y-12">
            <ExperienceCard
              title="Junior Software Developer"
              company="BOC Information Technologies Consulting GmbH"
              period="October 2024 - March 2025"
              description="Implemented software solutions using C++ in accordance with project requirements, assisted in ICT operations, and conducted software testing to ensure quality and performance standards."
              side="left"
            />
            <ExperienceCard
              title="Programming Tutor"
              company="University of Klagenfurt"
              period="October 2024 - February 2025"
              description="Led tutoring sessions for undergraduate students, focusing on fundamental and advanced concepts in structured and object-oriented programming using Java."
              side="right"
            />
            <ExperienceCard
              title="Programming Teacher"
              company="Step Computer Academy"
              period="October 2021 - August 2023"
              description="Led courses on website development using HTML, CSS, JavaScript, and backend frameworks. Designed engaging curriculum covering C++, Python, and C# programming concepts."
              side="left"
            />
            <ExperienceCard
              title="Web Developer Intern"
              company="Digital Research Lab"
              period="March 2020 - September 2020"
              description="Engaged in comprehensive digital projects, collaborated with team to research and develop new software solutions, and optimized existing algorithms using mathematical knowledge."
              side="right"
            />
          </div>
        </div>
      </Section>

      <Section ref={educationRef} title="Academic Background" icon={<GraduationCap />}>
        <div className="grid gap-4 md:gap-6">
          <EducationCard
            degree="Master's in Human Computer Interaction"
            school="Technical University of Lodz"
            location="Lodz, Poland"
            period="October 2025 - Present"
            status="In Progress"
          />
          <EducationCard
            degree="Master's in Informatics"
            school="Alpen-Adria-Universität"
            location="Klagenfurt, Austria"
            period="October 2023 - July 2025"
            status="Completed"
          />
          <EducationCard
            degree="Bachelor of Applied Mathematics and Cybernetics"
            school="Baku State University"
            location="Azerbaijan"
            period="September 2018 - June 2022"
            status="Completed"
          />
        </div>
      </Section>

      <Section ref={projectsRef} title="Featured Projects" icon={<Code />}>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <ProjectCard
            title="Task Manager"
            description="A comprehensive task management application built to help users organize and track their daily tasks efficiently. Features include task creation, categorization, priority setting, and progress tracking."
            tech={['Java', 'Spring', 'PostgreSQL']}
            github="https://github.com/RafaelBlackwood/Task-Manager"
            gradient="from-cyan-500/20 to-blue-500/20"
            borderGradient="from-cyan-500 to-blue-500"
          />
          <ProjectCard
            title="Edvora"
            description="An innovative platform designed to streamline educational processes and improve learning experiences. Includes features for course management, student tracking, and interactive learning tools."
            tech={['React', 'Node.js', 'MongoDB']}
            github="https://github.com/RafaelBlackwood/Edvora"
            gradient="from-purple-500/20 to-pink-500/20"
            borderGradient="from-purple-500 to-pink-500"
          />
          <ProjectCard
            title="Housing Price Prediction"
            description="A machine learning project that predicts housing prices based on various features. Demonstrates data analysis skills and implementation of predictive models using Python."
            tech={['Python', 'Scikit-learn', 'Pandas']}
            github="https://github.com/RafaelBlackwood/HousingPricePredictionMini"
            gradient="from-pink-500/20 to-orange-500/20"
            borderGradient="from-pink-500 to-orange-500"
          />
        </div>
      </Section>

      <Section ref={contactRef} title="Let's Connect" icon={<Mail />}>
        <motion.div className="max-w-3xl mx-auto text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-base md:text-xl text-gray-200 mb-8 md:mb-12 px-4">
            I'm always interested in new opportunities, collaborations, and interesting projects. Feel free to reach out!
          </p>
          <Card className="bg-black/60 border-2 border-cyan-500/30 p-6 md:p-12 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-4 md:gap-8">
              <a
                href="mailto:rafael.agashirinov@gmail.com"
                className="group flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 hover:from-cyan-500/25 hover:to-blue-500/25 transition-all duration-300 border-2 border-cyan-500/30 hover:border-cyan-500/60"
              >
                <div className="p-2 md:p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/50">
                  <Mail className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs md:text-sm text-cyan-300 font-semibold">Email</p>
                  <p className="font-semibold text-sm md:text-base break-all text-white">rafael.agashirinov@gmail.com</p>
                </div>
              </a>

              <a
                href="tel:+48728416177"
                className="group flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-xl bg-gradient-to-br from-purple-500/15 to-pink-500/15 hover:from-purple-500/25 hover:to-pink-500/25 transition-all duration-300 border-2 border-purple-500/30 hover:border-purple-500/60"
              >
                <div className="p-2 md:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/50">
                  <Phone className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs md:text-sm text-purple-300 font-semibold">Phone</p>
                  <p className="font-semibold text-sm md:text-base text-white">+48 728 416 177</p>
                </div>
              </a>

              <a
                href="https://github.com/RafaelBlackwood"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-xl bg-gradient-to-br from-pink-500/15 to-orange-500/15 hover:from-pink-500/25 hover:to-orange-500/25 transition-all duration-300 border-2 border-pink-500/30 hover:border-pink-500/60"
              >
                <div className="p-2 md:p-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/50">
                  <Github className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs md:text-sm text-pink-300 font-semibold">GitHub</p>
                  <p className="font-semibold text-sm md:text-base text-white">@RafaelBlackwood</p>
                </div>
              </a>

              <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-xl bg-gradient-to-br from-orange-500/15 to-red-500/15 border-2 border-orange-500/30">
                <div className="p-2 md:p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg shadow-orange-500/50">
                  <MapPin className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs md:text-sm text-orange-300 font-semibold">Location</p>
                  <p className="font-semibold text-sm md:text-base text-white">Lodz, Poland</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </Section>

      <footer className="relative py-8 md:py-12 border-t border-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <p className="text-sm md:text-base text-gray-400">
            © 2025 Rafael Aghashirinov. Crafted with passion and code.
          </p>
        </div>
      </footer>
    </div>
  )
}
