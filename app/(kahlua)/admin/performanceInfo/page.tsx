'use client';

import WestIcon from '@mui/icons-material/West';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import {
  defaultData,
  defaultFreshmanTicketData,
  defaultGeneralTicketData,
  defaultImage,
  freshmanTiketInfoList,
  generalTiketInfoList,
  performanceImage,
  performanceInfoList,
} from './performanceData';

import { authInstance } from '@/api/auth/axios';
import CancelModal from '@/components/admin/CancelModal';
import EditModal from '@/components/admin/EditModal';
import InfoList from '@/components/templates/admin/Info';
import AdminButton from '@/components/ui/admin/Button';
import ImageBox from '@/components/ui/admin/ImageBox';
import TicketInfoList from '@/components/ui/admin/TicketInfo';
import Banner from '@/components/ui/Banner';

const PerformancePage = () => {
  const [data, setData] = useState<{ [key: string]: any }>(defaultData);
  const [freshmanTicketData, setfreshmanTicketData] = useState<{
    [key: string]: number;
  }>(defaultFreshmanTicketData);
  const [generalTicketData, setgeneralTicketData] = useState<{
    [key: string]: number;
  }>(defaultGeneralTicketData);
  const [image, setImage] = useState<{ [key: string]: string }>(defaultImage);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isCandelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);

  const router = useRouter();

  const onChangeData = useCallback((newValue: any, label: string) => {
    setData((prevData) => {
      const updatedData = { ...prevData, [label]: newValue };
      return updatedData;
    });
  }, []);

  const onChangeImage = useCallback((newValue: string, label: string) => {
    setImage((prevData) => {
      const updatedImage = { ...prevData, [label]: newValue };
      return updatedImage;
    });
  }, []);

  const onChangeFreshmanTicketData = useCallback(
    (newValue: number, label: string) => {
      setfreshmanTicketData((prevData) => {
        const updatedData = { ...prevData, [label]: newValue };
        return updatedData;
      });
    },
    []
  );

  const onChangeGeneralTicketData = useCallback(
    (newValue: number, label: string) => {
      setgeneralTicketData((prevData) => {
        const updatedData = { ...prevData, [label]: newValue };
        return updatedData;
      });
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
       performanceStartTime: data.performanceStartTime,
       performanceEndTime: data.performanceEndTime,
       entranceTime: data.entranceTime,
       bookingStartDate: data.bookingStartDate,
       bookingEndDate: data.bookingEndDate,
       freshmanPrice: String(freshmanTicketData.freshmanPrice),
       freshmanMaxPurchase: Number(freshmanTicketData.freshmanMaxPurchase),
       generalPrice: String(generalTicketData.generalPrice),
       generalMaxPurchase: Number(generalTicketData.generalMaxPurchase),
     };

     const res = await authInstance.post(
       '/performances/create',
       performanceData
     );

     if (res.status === 200) {
       alert('공연 정보가 성공적으로 생성되었습니다.');
       setIsEditModalOpen(false);
       router.push('/admin');
     }
   } catch (error: any) {
     console.error('공연 정보 생성 실패:', error);
     console.error('error.response?.status:', error?.response?.status);
     console.error('error.response?.data:', error?.response?.data);
     alert('공연 정보 생성에 실패했습니다.');
   }
 }, [data, image, freshmanTicketData, generalTicketData, router]);


  // 수정 취소
  const onCancelEdit = useCallback(() => {
    setData(defaultData);
    setImage(defaultImage);
    setfreshmanTicketData(defaultFreshmanTicketData);
    setgeneralTicketData(defaultGeneralTicketData);
  }, []);

  return (
    <div className="font-pretendard mx-auto w-full pad:w-[786px] dt:w-[1200px] h-auto flex flex-col gap-[40px]">
      {/* Banner */}
      <Banner>공연 정보 생성</Banner>

      {/* List */}
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

      {/* 취소, 저장 Buttons */}
      <div className="flex flex-row gap-[24px] w-full max-pad:px-[16px] justify-end">
        <AdminButton onClick={onCancelEdit}>취소하기</AdminButton>
        <AdminButton
          onClick={() => setIsEditModalOpen(true)}
          className="bg-primary-50"
        >
          생성하기
        </AdminButton>
        <EditModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          handleSubmit={onSaveEdit}
          mainContent={<p>공연 정보를 생성하시겠습니까?</p>}
          buttonContent={<p>생성하기</p>}
        />
      </div>

      {/* admin 홈으로 Button */}
      <div className="flex w-auto h-auto max-pad:mx-[16px]">
        <div
          key="admin"
          className="flex flex-row gap-[8px] items-center"
          onClick={() => setIsCancelModalOpen(true)}
        >
          <WestIcon />
          <span className="text-[16px] font-medium">Admin 홈으로</span>
        </div>
      </div>
      <CancelModal
        isOpen={isCandelModalOpen}
        setIsOpen={setIsCancelModalOpen}
      />
    </div>
  );
};

export default PerformancePage;
