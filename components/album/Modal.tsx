'use client';

import clsx from 'clsx';
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
};

const renderStyledChild = (
  child: ReactNode,
  className: string,
  fallbackTag: 'h2' | 'p'
) => {
  if (!isValidElement<{ className?: string }>(child)) {
    const Tag = fallbackTag;
    return <Tag className={className}>{child}</Tag>;
  }

  return cloneElement(child as ReactElement<{ className?: string }>, {
    className: clsx(className, child.props.className),
  });
};

const ModalBase = ({
  isOpen,
  onClose,
  children,
  className,
  closeOnOverlayClick = true,
}: ModalProps): ReactElement | null => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const originalOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const childrenArray = Children.toArray(children);
  const [mainText, subText, ...actions] = childrenArray;

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.30)] px-4 py-3"
    >
      <div
        className={clsx(
          'w-[clamp(328px,calc(220px+30vw),470px)] max-w-[calc(100vw-32px)] rounded-[30px] bg-gray-0 px-[32px] py-[12px] text-center',
          'pad:w-[470px] pad:max-w-none',
          'pad:px-[60px] pad:py-[28px]',
          'dt:h-[350px] dt:w-[560px] dt:px-[68px] dt:py-[42px]',
          className
        )}
      >
        <div className="flex h-full flex-col items-center justify-center">
          {mainText &&
            renderStyledChild(
              mainText,
              'mx-auto max-w-[8.5em] text-balance font-pretendard text-[24px] font-semibold text-black pad:max-w-[10em] pad:text-[32px] dt:max-w-[11em] dt:text-[32px]',
              'h2'
            )}
          {subText &&
            renderStyledChild(
              subText,
              'mx-auto mt-1 max-w-[15em] text-balance font-pretendard text-[16px] font-medium leading-[150%] text-black pad:max-w-[16em] pad:text-[20px] dt:max-w-[17em] dt:text-[24px]',
              'p'
            )}
          {actions.length > 0 && (
            <div
              className={clsx(
                'mt-6 flex w-full items-center justify-center gap-[clamp(16px,3vw,24px)]',
                'pad:mt-8 pad:gap-[clamp(24px,calc(2.4vw-4px),32px)]',
                'dt:mt-10 dt:gap-[clamp(32px,calc(3.4px+1.9vw),40px)]',
                'min-[1920px]:gap-10'
              )}
            >
              {actions.map((action, index) => (
                <div key={index} className="shrink-0">
                  {isValidElement<{ className?: string }>(action)
                    ? cloneElement(
                        action as ReactElement<{ className?: string }>,
                        {
                          className: clsx('shrink-0', action.props.className),
                        }
                      )
                    : action}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalBase;
