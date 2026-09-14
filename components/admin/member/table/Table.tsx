'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import TableHeader from './TableHeader';
import TableRow from './TableRow';

// Table 컴포넌트 props 타입 정의
const Table = ({
  isWaiting,
  searchQuery,
  members,
  handleSelectGrade,
  changedIds,
  currentPage,
  totalPages,
  onPageChange,
}: {
  isWaiting: boolean;
  searchQuery: string;
  members: any[];
  handleSelectGrade: (id: number, newGrade: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  setMembers: React.Dispatch<React.SetStateAction<any[]>>;
  changedIds: Set<number>;
}) => {
  // 드롭다운 열린 인덱스 상태
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // 드롭다운 위치 저장
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // 드롭다운 DOM 참조
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 검색어 및 대기/완료 여부에 따라 필터링된 멤버 목록
  const filteredMembers = useMemo(
    () =>
      members.filter((member) => {
        if (searchQuery) {
          return member.name.includes(searchQuery);
        }
        return isWaiting ? member.approvalStatus === 'PENDING' : true;
      }),
    [members, searchQuery, isWaiting]
  );

  // 드롭다운 토글 핸들러
  const toggleDropdown = (
    index: number,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (openIndex === index) {
      setOpenIndex(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + rect.width / 2 + window.scrollX,
    });
    setOpenIndex(index);
  };

  // 드롭다운 외부 클릭 감지 핸들러
  const handleClickOutside = (event: MouseEvent) => {
    if (openIndex !== null) {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !(target as HTMLElement).closest('.dropdown-trigger')
      ) {
        setOpenIndex(null);
      }
    }
  };

  // 드롭다운 위치 업데이트 함수 (리사이즈 대응)
  const updateDropdownPosition = (index: number) => {
    const trigger = document.querySelectorAll('.dropdown-trigger')[
      index
    ] as HTMLElement;
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }
  };

  // 드롭다운 열릴 때 외부 클릭 이벤트 등록
  useEffect(() => {
    if (openIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openIndex]);

  // 창 크기 변경 시 드롭다운 위치 업데이트
  useEffect(() => {
    const handleResize = () => {
      if (openIndex !== null) {
        updateDropdownPosition(openIndex);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [openIndex]);

  // 렌더링
  return (
    <div className="w-full flex flex-col items-center">
      {/* 테이블 헤더 */}
      <div className="w-full h-[595px] max-pad:h-[378px]">
        <TableHeader />

        {/* 테이블 바디 */}
        <div className="rounded-b-[20px] border-t-0 border-2 border-[#808080] overflow-hidden relative h-[526px] max-pad:h-[336px]">
          <div className="overflow-hidden h-full w-full">
            {filteredMembers.map((member, index) => (
              <TableRow
                key={index}
                member={member}
                index={index}
                openIndex={openIndex}
                setOpenIndex={setOpenIndex}
                dropdownRef={dropdownRef}
                dropdownPosition={dropdownPosition}
                toggleDropdown={toggleDropdown}
                handleSelectGrade={handleSelectGrade}
                changedIds={changedIds}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center w-[150px] gap-4 mt-8 font-semibold text-2xl max-dt:text-[20px] max-pad:text-sm">
        {totalPages > 0 ? (
          <>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              className={`cursor-pointer ${currentPage === 0 ? 'invisible' : ''}`}
            >
              {'<'}
            </button>
            <div className="flex items-center">
              {currentPage + 1} / {totalPages}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              className={`cursor-pointer ${currentPage + 1 >= totalPages ? 'invisible' : ''}`}
            >
              {'>'}
            </button>
          </>
        ) : (
          <div className="w-[150px] h-[32px]" />
        )}
      </div>
    </div>
  );
};

export default Table;
