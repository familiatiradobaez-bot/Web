import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export const ease = [0.16, 1, 0.3, 1] as const;

export function SceneFrame({
  children,
  className = '',
  background = 'scene-wash',
}: {
  children: ReactNode;
  className?: string;
  background?: string;
}) {
  return (
    <motion.section
      className={`absolute inset-0 overflow-hidden ${background} ${className}`}
      initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
      animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
      exit={{ opacity: 0, clipPath: 'inset(100% 0 0% 0)' }}
      transition={{ duration: 0.8, ease }}
    >
      {children}
    </motion.section>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <motion.div
      className={`body-font text-[2.15vw] font-bold uppercase tracking-[.2em] ${light ? 'text-[#f7f1e8]/70' : 'text-[#c95745]'}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.55, ease }}
    >
      {children}
    </motion.div>
  );
}

export function AccentRule({ light = false }: { light?: boolean }) {
  return (
    <motion.div
      className={`h-px w-[18vw] ${light ? 'bg-[#f7f1e8]/50' : 'bg-[#c95745]/70'}`}
      initial={{ scaleX: 0, transformOrigin: 'left' }}
      animate={{ scaleX: 1 }}
      transition={{ delay: 0.2, duration: 0.9, ease }}
    />
  );
}

export function ProductImage({
  src,
  className = '',
  position = 'center',
}: {
  src: string;
  className?: string;
  position?: string;
}) {
  return (
    <motion.div
      className={`video-media-frame photo-shadow overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay: 0.5, duration: 1.05, ease }}
    >
      <img src={`${import.meta.env.BASE_URL}images/${src}`} alt="" style={{ objectPosition: position }} />
    </motion.div>
  );
}