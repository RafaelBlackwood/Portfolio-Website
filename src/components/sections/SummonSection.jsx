import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Github, Send, CheckCircle, Scroll } from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    label: 'Email',
    value: 'rafael.agashirinov@gmail.com',
    href: 'mailto:rafael.agashirinov@gmail.com',
    color: 'amber'
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+48 728 416 177',
    href: 'tel:+48728416177',
    color: 'stone'
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'RafaelBlackwood',
    href: 'https://github.com/RafaelBlackwood',
    color: 'stone'
  }
];

export default function SummonSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', message: '' });

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="space-y-10">
      {/* Intro text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <p className="text-stone-400 text-lg italic mb-2">
          "To begin a new chapter, one must first reach out..."
        </p>
        <p className="text-stone-500 text-sm">
          Whether it's a project, collaboration, or just to say hello — I'm listening.
        </p>
      </motion.div>

      {/* Contact methods */}
      <div className="grid gap-4">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <motion.a
              key={method.label}
              href={method.href}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center gap-4 p-4 bg-stone-900/50 border border-stone-800/50 rounded-lg hover:border-amber-800/50 hover:bg-stone-900/80 transition-all duration-300"
            >
              <div className="p-3 bg-stone-800/50 rounded-lg group-hover:bg-amber-900/30 transition-colors">
                <Icon className="w-5 h-5 text-stone-500 group-hover:text-amber-500 transition-colors" />
              </div>
              <div>
                <span className="text-xs text-stone-600 uppercase tracking-wider block">{method.label}</span>
                <span className="text-stone-300 group-hover:text-amber-300 transition-colors">{method.value}</span>
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* Message form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative"
      >
        <div className="flex items-center gap-3 mb-6">
          <Scroll className="w-5 h-5 text-amber-500" />
          <h3
            className="text-lg text-amber-400 tracking-wider uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Send a Message
          </h3>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-amber-500" />
            </div>
            <h4 className="text-stone-200 text-lg mb-2">Message Sent!</h4>
            <p className="text-stone-500 text-sm">I'll get back to you as soon as possible.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-stone-900/80 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-700 transition-colors"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-stone-900/80 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-700 transition-colors"
              />
            </div>
            <div>
              <textarea
                placeholder="Your Message"
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 bg-stone-900/80 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-700 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-stone-100 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-stone-300 border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Dispatch Message
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>

      {/* Availability note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center py-6 border-t border-stone-800/30"
      >
        <p className="text-stone-500 text-sm">
          Available up to <span className="text-amber-500">40 hours/week</span>
        </p>
        <p className="text-stone-600 text-xs mt-1">
          Based in Poland • Open to remote opportunities worldwide
        </p>
      </motion.div>
    </div>
  );
}
