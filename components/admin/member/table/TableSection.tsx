'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import Table from './Table';

import { authInstance } from '@/api/auth/axios';
import { Member } from '@/components/admin/member/dto';
import SearchBar from '@/components/admin/member/SearchBar';

// TableSection 컴포넌트에 필요한 props 타입 정의
interface TableSectionProps {
  isWaiting: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setWaitingCount: React.Dispatch<React.SetStateAction<number>>;
  setCompletedCount: React.Dispatch<React.SetStateAction<number>>;
}

// 외부에서 사용할 수 있는 ref 타입 정의
export interface TableSectionRef {
  getChangedMembers: () => Member[];
  refreshOriginMembers: () => void;
}

// TableSection 본문
const TableSection = forwardRef<TableSectionRef, TableSectionProps>(
  (
    {
      isWaiting,
      currentPage,
      setCurrentPage,
      setWaitingCount,
      setCompletedCount,
    },
    ref
  ) => {
    // 멤버 관련 상태 관리
    const [members, setMembers] = useState<Member[]>([]);
    const [originMembers, setOriginMembers] = useState<Member[]>([]);
    const [allMembers, setAllMembers] = useState<Member[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [isSearching, setIsSearching] = useState(false);

    // 변경된 유저 id를 추적
    const [changedIds, setChangedIds] = useState<Set<number>>(new Set());

    const pageSize = 8; // 한 페이지당 보여줄 인원 수

    // 현재 페이지 데이터를 불러오는 함수
    const fetchPageMembers = async () => {
      try {
        const response = await authInstance.get('/admin/users', {
          params: {
            approvalFilter: isWaiting ? 'PENDING' : 'ALL',
            page: currentPage,
            size: pageSize,
          },
        });
        const { content, pageInfo, pendingCount, approvedCount } =
          response.data.result;

        setMembers(content);
        setOriginMembers(content);
        setTotalPages(pageInfo.totalPages);
        setWaitingCount(pendingCount);
        setCompletedCount(approvedCount);
      } catch (error) {
        console.error('멤버 데이터 불러오기 실패:', error);
      }
    };

    // 전체 멤버를 모두 불러오는 함수 (검색용)
    const fetchAllMembers = async () => {
      try {
        const response = await authInstance.get('/admin/users', {
          params: {
            approvalFilter: isWaiting ? 'PENDING' : 'ALL',
            page: 0,
            size: 9999,
          },
        });
        const { content } = response.data.result;

        setAllMembers(content);
        setOriginMembers(content);
      } catch (error) {
        console.error('전체 멤버 데이터 불러오기 실패:', error);
      }
    };

    // 드롭다운에서 유저 타입 변경 시 호출되는 함수
    const handleSelectGrade = (id: number, newGrade: string) => {
      if (isSearching) {
        setAllMembers((prev) =>
          prev.map((member) =>
            member.id === id ? { ...member, userType: newGrade } : member
          )
        );
      } else {
        setMembers((prev) =>
          prev.map((member) =>
            member.id === id ? { ...member, userType: newGrade } : member
          )
        );
      }

      const original = originMembers.find((member) => member.id === id);

      if (original) {
        setChangedIds((prev) => {
          const newSet = new Set(prev);
          if (original.userType !== newGrade) {
            newSet.add(id); // 원본과 다르면 추가
          } else {
            newSet.delete(id); // 같으면 삭제
          }
          return newSet;
        });
      }
    };

    // 검색어 입력 시 호출되는 함수
    const handleSearchChange = (value: string) => {
      setSearchQuery(value);
      setCurrentPage(0);
    };

    // 페이지 이동 시 호출되는 함수
    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
      setChangedIds(new Set()); // 페이지 이동할 때 변경사항 초기화
    };

    // 검색어, 검색 여부, 페이지 등에 따라 보여줄 멤버를 계산
    const displayedMembers = useMemo(() => {
      if (isSearching) {
        const filtered = allMembers.filter((member) =>
          (member.name ?? '').includes(searchQuery)
        );
        const start = currentPage * pageSize;
        const end = start + pageSize;
        return filtered.slice(start, end);
      }
      return members;
    }, [isSearching, searchQuery, allMembers, members, currentPage]);

    // 페이지 변경 or 탭 변경(isWaiting) 시 데이터 새로 fetch + 변경사항 초기화
    useEffect(() => {
      if (searchQuery.length === 0) {
        fetchPageMembers();
      } else {
        fetchAllMembers();
      }
      setChangedIds(new Set());
    }, [currentPage, isWaiting]);

    // 검색어 변경 시 전체 멤버 조회로 전환
    useEffect(() => {
      if (searchQuery.length > 0) {
        if (!isSearching) {
          fetchAllMembers();
          setIsSearching(true);
          setCurrentPage(0);
        }
      } else if (isSearching) {
        setIsSearching(false);
        setCurrentPage(0);
      }
    }, [searchQuery]);

    // 검색 결과가 달라질 때 총 페이지 수 업데이트
    useEffect(() => {
      if (isSearching) {
        const filtered = allMembers.filter((member) =>
          (member.name ?? '').includes(searchQuery)
        );
        setTotalPages(Math.ceil(filtered.length / pageSize));
      }
    }, [searchQuery, allMembers]);

    // 외부에서 참조할 수 있는 함수들
    useImperativeHandle(ref, () => ({
      // 변경된 멤버들만 반환
      getChangedMembers: () => {
        const baseData = isSearching ? allMembers : members;
        return baseData.filter((member) => {
          const original = originMembers.find((o) => o.id === member.id);
          return original && member.userType !== original.userType;
        });
      },
      // 현재 상태를 기준으로 원본 초기화
      refreshOriginMembers: () => {
        setOriginMembers(isSearching ? allMembers : members);
      },
    }));

    // 컴포넌트 렌더링
    return (
      <>
        {/* 검색창 */}
        <div className="flex self-end max-dt:mt-10 max-pad:mt-6">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
          />
        </div>

        {/* 테이블 */}
        <div className="w-full mt-5 max-dt:mt-[35px] max-pad:mt-4">
          <Table
            isWaiting={isWaiting}
            searchQuery={searchQuery}
            members={displayedMembers}
            setMembers={setMembers}
            currentPage={currentPage}
            totalPages={totalPages}
            handleSelectGrade={handleSelectGrade}
            changedIds={changedIds}
            onPageChange={handlePageChange}
          />
        </div>
      </>
    );
  }
);

TableSection.displayName = 'TableSection';

export default TableSection;
