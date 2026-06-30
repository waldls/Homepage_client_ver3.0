'use client';

import clsx from 'clsx';
import { CategoryType } from '@/types/album';

// type CategoryType = 'default' | 'kahlua' | 'crew';

type CategoryProps = {
  label: string;
  type?: CategoryType;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

const STYLE: Record<
  CategoryType,
  { base: string; hover: string; active: string; selected: string }
> = {
  default: {
    base: 'bg-[#EDEDED] text-black',
    hover: 'hover:bg-blue-light hover:text-gray-0',
    active: 'active:bg-blue-main active:text-gray-0',
    selected: 'bg-blue-main text-gray-0',
  },
  crew: {
    base: 'bg-red-light text-black',
    hover: 'hover:bg-red-med hover:text-black',
    active: 'active:bg-red-main active:text-gray-0',
    selected: 'bg-red-main text-gray-0',
  },
  kahlua: {
    base: 'bg-yellow-light text-black',
    hover: 'hover:bg-yellow-med hover:text-black',
    active: 'active:bg-yellow-main active:text-gray-0',
    selected: 'bg-yellow-main text-gray-0',
  },
};

const Category = ({
  label,
  type = 'default',
  selected = false,
  onClick,
  className,
}: CategoryProps) => {
  const s = STYLE[type];

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex w-[92px] text-md dt:text-lg dt:w-[123px] dt:rounded-t-[20px] font-medium whitespace-nowrap items-center justify-center px-4 py-2 rounded-t-[15px] transition-colors',
        selected ? s.selected : clsx(s.base, s.hover, s.active),
        className
      )}
    >
      {label}
    </button>
  );
};

export default Category;
