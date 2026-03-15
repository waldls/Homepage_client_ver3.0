'use client';

import { ThemeProvider, createTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Image from 'next/image';
import React, { useState } from 'react';

import { authInstance } from '@/api/auth/axios';
import show_more from '@/public/image/admin/arrowUp.svg';
import department_icon from '@/public/image/admin/tabler_book-2.svg';
import phone_icon from '@/public/image/admin/tabler_device-mobile.svg';
import address_icon from '@/public/image/admin/tabler_map-pin.svg';
import tabler_x from '@/public/image/admin/tabler_x.svg';

const theme = createTheme({
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '24px',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          paddingLeft: '32px',
          paddingRight: '32px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '0px',
          position: 'absolute',
          right: '0px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: '0px',
          padding: '0px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '48px',
        },
      },
    },
  },
});

const ApplicantCard = ({
  id,
  name,
  phone_num,
  birth_date,
  gender,
  address,
  major,
  first_preference,
  second_preference,
}: {
  id: number;
  name: string;
  phone_num: string;
  birth_date: string;
  gender: string;
  address: string;
  major: string;
  first_preference: string;
  second_preference: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [
    {
      motive,
      experience_and_reason,
      play_instrument,
      readiness,
      finish_time,
      meeting_participation,
    },
    setDetail,
  ] = useState({
    motive: '',
    experience_and_reason: '',
    play_instrument: '',
    readiness: '',
    finish_time: '',
    meeting_participation: '',
  });

  const fetchEachApplicant = async () => {
    try {
      // Promise.all을 사용해 두 API를 동시에 호출합니다.
      const [detailRes, timeRes] = await Promise.all([
        authInstance.get(`/admin/apply/${id}`),
        authInstance.get(`/apply/${id}`), // 월요일 시간 정보 API
      ]);

      const detailData = detailRes.data.result;
      const timeData = timeRes.data.result;

      // 상태를 한 번에 업데이트합니다.
      setDetail({
        motive: detailData.motive,
        experience_and_reason: detailData.experience_and_reason,
        play_instrument: detailData.play_instrument,
        readiness: detailData.readiness,
        finish_time: timeData.finish_time, // 이제 데이터가 정상 매핑됩니다.
        meeting_participation: timeData.meeting, // 뒤풀이 참여 여부도 매핑
      });
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
    }
  };

  const handleClickOpen = (scrollType: DialogProps['scroll']) => async () => {
    await fetchEachApplicant();
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="w-full max-w-[384px] h-auto rounded-3xl font-pretendard flex flex-col mx-auto">
      {/* 카드 상단 부분 : 이름 및 기본 개인 정보 */}
      <div className="relative w-full h-[58px] bg-gray-80 rounded-t-3xl flex items-center pl-6 gap-1">
        <span className="text-lg pad:text-xl font-semibold text-gray-0">
          {name}
        </span>
        <span className="text-base pad:text-lg font-medium text-gray-50">
          ·
        </span>
        <span className="text-base pad:text-lg font-medium text-gray-50">
          {gender}
        </span>
        <span className="text-base pad:text-lg font-medium text-gray-50">
          ·
        </span>
        <span className="text-base pad:text-lg font-medium text-gray-50">
          {birth_date}
        </span>
        <Image
          src={show_more}
          alt="show_more_icon"
          width={24}
          height={24}
          className="absolute right-5 cursor-pointer"
          onClick={handleClickOpen('paper')}
        />
      </div>

      {/* 카드 하단 부분 : 세부 개인 정보 */}
      <div className="w-full bg-gray-5 rounded-b-3xl p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Image src={phone_icon} alt="phone_icon" width={20} height={20} />
            <span className="text-base pad:text-lg font-medium text-gray-80">
              {phone_num}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={department_icon}
              alt="department_icon"
              width={20}
              height={20}
            />
            <span className="text-base pad:text-lg font-medium text-gray-80">
              {major}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={address_icon}
              alt="address_icon"
              width={20}
              height={20}
            />
            <span className="text-base pad:text-lg font-medium text-gray-80 break-all">
              {address}
            </span>
          </div>
          <div className="flex gap-5 mt-1">
            <div className="flex gap-2">
              <span className="text-base pad:text-lg font-medium text-gray-40">
                1지망
              </span>
              <span className="text-base pad:text-lg font-medium text-gray-80">
                {first_preference}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-base pad:text-lg font-medium text-gray-40">
                2지망
              </span>
              <span className="text-base pad:text-lg font-medium text-gray-80">
                {second_preference}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 상세 정보 : dialog */}
      <ThemeProvider theme={theme}>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleClose}
          scroll={scroll}
          className="pad:mx-8"
        >
          <DialogTitle className="relative w-full h-[76px] bg-gray-80 rounded-t-3xl flex justify-between items-center">
            <div className="flex items-center gap-1 pad:gap-2">
              <span className="text-xl pad:text-2xl font-semibold text-gray-0">
                {name}
              </span>
              <span className="text-xl pad:text-2xl font-medium text-gray-50">
                ·
              </span>
              <span className="text-xl pad:text-2xl font-medium text-gray-50">
                {gender}
              </span>
              <span className="text-xl pad:text-2xl font-medium text-gray-50">
                ·
              </span>
              <span className="text-xl pad:text-2xl font-medium text-gray-50">
                {birth_date}
              </span>
            </div>
            <DialogActions className="relative">
              <Button onClick={handleClose} className="absolute right-8">
                <Image
                  src={tabler_x}
                  alt="close-dialog"
                  width={24}
                  height={24}
                />
              </Button>
            </DialogActions>
          </DialogTitle>

          <DialogContent className="p-4 pad:p-8 max-h-[80vh] overflow-y-auto">
            <section className="flex flex-col pad:flex-row pad:gap-[100px] pt-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Image
                    src={phone_icon}
                    alt="phone_icon"
                    width={20}
                    height={20}
                  />
                  <span className="text-base pad:text-lg font-medium text-gray-80">
                    {phone_num}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={department_icon}
                    alt="department_icon"
                    width={20}
                    height={20}
                  />
                  <span className="text-base pad:text-lg font-medium text-gray-80">
                    {major}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-3 pad:mt-0">
                <div className="flex items-center gap-2">
                  <Image
                    src={address_icon}
                    alt="address_icon"
                    width={20}
                    height={20}
                  />
                  <span className="text-base pad:text-lg font-medium text-gray-80">
                    {address}
                  </span>
                </div>
                <div className="flex gap-5">
                  <div className="flex gap-2">
                    <span className="text-base pad:text-lg font-medium text-gray-40">
                      1지망
                    </span>
                    <span className="text-base pad:text-lg font-medium text-gray-80">
                      {first_preference}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-base pad:text-lg font-medium text-gray-40">
                      2지망
                    </span>
                    <span className="text-base pad:text-lg font-medium text-gray-80">
                      {second_preference}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 구분선 */}
            <div className="w-full border-solid border-[1px] border-gray-10 my-6" />

            {/* 지원 동기 및 세부 내용 */}
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="text-base pad:text-lg text-gray-80 font-semibold">
                  깔루아 지원 동기
                </div>
                <div className="w-full p-4 pad:p-6 bg-gray-5 rounded-xl text-base">
                  {motive}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-base pad:text-lg text-gray-80 font-semibold">
                  지원 세션에 대한 경력 및 지원 이유
                </div>
                <div className="w-full p-4 pad:p-6 bg-gray-5 rounded-xl text-base">
                  {experience_and_reason}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-base pad:text-lg text-gray-80 font-semibold">
                  이외에 다룰 줄 아는 악기
                </div>
                <div className="w-full p-4 pad:p-6 bg-gray-5 rounded-xl text-base">
                  {play_instrument}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-base pad:text-lg text-gray-80 font-semibold">
                  포부 및 각오
                </div>
                <div className="w-full p-4 pad:p-6 bg-gray-5 rounded-xl text-base">
                  {readiness}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-base pad:text-lg text-gray-80 font-semibold">
                  면접일 가능 시간
                </div>
                <div className="w-full p-4 pad:p-6 bg-gray-5 rounded-xl text-base">
                  {finish_time}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="Text-base pad:text-lg text-gray-80 font-semibold">
                  면접 뒤풀이
                </span>
                <span className="w-full p-4 pad:p-6 bg-gray-5 rounded-xl text-base">
                  {meeting_participation === 'true' ? '참여' : '불참'}
                </span>
              </div>
            </section>
          </DialogContent>
        </Dialog>
      </ThemeProvider>
    </div>
  );
};

export default ApplicantCard;
