import React from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle' | 'highlight';
  hover?: boolean;
  onClick?: () => void;
  gradient?: boolean;
}

export function GlassCard({
  children,
  className = '',
  variant = 'default',
  hover = true,
  onClick,
  gradient = false
}: GlassCardProps) {
  const variantStyles = {
    default: 'bg-white/8 backdrop-blur-xl border-white/10',
    elevated: 'bg-white/12 backdrop-blur-2xl border-white/15',
    subtle: 'bg-white/5 backdrop-blur-lg border-white/5',
    highlight: 'bg-gradient-to-br from-blue-500/20 to-purple-500/10 backdrop-blur-xl border-blue-500/30'
  };

  const hoverStyles = hover
    ? 'hover:bg-white/12 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
      onClick={onClick}
      className={`
        glass-card rounded-2xl p-6 border
        ${variantStyles[variant]}
        ${hoverStyles}
        ${gradient ? 'relative overflow-hidden' : ''}
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Gradient overlay for highlight variant */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/5 pointer-events-none" />
      )}
      
      {/* Inner glow */}
      <div className="absolute inset-0 rounded-2xl shadow-inner opacity-50 pointer-events-none" 
           style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)' }} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  icon
}: GlassButtonProps) {
  const variantStyles = {
    primary: 'bg-gradient-to-br from-blue-500/80 to-cyan-500/80 hover:from-blue-500/90 hover:to-cyan-500/90 text-white border-white/20',
    secondary: 'bg-white/8 hover:bg-white/12 text-white border-white/10',
    ghost: 'bg-transparent hover:bg-white/5 text-gray-300 border-transparent',
    destructive: 'bg-gradient-to-br from-red-500/80 to-rose-500/80 hover:from-red-500/90 hover:to-rose-500/90 text-white border-white/20'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative rounded-xl border backdrop-blur-xl
        font-medium transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      style={{
        boxShadow: variant !== 'ghost' 
          ? '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
          : 'none'
      }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}

interface GlassInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  icon?: React.ReactNode;
}

export function GlassInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  icon
}: GlassInputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 ${icon ? 'pl-12' : ''}
          bg-white/5 backdrop-blur-lg
          border border-white/10
          rounded-xl
          text-white placeholder:text-gray-500
          focus:bg-white/8 focus:border-blue-500/50
          focus:outline-none focus:ring-2 focus:ring-blue-500/20
          transition-all duration-300
          ${className}
        `}
      />
    </div>
  );
}

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function GlassBadge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}: GlassBadgeProps) {
  const variantStyles = {
    default: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border backdrop-blur-lg
        font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function GlassModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: GlassModalProps) {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`
          relative w-full ${sizeStyles[size]}
          bg-gradient-to-br from-slate-900/95 to-slate-800/95
          backdrop-blur-2xl border border-white/10
          rounded-2xl shadow-2xl
          overflow-hidden
        `}
      >
        {/* Inner glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)' }}
        />

        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}