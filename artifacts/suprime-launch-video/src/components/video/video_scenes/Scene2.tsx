import { motion } from 'framer-motion';
import { SceneFrame, Eyebrow, AccentRule, ProductImage, ease } from './shared';

const categories = ['Mujer', 'Hombre', 'Niños', 'Hogar', 'Cuidado', 'Accesorios'];

export function Scene2() {
  return (
    <SceneFrame background="scene-coral">
      <motion.div className="absolute -right-[14%] top-[13%] h-[50vw] w-[50vw] rounded-full border border-[#f7f1e8]/25" animate={{ rotate: [0, 8, 0], scale: [1, 1.04, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <ProductImage src="suprime-accessories.jpg" className="absolute -right-[9%] top-[23%] h-[34%] w-[58%] rotate-[7deg]" position="center" />
      <motion.div
        className="absolute left-[9%] top-[18%] z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.8, ease }}
      >
        <Eyebrow light>Para cada quien</Eyebrow>
        <h2 className="display-font mt-[5%] max-w-[72vw] text-[14vw] font-semibold leading-[.86] tracking-[-.05em] text-[#f7f1e8]">Un mundo<br /><em className="text-[#f6cf78]">cerca</em> de ti.</h2>
      </motion.div>
      <div className="absolute bottom-[14%] left-[9%] right-[9%] grid grid-cols-2 gap-x-[8%] gap-y-[5%] border-t border-[#f7f1e8]/35 pt-[7%]">
        {categories.map((category, index) => (
          <motion.div
            key={category}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 + index * 0.09, duration: 0.42, ease }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#f6cf78]" />
            <span className="body-font text-[3.5vw] font-semibold text-[#f7f1e8]">{category}</span>
          </motion.div>
        ))}
      </div>
      <div className="absolute bottom-[8%] right-[9%]"><AccentRule light /></div>
    </SceneFrame>
  );
}