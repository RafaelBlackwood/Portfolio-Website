import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ─── D6 Dots layout ───────────────────────────────────────────────────────────
const D6_DOTS = {
  1: [[50,50]],
  2: [[28,28],[72,72]],
  3: [[28,28],[50,50],[72,72]],
  4: [[28,28],[72,28],[28,72],[72,72]],
  5: [[28,28],[72,28],[50,50],[28,72],[72,72]],
  6: [[28,25],[72,25],[28,50],[72,50],[28,75],[72,75]],
};

// A single die face for the CSS 3D cube
function CubeFace({ value, faceColor, dotColor, size, style }) {
  const dots = D6_DOTS[value] || D6_DOTS[1];
  return (
    <div style={{
      position: 'absolute',
      width: size, height: size,
      background: `linear-gradient(135deg, ${faceColor}ee, #1a0e40cc)`,
      border: '2px solid #8070d0',
      borderRadius: 10,
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      boxShadow: 'inset 0 3px 8px rgba(255,255,255,0.18), inset 0 -3px 8px rgba(0,0,0,0.6)',
      ...style,
    }}>
      {dots.map(([x, y], i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${x}%`, top: `${y}%`,
          transform: 'translate(-50%,-50%)',
          width: size * 0.15, height: size * 0.15,
          borderRadius: '50%',
          background: dotColor,
          boxShadow: `0 0 5px ${dotColor}, 0 0 10px ${dotColor}88`,
        }} />
      ))}
    </div>
  );
}

// ─── True CSS 3D Cube D6 ─────────────────────────────────────────────────────
export function D6Die({ value, rolling, color = '#1a1040', size = 52, delay = 0 }) {
  const half = size / 2;
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [displayVal, setDisplayVal] = useState(value || 1);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!rolling) {
      setDisplayVal(value);
      // Snap to a face showing the value
      setRotX(0);
      setRotY(0);
      return;
    }
    let count = 0;
    let rx = 0, ry = 0;
    intervalRef.current = setInterval(() => {
      rx += 37 + Math.random() * 30;
      ry += 43 + Math.random() * 30;
      setRotX(rx);
      setRotY(ry);
      setDisplayVal(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 14) clearInterval(intervalRef.current);
    }, 70);
    return () => clearInterval(intervalRef.current);
  }, [rolling, value]);

  const dotColor = '#e8d8ff';

  const faces = [
    { val: 1, style: { transform: `translateZ(${half}px)` } },
    { val: 6, style: { transform: `rotateY(180deg) translateZ(${half}px)` } },
    { val: 2, style: { transform: `rotateY(90deg) translateZ(${half}px)` } },
    { val: 5, style: { transform: `rotateY(-90deg) translateZ(${half}px)` } },
    { val: 3, style: { transform: `rotateX(90deg) translateZ(${half}px)` } },
    { val: 4, style: { transform: `rotateX(-90deg) translateZ(${half}px)` } },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: rolling ? [0.4, 1.3, 1.1, 1] : 1 }}
      transition={{ duration: rolling ? 1.0 : 0.3, ease: 'easeOut', delay }}
      style={{
        display: 'inline-block',
        width: size, height: size,
        perspective: size * 4,
        filter: rolling ? `drop-shadow(0 0 14px #a080ff)` : `drop-shadow(0 0 5px #6050b088)`,
      }}
    >
      <div style={{
        width: size, height: size,
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        transition: rolling ? 'transform 0.07s linear' : 'transform 0.4s ease-out',
      }}>
        {faces.map((f, i) => (
          <CubeFace key={i} value={f.val} faceColor={color} dotColor={dotColor} size={size} style={f.style} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── 3D D20 Die ──────────────────────────────────────────────────────────────
export function D20Die({ value, rolling, result }) {
  const resultColor = result === 'crit' ? '#ffd700' : result === 'miss' ? '#ff3030' : result === 'hit' ? '#40ff80' : '#9080e0';
  const glowColor   = result === 'crit' ? '#ffd70066' : result === 'miss' ? '#ff303066' : result === 'hit' ? '#40ff8066' : '#9080e044';

  const [spinY, setSpinY] = useState(0);
  const [spinX, setSpinX] = useState(0);
  const [scale, setScale] = useState(0.3);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!rolling) {
      setSpinY(0); setSpinX(0); setScale(1);
      return;
    }
    let sy = 0, sx = 0, count = 0;
    setScale(0.3);
    intervalRef.current = setInterval(() => {
      sy += 55 + Math.random() * 40;
      sx += 40 + Math.random() * 35;
      setSpinY(sy);
      setSpinX(sx);
      setScale(s => Math.min(1.3, s + 0.08));
      count++;
      if (count > 16) clearInterval(intervalRef.current);
    }, 65);
    return () => clearInterval(intervalRef.current);
  }, [rolling]);

  const size = 100;

  return (
    <div style={{ width: size, height: size, perspective: 400, display: 'inline-block' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          width: size, height: size,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateY(${spinY}deg) rotateX(${spinX}deg) scale(${scale})`,
          transition: rolling ? 'transform 0.065s linear' : 'transform 0.5s ease-out',
          filter: `drop-shadow(0 0 18px ${glowColor})`,
        }}
      >
        {/* Front face */}
        <D20Face value={value} resultColor={resultColor} glowColor={glowColor} transform={`translateZ(${size * 0.3}px)`} />
        {/* Back face */}
        <D20Face value={21 - value} resultColor={resultColor} glowColor={glowColor} transform={`rotateY(180deg) translateZ(${size * 0.3}px)`} />
        {/* Side faces for depth */}
        {[0,1,2,3].map(i => (
          <D20Face key={i} value={[2,3,4,5][i]} resultColor={resultColor} glowColor={glowColor}
            transform={`rotateY(${90 * i}deg) translateZ(${size * 0.28}px) scale(0.85)`} opacity={0.6} />
        ))}
      </motion.div>
    </div>
  );
}

function D20Face({ value, resultColor, glowColor, transform, opacity = 1 }) {
  const size = 100;
  return (
    <div style={{
      position: 'absolute', width: size, height: size,
      transform, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
      opacity,
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', inset: -8,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        filter: 'blur(6px)',
      }} />
      {/* Polygon body */}
      <div style={{
        position: 'absolute', inset: 0,
        clipPath: 'polygon(50% 0%, 93% 18%, 100% 62%, 73% 100%, 27% 100%, 0% 62%, 7% 18%)',
        background: `linear-gradient(145deg, #2a1060 0%, #18083a 50%, #0e0425 100%)`,
        boxShadow: `inset 0 3px 12px rgba(255,255,255,0.18), inset 0 -3px 8px rgba(0,0,0,0.7)`,
      }} />
      {/* Border SVG */}
      <svg style={{ position: 'absolute', inset: 0 }} viewBox="0 0 100 100" width={size} height={size}>
        <polygon points="50,2 94,20 100,65 73,100 27,100 0,65 6,20"
          fill="none" stroke={resultColor} strokeWidth="1.5" strokeOpacity="0.9"/>
        <polygon points="50,15 82,28 88,58 68,88 32,88 12,58 18,28"
          fill="none" stroke={resultColor} strokeWidth="0.6" strokeOpacity="0.3"/>
        <line x1="50" y1="2"  x2="50" y2="88" stroke={resultColor} strokeWidth="0.4" strokeOpacity="0.2"/>
        <line x1="6"  y1="20" x2="88" y2="58" stroke={resultColor} strokeWidth="0.4" strokeOpacity="0.2"/>
        <line x1="94" y1="20" x2="12" y2="58" stroke={resultColor} strokeWidth="0.4" strokeOpacity="0.2"/>
      </svg>
      {/* Number */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, fontWeight: 'bold',
        color: resultColor,
        fontFamily: "'Cinzel',serif",
        textShadow: `0 0 14px ${resultColor}, 0 0 28px ${resultColor}88`,
        paddingTop: 6,
      }}>
        {value}
      </div>
    </div>
  );
}

// ─── Multiple D6 Damage Roll ──────────────────────────────────────────────────
export function DamageDiceRoll({ rolls, total, rolling }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-3 flex-wrap justify-center">
        {rolls.map((val, i) => (
          <D6Die key={i} value={val} rolling={rolling} delay={i * 0.1} size={56} />
        ))}
      </div>
      {!rolling && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold"
          style={{ fontFamily: "'Cinzel',serif", color: '#ff6040', textShadow: '0 0 16px #ff604088' }}
        >
          {total} damage!
        </motion.div>
      )}
    </div>
  );
}
