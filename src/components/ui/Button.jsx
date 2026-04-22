import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-red-500 hover:bg-red-600 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  outline: 'border border-red-500 text-red-500 hover:bg-red-50',
  ghost: 'hover:bg-gray-100 text-gray-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};
const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = forwardRef(({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn('inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed', variants[variant], sizes[size], className)}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
    {children}
  </button>
));
Button.displayName = 'Button';
export default Button;
