import { AnimatePresence, motion } from "framer-motion";

type Props = {
  type?: 'fadeDown' | 'fadeUp' | 'fadeRight' | 'fadeLeft';
  speed?: 'fast' | 'normal' | 'slow';
  condition: boolean;
  children: React.ReactNode;
}

function AnimatedContainer({ type = 'fadeDown', speed = 'normal', condition, children }: Props) {

  const animateProps = {
    fadeDown: {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 }
    },
    fadeUp: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 10 }
    },
    fadeRight: {
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -10 }
    },
    fadeLeft: {
      initial: { opacity: 0, x: 10 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 10 }
    }
  }

  const duration = {
    fast: 0.1,
    normal: 0.2,
    slow: 0.3
  }

  return (
    <AnimatePresence>
      {condition && (
        <motion.div
          initial={animateProps[type].initial}
          animate={animateProps[type].animate}
          exit={animateProps[type].exit}
          transition={{ duration: duration[speed] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnimatedContainer
