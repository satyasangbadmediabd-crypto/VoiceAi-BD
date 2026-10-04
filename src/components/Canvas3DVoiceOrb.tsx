import React, { useEffect, useRef } from 'react';

interface Canvas3DVoiceOrbProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  size?: number;
  className?: string;
  glowColor?: string;
}

/**
 * High-performance 3D Canvas Voice Orb.
 * Renders an interactive 3D particle sphere with rotating orbital rings,
 * depth projection, and acoustic frequency waves without heavy external 3D libraries.
 */
export const Canvas3DVoiceOrb: React.FC<Canvas3DVoiceOrbProps> = ({
  isSpeaking = false,
  isListening = false,
  size = 320,
  className = '',
  glowColor = '#06b6d4'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Particle Sphere Generation
    const particleCount = 280;
    const particles: {
      x: number;
      y: number;
      z: number;
      baseRadius: number;
      theta: number;
      phi: number;
      speed: number;
      color: string;
      size: number;
    }[] = [];

    const sphereRadius = size * 0.32;

    for (let i = 0; i < particleCount; i++) {
      // Golden spiral distribution on sphere
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      
      const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const z = sphereRadius * Math.cos(phi);

      // Color variation: cyan, emerald, cobalt, violet
      const colorPalettes = ['#22d3ee', '#38bdf8', '#34d399', '#818cf8', '#a78bfa'];
      const color = colorPalettes[i % colorPalettes.length];

      particles.push({
        x,
        y,
        z,
        baseRadius: sphereRadius,
        theta,
        phi,
        speed: 0.004 + (i % 5) * 0.001,
        color,
        size: 1.5 + (i % 3) * 0.8
      });
    }

    let angleX = 0;
    let angleY = 0;
    let wavePulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const rotSpeedY = isSpeaking ? 0.025 : isListening ? 0.018 : 0.008;
      const rotSpeedX = isSpeaking ? 0.015 : isListening ? 0.012 : 0.005;

      angleY += rotSpeedY + mouseRef.current.x * 0.02;
      angleX += rotSpeedX + mouseRef.current.y * 0.02;

      wavePulse += isSpeaking ? 0.12 : isListening ? 0.08 : 0.04;
      const pulseMultiplier = isSpeaking ? 1.25 + Math.sin(wavePulse) * 0.18 : isListening ? 1.1 + Math.sin(wavePulse) * 0.08 : 1 + Math.sin(wavePulse) * 0.03;

      const centerX = size / 2;
      const centerY = size / 2;

      // 1. Ambient Central Core Glow
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        sphereRadius * 0.1,
        centerX,
        centerY,
        sphereRadius * 1.1
      );
      if (isSpeaking) {
        coreGradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
        coreGradient.addColorStop(0.4, 'rgba(6, 182, 212, 0.2)');
        coreGradient.addColorStop(1, 'transparent');
      } else if (isListening) {
        coreGradient.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
        coreGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.18)');
        coreGradient.addColorStop(1, 'transparent');
      } else {
        coreGradient.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
        coreGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.12)');
        coreGradient.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sphereRadius * 1.1, 0, Math.PI * 2);
      ctx.fill();

      // 2. 3D Orbital Rings (Tilted Perspective)
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Ring 1
      ctx.beginPath();
      ctx.ellipse(0, 0, sphereRadius * 1.35 * pulseMultiplier, sphereRadius * 0.45, angleY * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = isSpeaking ? 'rgba(52, 211, 153, 0.45)' : 'rgba(34, 211, 238, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();

      // Ring 2 (Cross Tilt)
      ctx.beginPath();
      ctx.ellipse(0, 0, sphereRadius * 1.2 * pulseMultiplier, sphereRadius * 0.38, -angleY * 0.8 + 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.stroke();

      ctx.restore();

      // 3. Project and Render 3D Particle Points
      const projected: {
        x2d: number;
        y2d: number;
        z: number;
        radius: number;
        alpha: number;
        color: string;
      }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Dynamic breathing radius
        const currentRadius = p.baseRadius * pulseMultiplier;
        const origX = currentRadius * Math.sin(p.phi) * Math.cos(p.theta);
        const origY = currentRadius * Math.sin(p.phi) * Math.sin(p.theta);
        const origZ = currentRadius * Math.cos(p.phi);

        // 3D Matrix Rotation (Y axis then X axis)
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = origX * cosY - origZ * sinY;
        const z1 = origX * sinY + origZ * cosY;

        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = origY * cosX - z1 * sinX;
        const z2 = origY * sinX + z1 * cosX;

        // Perspective Projection (FOV)
        const fov = 350;
        const scale = fov / (fov + z2);
        const x2d = centerX + x1 * scale;
        const y2d = centerY + y2 * scale;

        // Depth cueing (alpha based on z position)
        const depthAlpha = Math.max(0.12, (z2 + sphereRadius) / (2 * sphereRadius));
        const alpha = depthAlpha * (isSpeaking ? 0.95 : 0.85);

        projected.push({
          x2d,
          y2d,
          z: z2,
          radius: Math.max(0.6, p.size * scale * (isSpeaking ? 1.3 : 1)),
          alpha,
          color: p.color
        });
      }

      // Sort by Z for proper 3D depth rendering
      projected.sort((a, b) => a.z - b.z);

      // Render connected lines for nearest neighbors to create 3D wireframe mesh
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i += 3) {
        const p1 = projected[i];
        if (p1.z < 0) continue; // Only front side connections for clean look
        for (let j = i + 1; j < Math.min(i + 4, projected.length); j++) {
          const p2 = projected[j];
          const dist = Math.hypot(p1.x2d - p2.x2d, p1.y2d - p2.y2d);
          if (dist < 32) {
            ctx.beginPath();
            ctx.moveTo(p1.x2d, p1.y2d);
            ctx.lineTo(p2.x2d, p2.y2d);
            ctx.strokeStyle = `rgba(34, 211, 238, ${Math.min(p1.alpha, p2.alpha) * 0.25})`;
            ctx.stroke();
          }
        }
      }

      // Render particle dots
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.beginPath();
        ctx.arc(p.x2d, p.y2d, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;
      mouseRef.current.targetX = mouseX / (rect.width / 2);
      mouseRef.current.targetY = mouseY / (rect.height / 2);
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [size, isSpeaking, isListening, glowColor]);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block cursor-pointer transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
};
