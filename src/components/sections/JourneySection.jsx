import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';

const experiences = [
  {
    type: 'work',
    title: 'Junior Software Developer',
    organization: 'BOC Information Technologies Consulting GmbH',
    location: 'Vienna, Austria',
    period: 'October 2024 – March 2025',
    achievements: [
      'Created internal documentation on Docker/Kubernetes',
      'Migrated C++/Python-based services from Windows to Linux',
      'Refactored CI/CD pipeline, improving build/deploy time by 20%',
      'Implemented JUnit tests, reducing recurring bugs by 27%'
    ]
  },
  {
    type: 'work',
    title: 'Programming Tutor',
    organization: 'University of Klagenfurt',
    location: 'Klagenfurt, Austria',
    period: 'October 2024 – February 2025',
    achievements: [
      'Tutored 17 students in Java and OOP principles',
      'Designed practice assignments increasing average scores by 15%',
      'Conducted one-on-one debugging and code review sessions'
    ]
  },
  {
    type: 'work',
    title: 'IT Instructor',
    organization: 'Step Computer Academy',
    location: 'Baku, Azerbaijan',
    period: 'October 2021 – August 2023',
    achievements: [
      'Developed lesson plans leading to 20% increase in project completion',
      'Mentored students on final projects',
      'Taught Java and OOP principles'
    ]
  },
  {
    type: 'work',
    title: 'Web Developer Intern',
    organization: 'Digital Research Lab',
    location: 'Remote',
    period: 'March 2020 – September 2020',
    achievements: [
      'Created responsive websites using HTML, CSS, JavaScript, Bootstrap',
      'Optimized UI/UX design for cross-browser compatibility'
    ]
  }
];

const education = [
  {
    degree: "Master's in Human Computer Interaction",
    institution: 'Technical University of Lodz',
    location: 'Lodz, Poland',
    period: 'October 2025 – Present'
  },
  {
    degree: "Master's in Informatics",
    institution: 'Alpen-Adria-Universität',
    location: 'Klagenfurt, Austria',
    period: 'October 2023 – July 2025'
  },
  {
    degree: 'Bachelor of Applied Mathematics and Cybernetics',
    institution: 'Baku State University',
    location: 'Azerbaijan',
    period: 'September 2018 – June 2022'
  }
];

export default function JourneySection() {
  return (
    <div className="space-y-16">
      {/* Work Experience */}
      <div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl text-amber-400 mb-8 tracking-wider uppercase flex items-center gap-3"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <Briefcase className="w-6 h-6" />
          Quests Completed
        </motion.h3>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-stone-700/50 to-transparent" />

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="relative pl-12"
              >
                {/* Timeline dot */}
                <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-stone-900 border-2 border-amber-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>

                <div className="bg-gradient-to-br from-stone-900/80 to-stone-950/80 border border-stone-800/50 rounded-lg p-6 hover:border-amber-900/50 transition-colors duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-lg text-stone-200 font-medium">{exp.title}</h4>
                      <p className="text-amber-500/80 text-sm">{exp.organization}</p>
                      <p className="text-stone-500 text-xs">{exp.location}</p>
                    </div>
                    <span className="text-xs text-stone-500 flex items-center gap-1 bg-stone-800/50 px-2 py-1 rounded">
                      <Calendar className="w-3 h-3" />
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-stone-400 text-sm flex items-start gap-2">
                        <span className="text-amber-600 mt-1">›</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Education */}
      <div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl text-amber-400 mb-8 tracking-wider uppercase flex items-center gap-3"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <GraduationCap className="w-6 h-6" />
          Knowledge Acquired
        </motion.h3>

        <div className="grid gap-4">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-gradient-to-r from-stone-900/60 to-transparent border-l-2 border-amber-600/50 pl-6 py-4 hover:border-amber-400 transition-colors"
            >
              <h4 className="text-stone-200 font-medium">{edu.degree}</h4>
              <p className="text-amber-500/70 text-sm">{edu.institution}</p>
              <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                <span>{edu.location}</span>
                <span>•</span>
                <span>{edu.period}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}