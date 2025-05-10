import { motion } from 'framer-motion';

interface LoadingProps { variant?: 'spinner' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
    }

const variants = {
  spinner: {
    animate: {
      rotate: 360
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  },
  dots: {
    animate: {
      y: ['0%', '-50%', '0%']
    },
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

const sizes = { sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
    };

export function Loading({
  variant = 'spinner',
  size = 'md',
  text,
  fullScreen = false,
}: LoadingProps) {
  const Wrapper = ({ children }: { children: React.ReactNode     }) => {
    if (fullScreen) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-4">{children}</div>
        </div>
      );
    }
    return <div className="flex flex-col items-center gap-4">{children}</div>;
  };

  return (
    <Wrapper>
      {variant === 'spinner' && (
        <motion.div
          className={`border-2 border-white/20 border-t-white rounded-full ${sizes[size]}`}
          {...variants.spinner}
        />
      )}

      {variant === 'dots' && (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`bg-white rounded-full ${sizes.sm}`}
              {...variants.dots}
              transition={{ ...variants.dots.transition,
                delay: i * 0.1,
                  }}
            />
          ))}
        </div>
      )}

      {variant === 'pulse' && (
        <div className={`bg-white/20 rounded-full animate-pulse ${sizes[size]}`} />
      )}

      {text && <p className="text-white/80 text-sm">{text}</p>}
    </Wrapper>
  );
} 