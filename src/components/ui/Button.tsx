import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'inverted' | 'ghost-on-dark';
type Size = 'md' | 'lg';

const baseClasses =
  'inline-flex items-center justify-center gap-2 border-hard rounded-md font-medium transition-colors duration-200 ease-editorial whitespace-nowrap select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink text-paper border-ink hover:bg-teal-500 hover:border-teal-500',
  ghost: 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper',
  inverted: 'bg-paper text-ink border-paper hover:bg-teal-500 hover:border-teal-500 hover:text-paper',
  'ghost-on-dark': 'bg-transparent text-paper border-paper/40 hover:bg-paper/10 hover:border-paper',
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

const CUSTOM_KEYS = ['as', 'variant', 'size', 'children', 'className'] as const;

function omitCustomProps<T extends object>(props: T): Omit<T, (typeof CUSTOM_KEYS)[number]> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (!(CUSTOM_KEYS as readonly string[]).includes(key)) {
      result[key] = (props as Record<string, unknown>)[key];
    }
  }
  return result as Omit<T, (typeof CUSTOM_KEYS)[number]>;
}

export function Button(props: ButtonProps) {
  const variant = props.variant ?? 'primary';
  const size = props.size ?? 'md';
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], props.className);

  if (props.as === 'a') {
    return (
      <a {...omitCustomProps(props)} className={classes}>
        {props.children}
      </a>
    );
  }

  return (
    <button {...omitCustomProps(props)} className={classes}>
      {props.children}
    </button>
  );
}
