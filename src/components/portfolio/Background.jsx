'use client'

import React, { useMemo, useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

// === TUNING KNOBS ===
const PARALLAX_X_MIN = 14;   // per-shape parallax strength (px) — min
const PARALLAX_X_MAX = 42;   // per-shape parallax strength (px) — max
const PARALLAX_Y_SCALE = 0.6;

const DRIFT_RANGE_MIN = 10;  // px
const DRIFT_RANGE_MAX = 28;  // px
const DRIFT_SPEED_MIN = 0.08; // Hz (~cycles per second) => 0.08 ≈ 12.5s period
const DRIFT_SPEED_MAX = 0.16; // 0.16 ≈ 6.25s period

const ROT_DEG = 18;          // total rotation “energy”
const FOLLOW_DURATION = 0.35; // seconds; responsiveness of the follow ease

const GLOW_FOLLOW = 0.9;     // seconds; glow ease behind mouse

export default function Background({ mousePosition }) {
  // viewport (for normalized mouse)
  const [vw, setVw] = useState(0)
  const [vh, setVh] = useState(0)
  useEffect(() => {
    const handle = () => { setVw(window.innerWidth || 1); setVh(window.innerHeight || 1) }
    handle()
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  // per-shape constants (size/pos/strength/drift params)
  const shapesData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const kinds = ['hexagon', 'square', 'triangle', 'circle']
      const shape = kinds[i % 4]
      const size = 25 + Math.random() * 20
      const leftPct = 5 + Math.random() * 90
      const topPct  = 5 + Math.random() * 90

      const parX = PARALLAX_X_MIN + Math.random() * (PARALLAX_X_MAX - PARALLAX_X_MIN)
      const parY = parX * PARALLAX_Y_SCALE

      // drift amplitudes/speeds/phases
      const driftAmpX = DRIFT_RANGE_MIN + Math.random() * (DRIFT_RANGE_MAX - DRIFT_RANGE_MIN)
      const driftAmpY = DRIFT_RANGE_MIN + Math.random() * (DRIFT_RANGE_MAX - DRIFT_RANGE_MIN)
      const speedX = DRIFT_SPEED_MIN + Math.random() * (DRIFT_SPEED_MAX - DRIFT_SPEED_MIN)
      const speedY = DRIFT_SPEED_MIN + Math.random() * (DRIFT_SPEED_MAX - DRIFT_SPEED_MIN)
      const phaseX = Math.random() * Math.PI * 2
      const phaseY = Math.random() * Math.PI * 2
      const rotSpeed = DRIFT_SPEED_MIN + Math.random() * (DRIFT_SPEED_MAX - DRIFT_SPEED_MIN)
      const rotPhase = Math.random() * Math.PI * 2

      return { i, shape, size, leftPct, topPct, parX, parY, driftAmpX, driftAmpY, speedX, speedY, phaseX, phaseY, rotSpeed, rotPhase }
    })
  }, [])

  // time source for drifting (RAF)
  const [t, setT] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)
  useEffect(() => {
    const loop = (now) => {
      if (!startRef.current) startRef.current = now
      const elapsed = (now - startRef.current) / 1000 // seconds
      setT(elapsed)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  // normalized mouse in [-1, 1]
  const nx = vw ? (mousePosition.x - vw / 2) / (vw / 2) : 0
  const ny = vh ? (mousePosition.y - vh / 2) / (vh / 2) : 0

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Background grid */}
      <motion.div 
        className="absolute inset-0 opacity-15"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0,212,255,0.15) 1px, transparent 1px),
            linear-gradient(rgba(0,212,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Nodes */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute rounded-full"
          style={{
            width: 12, height: 12,
            left: `${(i % 5) * 20 + 10}%`,
            top:  `${Math.floor(i / 5) * 25 + 10}%`,
            background: i % 3 === 0
              ? 'radial-gradient(circle, rgba(0,212,255,0.95) 0%, rgba(0,212,255,0.4) 100%)'
              : i % 3 === 1
              ? 'radial-gradient(circle, rgba(184,54,255,0.95) 0%, rgba(184,54,255,0.4) 100%)'
              : 'radial-gradient(circle, rgba(236,72,153,0.95) 0%, rgba(236,72,153,0.4) 100%)',
            boxShadow: `0 0 25px ${i % 3 === 0 ? 'rgba(0,212,255,0.9)' : i % 3 === 1 ? 'rgba(184,54,255,0.9)' : 'rgba(236,72,153,0.9)'}`
          }}
          animate={{ scale: [1, 2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
        />
      ))}

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.5 }}>
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,212,255,0)" />
            <stop offset="50%" stopColor="rgba(0,212,255,1)" />
            <stop offset="100%" stopColor="rgba(184,54,255,0)" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(184,54,255,0)" />
            <stop offset="50%" stopColor="rgba(236,72,153,1)" />
            <stop offset="100%" stopColor="rgba(0,212,255,0)" />
          </linearGradient>
        </defs>

        {[...Array(4)].map((_, i) => (
          <motion.line
            key={`h-line-${i}`}
            x1="0%" y1={`${i * 25 + 10}%`} x2="100%" y2={`${i * 25 + 10}%`}
            stroke={i % 2 === 0 ? 'url(#lineGradient1)' : 'url(#lineGradient2)'}
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 15, repeat: Infinity, delay: i * 3, ease: 'easeInOut' }}
          />
        ))}

        {[...Array(5)].map((_, i) => (
          <motion.line
            key={`v-line-${i}`}
            x1={`${i * 20 + 10}%`} y1="0%" x2={`${i * 20 + 10}%`} y2="100%"
            stroke={i % 2 === 0 ? 'url(#lineGradient1)' : 'url(#lineGradient2)'}
            strokeWidth="2.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 15, repeat: Infinity, delay: i * 3 + 1, ease: 'easeInOut' }}
          />
        ))}

        {[...Array(15)].map((_, i) => {
          const fromX = (i % 5) * 20 + 10
          const fromY = Math.floor(i / 5) * 25 + 10
          const toX = ((i + 1) % 5) * 20 + 10
          const toY = Math.floor((i + 1) / 5) * 25 + 10
          return (
            <motion.line
              key={`d-line-${i}`}
              x1={`${fromX}%`} y1={`${fromY}%`} x2={`${toX}%`} y2={`${toY}%`}
              stroke={i % 2 === 0 ? 'url(#lineGradient1)' : 'url(#lineGradient2)'}
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: 12, repeat: Infinity, delay: i * 1.2, ease: 'easeInOut' }}
            />
          )
        })}
      </svg>

      {/* Parallax + random drift shapes */}
      {shapesData.map((s) => {
        // random drift via sine/cos, blended with parallax
        const driftX = Math.sin((t + s.phaseX) * Math.PI * 2 * s.speedX) * s.driftAmpX
        const driftY = Math.cos((t + s.phaseY) * Math.PI * 2 * s.speedY) * s.driftAmpY
        const parX = nx * s.parX
        const parY = ny * s.parY

        const targetX = parX + driftX
        const targetY = parY + driftY

        // gentle rotation: part parallax-tilt + part drift-tilt
        const tiltFromMouse = nx * (ROT_DEG * 0.6)
        const tiltDrift = Math.sin((t + s.rotPhase) * Math.PI * 2 * s.rotSpeed) * (ROT_DEG * 0.4)
        const targetRot = tiltFromMouse + tiltDrift

        return (
          <motion.div
            key={`shape-${s.i}`}
            className="absolute"
            style={{ width: s.size, height: s.size, left: `${s.leftPct}%`, top: `${s.topPct}%` }}
            animate={{ x: targetX, y: targetY, rotate: targetRot }}
            transition={{ duration: FOLLOW_DURATION, ease: 'easeOut' }}
          >
            {s.shape === 'hexagon' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50 1 95 25 95 75 50 99 5 75 5 25"
                  fill="none"
                  stroke={s.i % 3 === 0 ? 'rgba(0,212,255,0.8)' : s.i % 3 === 1 ? 'rgba(184,54,255,0.8)' : 'rgba(236,72,153,0.8)'}
                  strokeWidth="4"
                />
              </svg>
            )}
            {s.shape === 'square' && (
              <div
                className="w-full h-full border-4 rounded-lg"
                style={{ borderColor: s.i % 3 === 0 ? 'rgba(0,212,255,0.8)' : s.i % 3 === 1 ? 'rgba(184,54,255,0.8)' : 'rgba(236,72,153,0.8)' }}
              />
            )}
            {s.shape === 'triangle' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50 10 90 90 10 90"
                  fill="none"
                  stroke={s.i % 3 === 0 ? 'rgba(0,212,255,0.8)' : s.i % 3 === 1 ? 'rgba(184,54,255,0.8)' : 'rgba(236,72,153,0.8)'}
                  strokeWidth="4"
                />
              </svg>
            )}
            {s.shape === 'circle' && (
              <div
                className="w-full h-full border-4 rounded-full"
                style={{ borderColor: s.i % 3 === 0 ? 'rgba(0,212,255,0.8)' : s.i % 3 === 1 ? 'rgba(184,54,255,0.8)' : 'rgba(236,72,153,0.8)' }}
              />
            )}
          </motion.div>
        )
      })}

      {/* Code symbols */}
      {['<>', '{}', '[]', '/>', '()', '===', '!=', '&&'].map((symbol, i) => (
        <motion.div
          key={`symbol-${i}`}
          className="absolute text-3xl font-mono font-bold"
          style={{
            left: `${8 + i * 12}%`,
            top: `${15 + (i % 3) * 30}%`,
            color: i % 3 === 0 ? 'rgba(0,212,255,0.4)' : i % 3 === 1 ? 'rgba(184,54,255,0.4)' : 'rgba(236,72,153,0.4)'
          }}
          animate={{ y: [0, -120, 0], opacity: [0.3, 0.7, 0.3], rotate: [0, 180, 0] }}
          transition={{ duration: 15 + i * 2, repeat: Infinity, delay: i * 2, ease: 'easeInOut' }}
        >
          {symbol}
        </motion.div>
      ))}

      {/* Mouse-follow glow */}
      <motion.div
        className="absolute w-[1000px] h-[1000px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(184,54,255,0.12) 40%, rgba(236,72,153,0.08) 70%, transparent 100%)',
          filter: 'blur(60px)',
          left: mousePosition.x - 500,
          top: mousePosition.y - 500,
          transition: `all ${GLOW_FOLLOW}s ease-out`
        }}
      />
    </div>
  )
}
