import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PortraitToken({
  src,
  alt,
  fallback,
  borderColor,
  className = '',
  animate,
  transition,
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <motion.div
      aria-label={showImage ? undefined : alt}
      role={showImage ? undefined : 'img'}
      className={`flex items-center justify-center overflow-hidden rounded-full border bg-black/25 ${className}`}
      animate={animate}
      transition={transition}
      style={{
        borderColor: `${borderColor}88`,
        boxShadow: `inset 0 0 28px ${borderColor}22`,
        filter: `drop-shadow(0 0 14px ${borderColor})`,
      }}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          draggable="false"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-7xl leading-none">{fallback}</span>
      )}
    </motion.div>
  );
}
