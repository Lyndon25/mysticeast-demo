'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MysticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export default function MysticButton({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  type = 'button',
}: MysticButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full overflow-hidden';

  const variants = {
    primary: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] active:scale-95',
    secondary: 'bg-slate-800 text-cyan-400 hover:bg-slate-700 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] active:scale-95',
    outline: 'border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 active:scale-95',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedClassName = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    disabled && 'opacity-50 cursor-not-allowed hover:shadow-none active:scale-100',
    className
  );

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-300 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={combinedClassName}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={combinedClassName}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
    >
      {content}
    </motion.button>
  );
}
