import SettingsIcon from '@mui/icons-material/Settings';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { authInstance, axiosInstance } from '@/api/auth/axios';
import { fetchLatestPerformance } from '@/api/performance/performance';
import LocationModal from '@/components/popups/ticket/LocaltionModal';
import DropdownMenu from '@/components/templates/ticket/DropdownMenu';
import TicketOption from '@/components/templates/ticket/TicketOption';
import RecommendedList from '@/components/ticket/RecommendedList';
import Bar from '@/components/ui/Bar';
import defaultPoster from '@/public/image/ticket/DefaultPoster.svg';
import { PerformanceResponse } from '@/types/performace';
import { formatDateTime } from '@/utils/dateUtils';

type TicketDetailInfo = PerformanceResponse & {
  dateForMinute: string;
  dateOption: string;
  freshmanPrice: string;
  generalPrice: string;
};

const apikey = process.env.NEXT_PUBLIC_KAKAOMAP_KEY;

declare global {
  interface Window {
    kakao: any;
  }
}

interface TicketDetailProps {
  id?: string;
}

const Skeleton = ({
  className = '',
  rounded = 'rounded-md',
}: {
  className?: string;
  rounded?: string;
}) => <div className={`animate-pulse ${rounded} bg-gray-10 ${className}`} />;

