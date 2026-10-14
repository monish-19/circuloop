import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useVelocity, useTransform } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'text' | 'button'>('default');
  const [cursorText, setCursorText] = useState('');

  // Mouse coordinates motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for follower ring
  const springConfig = { damping: 28, stiffness: 320, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Scroll velocity tracking to dynamically morph cursor during fast scrolling
  const { scrollY, scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothScrollVelocity = useSpring(scrollVelocity, { damping: 40, stiffness: 200 });

  // Top scroll progress bar spring
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Dynamic scale multiplier when scrolling fast
  const velocityScale = useTransform(smoothScrollVelocity, [-3000, 0, 3000], [1.7, 1, 1.7]);

  useEffect(() => {
    // Only enable custom cursor on devices with fine pointer (mouse)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Global listener to detect interactive elements for cursor morphing
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest('button, a, input, select, textarea, [data-cursor]');
      const headlineEl = target.closest('[data-cursor="headline"]');

      if (headlineEl) {
        setCursorVariant('text');
        setCursorText('');
      } else if (interactiveEl) {
        const customBadge = interactiveEl.getAttribute('data-cursor-text');
        if (customBadge) {
          setCursorVariant('hover');
          setCursorText(customBadge);
        } else if (interactiveEl.tagName === 'BUTTON' || interactiveEl.tagName === 'A') {
          setCursorVariant('button');
          setCursorText('');
        } else {
          setCursorVariant('hover');
          setCursorText('');
        }
      } else {
        setCursorVariant('default');
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleElementHover, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <>
      {/* 1. Top Scroll Progress Bar in Electric Cobalt Blue */}
      <motion.div
        style={{ scaleX: progressScaleX }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-blue-600 origin-left z-[99999] pointer-events-none shadow-[0_0_10px_#3b82f6]"
      />

      {/* 2. Custom Follower Cursor */}
      {isVisible && (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
          {/* Core Center Precision Dot */}
          <motion.div
            style={{
              x: mouseX,
              y: mouseY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            className={`w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] transition-opacity duration-150 ${
              cursorVariant === 'text' ? 'opacity-30' : 'opacity-100'
            }`}
          />

          {/* Outer Kinetic Follower Ring with Velocity Dynamic Scale */}
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              translateX: '-50%',
              translateY: '-50%',
              scale: velocityScale,
            }}
            animate={{
              width: cursorVariant === 'button' ? 44 : cursorVariant === 'text' ? 64 : cursorVariant === 'hover' ? 52 : 32,
              height: cursorVariant === 'button' ? 44 : cursorVariant === 'text' ? 64 : cursorVariant === 'hover' ? 52 : 32,
              borderColor:
                cursorVariant === 'button'
                  ? 'rgba(59, 130, 246, 0.95)'
                  : cursorVariant === 'text'
                  ? 'rgba(245, 245, 245, 0.4)'
                  : 'rgba(59, 130, 246, 0.45)',
              backgroundColor:
                cursorVariant === 'button'
                  ? 'rgba(37, 99, 235, 0.14)'
                  : cursorVariant === 'text'
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(59, 130, 246, 0.04)',
            }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="rounded-full border border-blue-500/50 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none"
          >
            {cursorText && (
              <span className="text-[9px] font-mono font-semibold tracking-wider text-blue-300 uppercase px-1">
                {cursorText}
              </span>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};
