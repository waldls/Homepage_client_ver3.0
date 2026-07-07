import { useState, CSSProperties } from 'react';

type IconType = 'delete' | 'download' | 'close' | 'photo_plus';

interface IconData {
  default: string;
  hover?: string;
  size: {
    dt: number;
    pad: number;
    mb: number;
  };
}

interface IconStyle extends CSSProperties {
  '--w-dt'?: string;
  '--h-dt'?: string;
  '--w-pad'?: string;
  '--h-pad'?: string;
  '--w-mb'?: string;
  '--h-mb'?: string;
}

const ICONS_MAP: Record<IconType, IconData> = {
  delete: {
    default: '/image/album/icons/delete.svg',
    size: { dt: 35, pad: 25, mb: 20 },
  },
  download: {
    default: '/image/album/icons/download.svg',
    size: { dt: 36, pad: 25, mb: 22 },
  },
  close: {
    default: '/image/album/icons/close_default.svg',
    hover: '/image/album/icons/close_hover.svg',
    size: { dt: 45, pad: 35, mb: 20 },
  },
  photo_plus: {
    default: '/image/album/icons/photo-plus.svg',
    size: { dt: 123, pad: 80, mb: 80 },
  },
};

const Icons = ({ type, onClick }: { type: IconType; onClick?: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const iconData = ICONS_MAP[type];

  const currentSrc =
    isHovered && 'hover' in iconData ? iconData.hover : iconData.default;

  // 인라인 스타일로 수치만 전달 (반응형 로직은 클래스에 위임)
  const iconStyle: IconStyle = {
    '--w-mb': `${iconData.size.mb}px`,
    '--w-pad': `${iconData.size.pad}px`,
    '--w-dt': `${iconData.size.dt}px`,
  };

  return (
    <img
      src={currentSrc}
      alt={type}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={iconStyle}
      className="
        w-[var(--w-mb)] h-[var(--w-mb)]
        pad:w-[var(--w-pad)] pad:h-[var(--w-pad)]
        dt:w-[var(--w-dt)] dt:h-[var(--w-dt)]
        cursor-pointer object-contain transition-all
      "
    />
  );
};

export default Icons;
