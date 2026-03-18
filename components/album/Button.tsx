'use client';

import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'cancel'
  | 'delete'
  | 'tertiary'
  | 'uploadkahlua'
  | 'uploadcrew';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: ButtonVariant;
  className?: string;
};

const Button = ({
  label,
  variant = 'default',
  className,
  ...props
}: ButtonProps) => {
  const baseStyle =
    'inline-flex items-center justify-center w-fit rounded-[133px] font-semibold py-[8px]';

  const variantStyle: Record<ButtonVariant, string> = {
    default: '',
    primary: clsx(
      'bg-blue-main text-gray-0',
      'hover:bg-gray-1 hover:text-blue-main',
      'active:ring-2 active:ring-blue-main',
      'px-[24px] text-md',
      // 532~833
      'min-[532px]:px-[32px] min-[532px]:title-sm min-[532px]:font-medium',
      // 834~
      'pad:px-[60px] pad:title-lg pad:font-semibold'
    ),
    secondary: clsx(
      'bg-blue-main text-gray-0',
      'hover:bg-gray-1 hover:text-blue-main',
      'active:ring-2 active:ring-blue-main',
      'px-[32px] title-sm',
      // 834~
      'pad:px-[60px] pad:title-lg'
    ),
    cancel: clsx(
      'bg-gray-1 text-blue-dark',
      'hover:bg-gray-7 hover:text-blue-dark',
      'active:ring-2 active:ring-blue-dark',
      'px-[32px] title-sm',
      // 834~
      'pad:px-[60px] pad:title-lg'
    ),
    delete: clsx(
      'bg-red-main text-gray-0',
      'hover:bg-red-light hover:text-red-main',
      'rounded-[45px]',
      'px-[24px] text-md',
      'active:ring-2 active:ring-red-main',
      // 834~
      'pad:px-[60px] pad:title-lg'
    ),
    tertiary: clsx(
      'bg-blue-main text-gray-0',
      'hover:bg-gray-1 hover:text-blue-main',
      'active:ring-2 active:ring-blue-main',
      'px-[24px] text-md',
      // 532~
      'min-[532px]:px-[32px] min-[532px]:title-sm min-[532px]:font-medium'
    ),
    uploadkahlua: clsx(
      'bg-yellow-main text-gray-0',
      'hover:bg-yellow-light hover:text-yellow-main',
      'rounded-[45px]',
      'px-[24px] text-md',
      'active:ring-2 active:ring-yellow-main',
      // 834~
      'pad:px-[32px] pad:title-sm'
    ),
    uploadcrew: clsx(
      'bg-red-main text-gray-0',
      'hover:bg-red-light hover:text-red-main',
      'rounded-[45px]',
      'px-[24px] text-md',
      'active:ring-2 active:ring-red-main',
      // 834~
      'pad:px-[32px] pad:title-sm'
    ),
  };

  return (
    <button
      className={clsx(baseStyle, variantStyle[variant], className)}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;
