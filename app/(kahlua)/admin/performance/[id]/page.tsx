'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import {
  defaultData,
  defaultFreshmanTicketData,
  defaultGeneralTicketData,
  defaultImage,
  freshmanTiketInfoList,
  generalTiketInfoList,
  performanceImage,
  performanceInfoList,
} from '../../performanceInfo/performanceData';

import { authInstance } from '@/api/auth/axios';
import EditModal from '@/components/admin/EditModal';
import InfoList from '@/components/templates/admin/Info';
import AdminButton from '@/components/ui/admin/Button';
import ImageBox from '@/components/ui/admin/ImageBox';
import TicketInfoList from '@/components/ui/admin/TicketInfo';
import Banner from '@/components/ui/Banner';
import { toLocalInput, toUtcPayload } from '@/utils/timeZoneUtils';


const EditPerformancePage = () => {
  const params = useParams();
  const router = useRouter();

  const [data, setData] = useState<{ [key: string]: any }>(defaultData);
  const [freshmanTicketData, setFreshmanTicketData] = useState<{
    [key: string]: number;
  }>(defaultFreshmanTicketData);
  const [generalTicketData, setGeneralTicketData] = useState<{
    [key: string]: number;
  }>(defaultGeneralTicketData);
  const [image, setImage] = useState<{ [key: string]: string }>(defaultImage);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [IsDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await authInstance.get(`/performances/${params.id}`);
        if (response.data.isSuccess) {
          const p = response.data.result.performanceResponse;
          setData({
            title: p.title,
            content: p.content,
            venue: p.venue,
            address: p.address,
            youtubeUrl: p.youtube_url || '',
            performanceStartTime: toLocalInput(p.performance_start_time),
            performanceEndTime: toLocalInput(p.performance_end_time),
            entranceTime: toLocalInput(p.entrance_time),
            bookingStartDate: toLocalInput(p.booking_start_date),
            bookingEndDate: toLocalInput(p.booking_end_date),
          });
          setImage({
            posterImageUrl: p.poster_image_url,
          });
          setFreshmanTicketData({
            freshmanPrice: Number(p.freshman_price),
            freshmanMaxPurchase: p.freshman_max_purchase,
          });
          setGeneralTicketData({
            generalPrice: Number(p.general_price),
            generalMaxPurchase: p.general_max_purchase,
          });
        }
      } catch (error) {
        console.error('공연 정보 불러오기 실패:', error);
        alert('공연 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchPerformance();
  }, [params.id]);

  const onChangeData = useCallback((newValue: any, label: string) => {
    setData((prev) => ({ ...prev, [label]: newValue }));
  }, []);

  const onChangeImage = useCallback((newValue: string, label: string) => {
    setImage((prev) => ({ ...prev, [label]: newValue }));
  }, []);

  const onChangeFreshmanTicketData = useCallback(
    (newValue: number, label: string) => {
      setFreshmanTicketData((prev) => ({ ...prev, [label]: newValue }));
    },
    []
  );

  const onChangeGeneralTicketData = useCallback(
    (newValue: number, label: string) => {
      setGeneralTicketData((prev) => ({ ...prev, [label]: newValue }));
    },
    []
  );

  const onSaveEdit = useCallback(async () => {
    try {
      const performanceData = {
        posterImageUrl: image.posterImageUrl,
        youtubeUrl: data.youtubeUrl,
        title: data.title,
        content: data.content,
        venue: data.venue,
        address: data.address,
        performanceStartTime: toUtcPayload(data.performanceStartTime),
        performanceEndTime: toUtcPayload(data.performanceEndTime),
        entranceTime: toUtcPayload(data.entranceTime),
        bookingStartDate: toUtcPayload(data.bookingStartDate),
        bookingEndDate: toUtcPayload(data.bookingEndDate),
        freshmanPrice: String(freshmanTicketData.freshmanPrice),
        freshmanMaxPurchase: freshmanTicketData.freshmanMaxPurchase,
        generalPrice: String(generalTicketData.generalPrice),
        generalMaxPurchase: generalTicketData.generalMaxPurchase,
      };

      const response = await authInstance.put(
        `/admin/tickets/${params.id}`,
        performanceData
      );

      if (response.status === 200) {
        alert('공연 정보가 성공적으로 수정되었습니다.');
        setIsEditModalOpen(false);
        router.push(`/ticket/${params.id}`);
      }
    } catch (error: any) {
      console.error('공연 정보 수정 실패:', error?.response?.data ?? error);
      alert('공연 정보 수정에 실패했습니다.');
    }
  }, [data, image, freshmanTicketData, generalTicketData, params.id, router]);

  const onDeletePerformance = useCallback(async () => {
    try {
      const response = await authInstance.delete(`/performances/${params.id}`);
      if (response.status === 200) {
        alert('공연 정보가 성공적으로 삭제되었습니다.');
        router.push('/performance');
      }
    } catch (error: any) {
      console.error('공연 정보 삭제 실패:', error?.response?.data ?? error);
      alert('공연 정보 삭제에 실패했습니다.');
    }
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <p className="text-gray-500 text-lg font-medium">로딩중...</p>
      </div>
    );
  }

  return (
    <div className="font-pretendard mx-auto w-full pad:w-[786px] dt:w-[1200px] h-auto flex flex-col gap-[40px]">
      <Banner>공연 정보 수정</Banner>
      <div className="flex flex-col pad:flex-row w-full max-pad:px-[16px] gap-[40px] justify-center items-center pad:items-start">
        <ImageBox
          data={image}
          field={performanceImage}
          onChange={onChangeImage}
        />
        <div className="flex flex-col w-full gap-[16px]">
          <InfoList
            data={data}
            fieldList={performanceInfoList}
            onChange={onChangeData}
          />
          <TicketInfoList
            data={freshmanTicketData}
            fieldList={freshmanTiketInfoList}
            onChange={onChangeFreshmanTicketData}
          >
            신입생
          </TicketInfoList>
          <TicketInfoList
            data={generalTicketData}
            fieldList={generalTiketInfoList}
            onChange={onChangeGeneralTicketData}
          >
            일반
          </TicketInfoList>
        </div>
      </div>
      <div className="flex flex-row gap-[24px] w-full max-pad:px-[16px] justify-end">
        {/* <AdminButton onClick={onCancelEdit}>취소하기</AdminButton> */}
        <AdminButton
          onClick={() => setIsDeleteModalOpen(true)}
          className="bg-danger-30"
        >
          삭제하기
        </AdminButton>
        <AdminButton
          onClick={() => setIsEditModalOpen(true)}
          className="bg-primary-50"
        >
          수정하기
        </AdminButton>
        <EditModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          handleSubmit={onSaveEdit}
        />
        <EditModal
          isOpen={IsDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          handleSubmit={onDeletePerformance}
          mainContent={<p>공연 정보를 삭제하시겠습니까?</p>}
          buttonContent={<p>삭제하기</p>}
        />
      </div>
    </div>
  );
};

export default EditPerformancePage;
