import { motion } from 'framer-motion';
import { SceneFrame, Eyebrow, AccentRule, ProductImage, ease } from './shared';

export function Scene1() {
  return (
    <SceneFrame>
      <div className="absolute -right-[18%] top-[14%] h-[48vw] w-[48vw] rounded-full border border-[#c95745]/20 float-slow" />
      <div className="absolute bottom-[8%] left-[8%] h-[13vw] w-[13vw] rounded-full bg-[#e3b550]/55 blur-sm float-slower" />
      <ProductImage src="suprime-hero.jpg" className="absolute right-[8%] top-[19%] h-[42%] w-[59%] rotate-[4deg]" position="center" />
      <motion.div
        className="paper-card absolute bottom-[15%] left-[9%] z-10 w-[78%] px-[7%] py-[8%]"
        initial={{ opacity: 0, x: -22, y: 16 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.72, duration: 0.9, ease }}
      >
        <Eyebrow>Una tienda para descubrir</Eyebrow>
        <motion.h1
          className="display-font mt-[5%] text-[13vw] font-semibold leading-[.86] tracking-[-.055em] text-[#252329]"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.54, duration: 0.9, ease }}
        >
          Cosas<br /><em className="text-[#c95745]">buenas</em><br />para todos.
        </motion.h1>
        <div className="mt-[9%] flex items-center gap-3">
          <AccentRule />
          <span className="body-font text-[2.35vw] font-semibold tracking-[.04em] text-[#6c625c]">SUPRIME · RD</span>
        </div>
      </motion.div>
    </SceneFrame>
  );
}