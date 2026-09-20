import { motion } from 'framer-motion';
import { SceneFrame, Eyebrow, ProductImage, ease } from './shared';

export function Scene3() {
  return (
    <SceneFrame background="scene-ink">
      <div className="absolute left-[9%] top-[16%] h-[60vw] w-[60vw] rounded-full border border-[#e3b550]/20" />
      <motion.div className="absolute bottom-[12%] left-[9%] h-[22vw] w-[22vw] rounded-full bg-[#9ab5a2]/25 blur-2xl" animate={{ y: [0, -16, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
      <ProductImage src="suprime-kids-home.jpg" className="absolute left-[8%] top-[24%] h-[41%] w-[60%] rotate-[-5deg]" position="center" />
      <motion.div className="absolute right-[9%] top-[20%] z-10 max-w-[39%]" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.48, duration: 0.85, ease }}>
        <Eyebrow light>Pequeños hallazgos</Eyebrow>
        <div className="mt-[10%] h-px w-[11vw] bg-[#e3b550]" />
        <p className="display-font mt-[10%] text-[7.6vw] font-medium leading-[.94] tracking-[-.04em] text-[#f7f1e8]">Lo que no sabías que necesitabas.</p>
      </motion.div>
      <motion.div className="absolute bottom-[12%] right-[9%] w-[45%] border-l border-[#f7f1e8]/35 pl-[6%]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05, duration: 0.6 }}>
        <span className="body-font text-[2.35vw] leading-[1.35] text-[#f7f1e8]/65">Objetos útiles.<br />Detalles que alegran.<br />Nuevas ideas.</span>
      </motion.div>
    </SceneFrame>
  );
}