const TicketDetail = ({ id: prodId }: TicketDetailProps) => {
  const [isDays, setIsDays] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<TicketDetailInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [nowUrl, setNowUrl] = useState('');
  const latitudeRef = useRef<number | null>(null);
  const longitudeRef = useRef<number | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [loc, setLoc] = useState('');
  const [statusText, setStatusText] = useState<string>('예매 마감');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [performanceId, setPerformanceId] = useState<number | null>(null);

  const effectiveId = prodId ?? performanceId;

  const fetchTickets = async (prodId: number) => {
    try {
      const response = await axiosInstance.get(`/performances/${prodId}`);
      if (response.data.isSuccess) {
        return response.data.result.performanceResponse;
      }
    } catch (error) {
      console.error('Error fetching performances:', error);
    }
  };

  const getTicketDetail = async () => {
    try {
      setIsLoading(true);

      const response = prodId
        ? await fetchTickets(Number(prodId))
        : await fetchLatestPerformance();
      if (response) {
        const rawData = response;
        const bookingStart = dayjs(rawData.booking_start_date);
        const bookingEnd = dayjs(rawData.booking_end_date);
        const now = dayjs();
        const daysBeforeStart = Math.ceil(bookingStart.diff(now, 'hours') / 24);
        setPerformanceId(rawData.id);

        let isAvailable = false;
        let status = '예매 마감';

        if (now.isBefore(bookingStart)) {
          status = `오픈 D-${daysBeforeStart}`;
        } else if (now.isAfter(bookingStart) && now.isBefore(bookingEnd)) {
          isAvailable = true;
          status = '예매 가능';
        }

        setLoc(rawData?.address);
        setTicketInfo({
          ...rawData,
          dateForMinute: dayjs(rawData.performance_start_time).format(
            'YYYY-MM-DD HH:mm'
          ),
          dateOption: dayjs(rawData.performance_start_time).format(
            'YYYY년 MM월 DD일 HH시 mm분'
          ),
          freshmanPrice: rawData.freshman_price
            ? `${rawData.freshman_price}원`
            : '무료',
          generalPrice: rawData.general_price
            ? `${rawData.general_price}원`
            : '5,000원',
        });
        setIsDays(isAvailable);
        setStatusText(status);
      }
    } catch (error) {
      console.error('티켓 상세 정보 불러오는 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAdmin = async () => {
    try {
      const response = await authInstance.get('/user');
      if (response.data.result.role === 'ADMIN') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('관리자 여부 확인 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    setIsClient(true);
    setNowUrl(window.location.href);
    checkAdmin(); // 어드민 여부 확인
  }, []);

  useEffect(() => {
    getTicketDetail();
  }, [prodId]);

  useEffect(() => {
    if (loc) {
      loadKakaoMap(loc);
    }
  }, [loc]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const threshold = 600;
      const newOpacity = Math.max(1 - scrollPosition / threshold, 0);
      setOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDays]);

  useEffect(() => {
    if (!loc) return;

    if (!window.kakao) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apikey}&libraries=services&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            loadKakaoMap(loc);
          });
        }
      };
    } else if (window.kakao && window.kakao.maps) {
      loadKakaoMap(loc);
    }
  }, [loc]);

  const loadKakaoMap = async (address: string) => {
    if (!window.kakao?.maps?.services) return;
    if (window.kakao && window.kakao.maps) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const lat = parseFloat(result[0].y);
          const lng = parseFloat(result[0].x);

          latitudeRef.current = lat;
          longitudeRef.current = lng;
          createMap(lat, lng);
          setPlaceId(result[0].place_url);
        }
      });
    }
  };

  /* 지도 & 마커 생성 */
  const createMap = (lat: number, lng: number) => {
    const container = document.getElementById('map');
    if (!container) return;

    const options = {
      center: new window.kakao.maps.LatLng(lat, lng),
      level: 3,
    };

    const map = new window.kakao.maps.Map(container, options);

    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(lat, lng),
      map,
      draggable: true,
    });

    window.kakao.maps.event.addListener(marker, 'click', function () {
      if (placeId) {
        window.open(placeId, '_blank');
      }
    });
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(nowUrl).then(() => {
      alert('링크가 복사되었습니다!');
    });
  };

  const copyLocation = () => {
    navigator.clipboard.writeText(loc).then(() => {
      alert('주소가 복사되었습니다!');
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 834) {
        closeModal();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <>
      <div className="flex flex-col pad:flex-row pad:mt-8 pad:h-[328px] w-full pad:w-full dt:h-[376px] dt:justify-center mx-auto">
        {isLoading ? (
          <>
            <Skeleton
              rounded="mb:rounded-xl"
              className="z-[-1] sticky top-0 shrink-0 w-full h-[300px] mb:w-[300px] pad:w-[246px] pad:h-[328px] dt:w-[282px] dt:h-[376px] mx-auto pad:mx-0"
            />
            <div className="z-10 bg-gray-0 flex flex-col w-full h-[355px] mb:w-[350px] pad:w-full dt:w-[338px] px-4 pt-6 pad:pt-0 pad:mt-2 pad:ml-8 mx-auto dt:mr-0 pad:px-0">
              <Skeleton className="inline-flex h-8 w-[88px] rounded-full" />

              <div className="mt-5 pad:mt-4 gap-1 pad:gap-4 flex flex-row items-center">
                <Skeleton className="min-w-[190px] pad:w-[217px] pad:max-w-[217px] h-9" />
                <div className="flex flex-row gap-2 items-center">
                  <Skeleton
                    rounded="rounded-full"
                    className="h-5 w-5 pad:h-6 pad:w-6"
                  />
                  <Skeleton rounded="rounded-full" className="h-7 w-7" />
                </div>
              </div>

              {/* 장소 */}
              <div className="flex flex-row mt-4 pad:mt-6 text-[16px] pad:text-[18px] leading-9 font-normal gap-6 h-7 items-center">
                <Skeleton className="w-7 pad:w-8 h-6 rounded" />
                <Skeleton className="w-40 h-6 rounded" />
              </div>

              {/* 일시 */}
              <div className="flex flex-row mt-4 pad:mt-6 text-[16px] pad:text-[18px] leading-9 font-normal gap-6 h-7 items-center">
                <Skeleton className="w-7 pad:w-8 h-6 rounded" />
                <Skeleton className="w-56 h-6 rounded" />
              </div>

              {/* 가격 */}
              <div className="flex flex-row mt-4 pad:mt-6 text-[16px] pad:text-[18px] leading-9 font-normal">
                <Skeleton className="w-7 pad:w-8 h-7 rounded" />
                <div className="ml-6 flex flex-col w-full">
                  {/* 일반 티켓 라인 */}
                  <div className="flex flex-row items-start h-7 mb-9 pad:mb-12 gap-4">
                    <Skeleton className="w-[72px] pad:w-[84px] h-6 rounded" />
                    <Skeleton className="w-[72px] pad:w-[84px] h-6 rounded" />
                    <Skeleton className="w-28 h-6 rounded" />
                  </div>
                </div>
              </div>

              {/* 버튼(예매/영상) */}
              <Skeleton className="pad:hidden dt:flex mt-[21px] w-full dt:w-[316px] h-[52px] dt:h-[60px] rounded-xl" />
            </div>

            {/* === 모바일/패드 구분선 === */}
            <div className="z-20 bg-gray-0 h-[40px] w-[100vw] flex pad:hidden items-center" />
            <Skeleton className="flex z-10 flex-shrink-0 pad:hidden w-full mb:w-[328px] pad:w-full h-2 mx-auto" />
            <div className="z-20 bg-gray-0 h-[24px] w-[100vw] flex pad:hidden items-center" />

            {/* === 데스크탑 지도/주소 영역 === */}
            <div className="hidden ph:flex z-10 bg-gray-0 pad:hidden dt:flex flex-col w-[100%] px-4 mb:px-0 mb:w-[328px] pad:ml-[164px] h-[282px] pad:mt-[78px] pad:h-full mx-auto">
              {/* 지도 타이틀 */}
              <Skeleton className="h-[27px] w-24 mb-2 rounded" />

              {/* 주소 & 복사버튼 */}
              <div className="flex flex-row gap-3 mt-1 items-center">
                <Skeleton className="w-[194px] pad:w-[294px] h-6 rounded" />
                <div className="flex flex-row items-center gap-1">
                  <Skeleton className="w-5 h-5 rounded" />
                  <Skeleton className="w-12 h-5 rounded" />
                </div>
              </div>

              {/* 지도 스켈레톤 */}
              <Skeleton className="top-[11px] w-full h-[calc(100vw*192/328)] max-h-[192px] pad:max-h-[225px] mb:w-[328px] pad:w-[376px] mb:h-[192px] pad:h-[225px] rounded-xl flex-shrink-0 z-0 mt-2" />
              <div className="min-h-[164px]" />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col pad:flex-row  pad:h-[328px] w-full pad:w-full dt:h-[376px] dt:justify-center mx-auto">
              <Image
                src={ticketInfo?.poster_image_url || defaultPoster}
                alt="포스터사진"
                width={833}
                height={376}
                className="z-[-1] sticky top-0 w-full h-auto mb:w-[300px] pad:w-[246px] pad:h-[328px] dt:w-[282px] dt:h-[376px] mb:rounded-xl mx-auto pad:mx-0 transition-opacity duration-300"
                style={
                  isClient && window.innerWidth <= 500
                    ? { opacity, transition: 'opacity 0.3s ease-out' }
                    : { opacity: 1 }
                }
              />

              <div className="z-10 bg-gray-0 flex flex-col w-full h-[355px] mb:w-[350px] pad:w-full dt:w-[338px] px-4 pt-6 pad:pt-0 pad:mt-2 pad:ml-8 mx-auto dt:mr-0 pad:px-0">
                <div
                  className={`inline-flex rounded-[32px] gap-2.5 items-center justify-center py-1 px-3  text-[16px] max-w-max
          ${isDays ? 'bg-primary-50 text-gray-0' : 'bg-gray-10 text-gray-50'}`}
                >
                  {statusText}
                </div>
                <div className="mt-5 pad:mt-4 gap-1 pad:gap-4 flex flex-row items-center">
                  <p className="min-w-[190px] pad:w-[217px] pad:max-w-[217px] h-9 text-gray-90 font-semibold leading-9 text-[20px] pad:text-[24px] whitespace-nowrap">
                    {ticketInfo?.title}
                  </p>
                  <div className="flex flex-row gap-2 items-center">
                    <div
                      onClick={copyUrl}
                      className="flex flex-col justify-center"
                    >
                      <Image
                        src="/image/ticket/share.svg"
                        alt="share"
                        width={24}
                        height={24}
                        className="cursor-poFer h-5 w-5 pad:h-6 pad:w-6"
                      />
                    </div>
                    {isAdmin && (
                      <Link href={`/admin/performance/${effectiveId}`}>
                        <SettingsIcon
                          className="cursor-pointer text-gray-60"
                          sx={{ fontSize: '28px' }}
                        />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex flex-row mt-4 pad:mt-6 text-[16px] pad:text-[18px] leading-9 font-normal gap-6 h-7">
                  <p className="text-gray-40 w-7 pad:w-8">장소</p>
                  <p className="text-gray-90">{ticketInfo?.venue}</p>
                </div>
                <div className="flex flex-row mt-4 pad:mt-6 text-[16px] pad:text-[18px] leading-9 font-normal gap-6 h-7">
                  <p className="text-gray-40 w-7 pad:w-8">일시</p>
                  <p className="text-gray-90 ">
                    {formatDateTime(ticketInfo?.performance_start_time) || ''}
                  </p>
                </div>
                <div className="flex flex-row mt-4 pad:mt-6 text-[16px] pad:text-[18px] leading-9 font-normal">
                  <p className="text-gray-40 w-7 pad:w-8 h-7">가격</p>
                  <div className="ml-6 flex flex-col">
                    {/*
              <div className="flex flex-row items-start h-7">
                <p className="text-gray-90 w-[74px] pad:w-[83px] ">
                  신입생 티켓
                </p>
                <p className="text-primary-50 w-7 pad:w-8 ml-6 font-semibold">
                  {information.tickets.freshman.price}
                </p>
                <p className="text-gray-40 text-[14px] font-normal ml-2 flex justify-center w-[68px]">
                  1인 최대 {information.tickets.freshman.maxQuantity}매
                </p>
              </div>
              <div className="flex flex-row items-start h-7 mt-2 pad:mt-5">
              */}
                    <div className="flex flex-row items-start h-7 mb-9 pad:mb-12">
                      <p className="text-gray-90 w-[60px] pad:w-[67px]">
                        일반 티켓
                      </p>
                      <p className="text-primary-50 w-[58px] pad:w-[66px] ml-10 font-semibold">
                        {ticketInfo?.general_price
                          ? Number(ticketInfo.general_price).toLocaleString() +
                            '원'
                          : '무료'}
                      </p>

                      <p className="text-gray-40 text-[14px] font-normal ml-2 flex justify-center">
                        1인 최대 {ticketInfo?.general_max_purchase}매
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href={
                    isDays
                      ? '/ticket/search/'
                      : `${ticketInfo?.youtube_url ?? '#'}`
                  }
                  onClick={(e) => {
                    if (
                      !isDays &&
                      !ticketInfo?.youtube_url &&
                      !dayjs().isBefore(dayjs(ticketInfo?.performance_end_time))
                    ) {
                      e.preventDefault();
                      alert('공연 영상이 존재하지 않습니다.');
                    }
                  }}
                  className={`max-pad:mx-auto mt-[21px] w-full dt:w-[316px] h-[52px] dt:h-[60px] flex pad:hidden dt:flex flex-shrink-0 text-center items-center justify-center rounded-xl text-[18px] font-medium   ${
                    !isDays &&
                    dayjs().isBefore(dayjs(ticketInfo?.performance_start_time))
                      ? 'bg-gray-5 text-gray-60 cursor-not-allowed'
                      : 'bg-gray-5 ph:bg-primary-50 text-gray-60 ph:text-gray-0'
                  }`}
                >
                  {isDays ? '예매 조회/취소' : '공연영상 보러가기'}
                </Link>
              </div>
              <div className="z-20 bg-gray-0 h-[40px] w-[100vw] flex pad:hidden items-center" />
              <div className="flex z-10 flex-shrink-0 pad:hidden w-full mb:w-[328px] pad:w-full h-2 bg-gray-5 mx-auto" />
              <div className="z-20 bg-gray-0 h-[24px] w-[100vw] flex pad:hidden items-center" />
              <div className="hidden ph:flex z-10 bg-gray-0 pad:hidden dt:flex flex-col w-[100%] px-4 mb:px-0 mb:w-[328px] pad:ml-[164px] h-[282px] pad:mt-[78px] pad:h-full mx-auto">
                <p className="text-[16px] pad:text-[18px] font-medium left-9 text-primary-60 pad:text-primary-50 h-[27px]">
                  공연장 위치
                </p>
                <div className="flex flex-row gap-3 mt-1">
                  <p className="text-[16px] pad:text-[20px] font-medium leading-[30px] text-gray-90 text-left w-[194px] pad:w-[294px] whitespace-nowrap truncate">
                    {loc}
                  </p>
                  <div
                    onClick={copyLocation}
                    className="flex flex-row cursor-pointer items-center gap-1"
                  >
                    <Image
                      src="/image/ticket/copy.svg"
                      width={20}
                      height={20}
                      alt="copy"
                    />
                    <p className="text-gray-40 font-medium text-[16px] leading-6">
                      복사
                    </p>
                  </div>
                </div>
                <div
                  id="map"
                  className="top-[11px] w-full h-[calc(100vw*192/328)] max-h-[192px] pad:max-h-[225px] mb:w-[328px] pad:w-[376px] mb:h-[192px] pad:h-[225px] rounded-xl flex-shrink-0 z-0"
                />
                <div className="min-h-[164px]" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="w-full h-[98px]  bottom-0 z-40 left-0">
        <DropdownMenu isDays={isDays} data={ticketInfo} />

        {isLoading ? (
          <div className="hidden pad:flex dt:hidden gap-[18px] mt-4">
            <Skeleton className="w-[376px] h-[60px] rounded-xl" />
            <Skeleton className="w-[376px] h-[60px] rounded-xl" />
          </div>
        ) : (
          <div className="w-[100%] hidden pad:flex flex-row gap-[18px] mt-4 ">
            <button
              onClick={openModal}
              className="w-[376px] h-[60px] flex dt:hidden flex-shrink-0 text-center items-center justify-center text-gray-0 bg-gray-90 rounded-xl text-[18px] font-medium underline"
            >
              공연장 위치 ↗
            </button>
            <Link
              href={
                isDays ? '/ticket/search/' : `${ticketInfo?.youtube_url ?? '#'}`
              }
              onClick={(e) => {
                if (
                  !isDays &&
                  !ticketInfo?.youtube_url &&
                  !dayjs().isBefore(dayjs(ticketInfo?.performance_end_time))
                ) {
                  e.preventDefault();
                  alert('공연 영상이 존재하지 않습니다.');
                }
              }}
              className={`w-[376px] h-[60px] flex dt:hidden flex-shrink-0 text-center items-center justify-center rounded-xl text-[18px] font-medium ${
                !isDays &&
                dayjs().isBefore(dayjs(ticketInfo?.performance_start_time))
                  ? 'bg-gray-5 text-gray-60 cursor-not-allowed'
                  : ' bg-primary-50 text-gray-0'
              }`}
            >
              {isDays ? '예매 조회/취소' : '공연영상 보러가기'}
            </Link>
          </div>
        )}
        <Bar className="mt-10 hidden pad:flex w-[768px] dt:w-[1200px]" />
        {isDays ? (
          <TicketOption data={ticketInfo} isDays={isDays} />
        ) : (
          <RecommendedList id={ticketInfo?.id} isLoading={isLoading} />
        )}

        <LocationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          address={loc}
          mapLink={`https://map.kakao.com/link/search/${encodeURIComponent(loc)}`}
        />
      </div>
    </>
  );
};

export default TicketDetail;
