import { motion } from 'framer-motion';
import { SceneFrame, Eyebrow, AccentRule, ease } from './shared';

function BagIcon() {
  return (
    <svg viewBox="0 0 80 80" className="h-[10vw] w-[10vw]" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 27h48l-4 40H20l-4-40Z" />
      <path d="M28 30v-7a12 12 0 0 1 24 0v7" />
      <path d="M28 45h24" />
    </svg>
  );
}

export function Scene4() {
  return (
    <SceneFrame>
      <motion.div className="absolute left-[-15%] top-[18%] h-[80vw] w-[80vw] rounded-full bg-[#e3b550]/22" animate={{ scale: [1, 1.05, 1], rotate: [0, 4, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="absolute right-[9%] top-[18%] text-[#c95745]"><BagIcon /></div>
      <motion.div className="absolute left-[9%] top-[25%] w-[78%]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8, ease }}>
        <Eyebrow>Tu compra, sin complicaciones</Eyebrow>
        <h2 className="display-font mt-[5%] text-[13vw] font-semibold leading-[.86] tracking-[-.055em] text-[#252329]">Elige.<br /><em className="text-[#c95745]">Guarda.</em><br />Recibe.</h2>
      </motion.div>
      <div className="absolute bottom-[16%] left-[9%] right-[9%]">
        <AccentRule />
        <div className="mt-[6%] flex items-center justify-between">
          <span className="body-font text-[2.55vw] font-bold uppercase tracking-[.13em] text-[#6c625c]">Una experiencia simple</span>
          <span className="body-font text-[3vw] font-extrabold text-[#c95745]">→</span>
        </div>
      </div>
      <motion.div className="absolute bottom-[9%] right-[9%] h-[9vw] w-[9vw] rounded-full border border-[#c95745]/50" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.4, repeat: Infinity }} />
    </SceneFrame>
  );
}