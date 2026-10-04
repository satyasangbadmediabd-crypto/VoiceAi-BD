import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  glowColor?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * Cinematic 3D interactive tilt card.
 * Calculates mouse coordinates relative to element dimensions to generate
 * realistic physical perspective rotation and specular glass illumination.
 */
export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  depth = 12,
  glowColor = 'rgba(56, 189, 248, 0.15)',
  onClick,
  style
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-depth to +depth deg)
    const rotX = -((y - centerY) / centerY) * depth;
    const rotY = ((x - centerX) / centerX) * depth;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50 });
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className="relative rounded-2xl group transition-all duration-300"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        animate={{
          rotateX,
          rotateY,
          scale: isHovered ? 1.018 : 1,
          boxShadow: isHovered
            ? `0 20px 40px -15px rgba(0,0,0,0.7), 0 0 25px -5px ${glowColor}`
            : '0 10px 25px -5px rgba(0,0,0,0.5)'
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 24
        }}
        style={{
          transformStyle: 'preserve-3d',
          ...style
        }}
        className={`relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0c121e]/90 backdrop-blur-md transition-colors duration-200 ${className}`}
      >
        {/* Specular Dynamic Glass Glare Overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300 z-20"
          style={{
            opacity: isHovered ? 0.9 : 0,
            background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.09) 0%, rgba(255,255,255,0.02) 40%, transparent 80%)`
          }}
        />

        {/* 3D Border Glow Highlight */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl border transition-opacity duration-300 z-10"
          style={{
            opacity: isHovered ? 1 : 0,
            borderColor: glowColor
          }}
        />

        {/* Card Content with 3D physical elevation */}
        <div style={{ transform: 'translateZ(15px)' }} className="relative z-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
