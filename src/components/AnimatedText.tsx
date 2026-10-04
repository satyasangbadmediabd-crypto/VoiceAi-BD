import React from 'react';
import { motion } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDuration?: number;
  variant?: 'words' | 'characters' | 'rise' | 'typewriter';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  triggerOnView?: boolean;
}

/**
 * High-performance smart animated text component.
 * Renders words or lines with staggered fluid rise, optical blur-to-focus,
 * and kinetic character motion tailored for Bengali & English typography.
 * Supports both on-mount animations and on-scroll in-view animations.
 */
export const AnimatedText: React.FC<AnimatedTextProps> = React.memo(({
  text,
  className = '',
  delay = 0,
  staggerDuration = 0.035,
  variant = 'words',
  as = 'div',
  triggerOnView = false
}) => {
  // Variant 1: Smooth Word-by-Word Reveal with Staggered Rise
  if (variant === 'words') {
    const words = text.split(' ');

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          delayChildren: delay,
          staggerChildren: staggerDuration
        }
      }
    };

    const wordVariants = {
      hidden: {
        opacity: 0,
        y: 10,
        filter: 'blur(2px)'
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 0.35,
          ease: 'easeOut' as const
        }
      }
    };

    const Component = motion[as] || motion.div;

    return (
      <Component
        variants={containerVariants}
        initial="hidden"
        animate={triggerOnView ? undefined : 'visible'}
        whileInView={triggerOnView ? 'visible' : undefined}
        viewport={{ once: true, margin: '-20px' }}
        className={`inline-flex flex-wrap items-baseline gap-x-[0.25em] ${className}`}
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={wordVariants}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
        ))}
      </Component>
    );
  }

  // Variant 2: Fluid Masked Rise (Entire Block Slides Up from Underneath)
  if (variant === 'rise') {
    const Component = motion[as] || motion.div;

    return (
      <Component
        initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
        animate={triggerOnView ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        whileInView={triggerOnView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
        viewport={triggerOnView ? { once: true, margin: '-40px' } : undefined}
        transition={{
          duration: 0.55,
          delay,
          ease: [0.16, 1, 0.3, 1]
        }}
        className={className}
      >
        {text}
      </Component>
    );
  }

  // Variant 3: Kinetic Typewriter with glowing cursor (perfect for voice agents)
  if (variant === 'typewriter') {
    const characters = Array.from(text);

    return (
      <span className={`inline-flex items-center flex-wrap ${className}`}>
        {characters.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, display: 'none' }}
            animate={{ opacity: 1, display: 'inline' }}
            transition={{
              duration: 0.01,
              delay: delay + index * 0.03
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block w-1.5 h-3.5 ml-1 bg-cyan-400 rounded-sm shadow-[0_0_8px_rgba(6,182,212,0.8)]"
        />
      </span>
    );
  }

  // Variant 4: Character-by-Character Stagger
  const chars = Array.from(text);
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial="hidden"
      animate={triggerOnView ? undefined : 'visible'}
      whileInView={triggerOnView ? 'visible' : undefined}
      viewport={triggerOnView ? { once: true, margin: '-40px' } : undefined}
      transition={{ delayChildren: delay, staggerChildren: 0.015 }}
      className={`inline-block ${className}`}
    >
      {chars.map((c, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="inline-block"
        >
          {c === ' ' ? '\u00A0' : c}
        </motion.span>
      ))}
    </Component>
  );
});
