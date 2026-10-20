import { motion, useReducedMotion } from "framer-motion";

/**
 * Fades the page in on load.
 */
export default function PageEntrance({ children }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="min-h-screen overflow-x-hidden bg-white text-slate-900 antialiased selection:bg-indigo-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: reduceMotion ? 0.2 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
