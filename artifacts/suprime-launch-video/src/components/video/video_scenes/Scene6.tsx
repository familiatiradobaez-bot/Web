import { motion } from 'framer-motion';
import { SceneFrame, AccentRule, ease } from './shared';

export function Scene6() {
  return (
    <SceneFrame background="scene-coral">
      <motion.div className="absolute left-[-23%] top-[8%] h-[76vw] w-[76vw] rounded-full border border-[#f7f1e8]/20" animate={{ rotate: [0, -8, 0], scale: [1, 1.03, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute right-[-15%] bottom-[10%] h-[53vw] w-[53vw] rounded-full bg-[#e3b550]/25 blur-2xl" animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute left-[9%] top-[22%]" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease }}>
        <span className="body-font text-[2.3vw] font-bold uppercase tracking-[.21em] text-[#f7f1e8]/70">Este es solo el comienzo</span>
        <h2 className="display-font mt-[7%] text-[14vw] font-semibold leading-[.84] tracking-[-.06em] text-[#f7f1e8]">Suprime<br /><em className="text-[#f6cf78]">viene</em><br />con más.</h2>
      </motion.div>
      <motion.div className="absolute bottom-[19%] left-[9%] right-[9%]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7, ease }}>
        <AccentRule light />
        <p className="body-font mt-[6%] max-w-[80%] text-[3.3vw] font-semibold leading-[1.3] text-[#f7f1e8]">Proyecto en desarrollo.<br />Pronto llegan nuevas mejoras<br />y muchos más productos.</p>
      </motion.div>
      <motion.div className="absolute bottom-[8%] right-[9%] body-font text-[2.1vw] font-bold tracking-[.2em] text-[#f7f1e8]/65" animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 2.8, repeat: Infinity }}>
        SUPRIME · RD
      </motion.div>
    </SceneFrame>
  );
}