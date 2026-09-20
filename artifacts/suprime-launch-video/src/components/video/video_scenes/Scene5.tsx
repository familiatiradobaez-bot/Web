import { motion } from 'framer-motion';
import { SceneFrame, Eyebrow, ProductImage, AccentRule, ease } from './shared';

export function Scene5() {
  return (
    <SceneFrame background="scene-wash">
      <div className="absolute right-[7%] top-[16%] h-[28vw] w-[28vw] rounded-full border border-[#c95745]/25 float-slow" />
      <motion.div className="absolute -left-[12%] bottom-[7%] h-[46vw] w-[46vw] rounded-full bg-[#9ab5a2]/30 blur-3xl" animate={{ y: [0, -18, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
      <ProductImage src="suprime-care.jpg" className="absolute right-[9%] top-[21%] h-[36%] w-[54%] rotate-[4deg]" position="center" />
      <motion.div className="absolute left-[9%] top-[18%] z-10 max-w-[72%]" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8, ease }}>
        <Eyebrow>Hecho para tu ritmo</Eyebrow>
        <h2 className="display-font mt-[6%] text-[11.2vw] font-semibold leading-[.88] tracking-[-.05em] text-[#252329]">Productos<br /><em className="text-[#c95745]">pensados</em><br />para cada día.</h2>
      </motion.div>
      <motion.div className="absolute bottom-[13%] left-[9%] right-[9%] border-t border-[#252329]/18 pt-[6%]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.7 }}>
        <div className="flex items-end justify-between">
          <span className="body-font max-w-[60%] text-[2.65vw] leading-[1.35] text-[#6c625c]">Una selección amplia,<br />con ojo local.</span>
          <div className="text-right"><AccentRule /><span className="mt-3 block body-font text-[2vw] font-bold tracking-[.16em] text-[#c95745]">SDQ · 2024</span></div>
        </div>
      </motion.div>
    </SceneFrame>
  );
}