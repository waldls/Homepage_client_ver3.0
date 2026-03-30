'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import ChevronDown from '@/public/image/album/ChevronDown.svg';
import ChevronUp from '@/public/image/album/ChevronUp.svg';

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = '선택',
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const selected = options.find((o) => o.value === value)?.label ?? placeholder;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={wrapRef} className="relative w-[130px]">
      <div
        className={clsx(
          'w-[130px] border-[1.5px] border-blue-main bg-gray-0 overflow-hidden',
          open ? 'rounded-t-lg border-b-0' : 'rounded-lg'
        )}
      >
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="flex w-full items-center justify-between px-3 py-2 font-medium text-black hover:bg-gray-1"
        >
          <span
            className={clsx(
              'text-md font-medium',
              value ? 'text-black' : 'text-gray-2'
            )}
          >
            {selected}
          </span>
          <Image
            src={open ? ChevronUp : ChevronDown}
            alt=""
            width={24}
            height={24}
            className="shrink-0"
          />
        </button>
      </div>
      {open && (
        <ul
          className={clsx(
            'absolute left-0 top-full z-50 w-[130px]',
            '-mt-[1.5px]',
            'flex flex-col',
            'border-[1.5px] border-blue-main border-t-0',
            'rounded-b-lg bg-gray-0 pb-3 pt-1'
          )}
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={clsx(
                  'w-full px-3 py-1 text-left',
                  'text-base font-medium',
                  'transition-colors',
                  'hover:bg-gray-1 hover:text-blue-main',
                  opt.value === value ? 'text-blue-main' : 'text-black'
                )}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
