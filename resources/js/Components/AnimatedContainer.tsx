import { AnimatePresence, motion } from "framer-motion";

type Props = {
  type?: 'fade' | 'fadeDown' | 'fadeUp' | 'fadeRight' | 'fadeLeft' | 'slideRight' | 'slideLeft' | 'expandHorizontal' | 'expandVertical';
  speed?: 'fast' | 'normal' | 'slow' | 'slower' | 'slowest';
  onlyInitial?: boolean;
  condition: boolean;
  className?: string;
  children: React.ReactNode;
}

function AnimatedContainer({ type = 'fadeDown', speed = 'normal', onlyInitial = false, condition, className, children }: Props) {

  const animateProps = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
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
    },
    slideRight: {
      initial: { x: -40, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 40, opacity: 0 }
    },
    slideLeft: {
      initial: { x: 40, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -40, opacity: 0 }
    },
    expandHorizontal: {
      initial: { width: 0, opacity: 0 },
      animate: { width: 'auto', opacity: 1 },
      exit: { width: 0, opacity: 0 }
    },
    expandVertical: {
      initial: { height: 0, opacity: 0 },
      animate: { height: 'auto', opacity: 1 },
      exit: { height: 0, opacity: 0 }
    }
  }

  const duration = {
    fast: 0.1,
    normal: 0.2,
    slow: 0.3,
    slower: 0.4,
    slowest: 0.5
  }

  return (
    <AnimatePresence>
      {condition && (
        <motion.div
          key='animated-container'
          initial={animateProps[type].initial}
          animate={animateProps[type].animate}
          exit={onlyInitial ? undefined : animateProps[type].exit}
          transition={{ duration: duration[speed] }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnimatedContainer
