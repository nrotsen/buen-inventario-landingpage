import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'inverted' | 'ghost-on-dark';
type Size = 'md' | 'lg';

const baseClasses =
  'inline-flex items-center justify-center gap-2 border-hard rounded-md font-medium transition-colors duration-200 ease-editorial whitespace-nowrap select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-50 disabled:pointer-events-none';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-ink text-paper border-ink hover:bg-teal-500 hover:border-teal-500',
  ghost:
    'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper',
  inverted:
    'bg-paper text-ink border-paper hover:bg-teal-500 hover:border-teal-500 hover:text-paper',
  'ghost-on-dark':
    'bg-transparent text-paper border-paper/40 hover:bg-paper/10 hover:border-paper',
};

const sizeClasses: Record<Size, string> = {
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-[52px] px-7 text-[15px]',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps & {
  as?: 'button';
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;

type ButtonAsAnchor = CommonProps & {
  as: 'a';
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | 'href'>;

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children } = props;
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (props.as === 'a') {
    const { as: _as, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    return (
      <a {...rest} className={classes}>
        {children}
      </a>
    );
  }

  const { as: _as, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
}
