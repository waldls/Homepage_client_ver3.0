import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      black: '#000000',
      primary: {
        0: '#DDE2FD',
        10: '#BCC6FB',
        20: '#9AA9F9',
        30: '#798DF7',
        40: '#5770F4',
        50: '#3352F2',
        60: '#193BE5',
        70: '#1632C5',
        80: '#1A2F9E',
        90: '#15267F',
      },
      gray: {
        0: '#FFFFFF',
        5: '#F6F7F8',
        7: '#ECECF0',
        10: '#E8E9ED',
        15: '#DADBE2',
        20: '#CBCDD7',
        30: '#AEB1C1',
        40: '#9296AB',
        50: '#757A95',
        60: '#5D6279',
        70: '#474A5C',
        80: '#31333F',
        90: '#1B1C23',
        1: '#F8F9FA',
        2: '#B0B0B0',
        3: '#757A95',
      },
      danger: {
        0: '#FCE3E3',
        10: '#F8BEBE',
        20: '#F59999',
        30: '#F17474',
        40: '#ED5050',
        50: '#DD3636',
      },
      warning: {
        0: '#FEF0CD',
        10: '#FDE19B',
        20: '#FBD36A',
        30: '#FAC438',
        40: '#F9B506',
        50: '#C79105',
      },
      success: {
        0: '#BDF4E4',
        10: '#91EDD2',
        20: '#65E6BF',
        30: '#3ADFAD',
        40: '#20C594',
        50: '#199A73',
      },
      blue: {
        main: '#0055FF',
        reg: '#3377FF',
        light: '#99BBFF',
        dark: '#212529',
      },
      yellow: {
        main: '#F9B506',
        med: '#FEEA97',
        light: '#FFF7E6',
        dark: '#F6DEAB',
        grad: '',
      },
      red: {
        main: '#ED5050',
        med: '#FECDD3',
        light: '#FFF2F5',
        grad: '',
      },
    },

    screens: {
      ph: '360px',
      mb: '500px',
      pad: '834px',
      dt: '1500px',
    },

    backgroundSize: ({ theme }) => ({
      auto: 'auto',
      cover: 'cover',
      contain: 'contain',
      ...theme('spacing'),
    }),

    extend: {
      fontFamily: {
        pretendard: ['pretendard'],
        mustica: ['mustica pro'],
      },

      backgroundImage: {
        performance:
          "linear-gradient(to bottom, rgba(21, 38, 127, 0.2), rgba(27, 28, 35, 1)), url('/image/recruit/bg.avif')",
        notice:
          'radial-gradient(45% 40% at 50% 50%, rgba(21, 38, 127, 0.50) 0%, rgba(27, 28, 35, 0.00) 100%)',
        mainAbout:
          "linear-gradient(to right bottom, rgba(27, 28, 35, 1), rgba(0, 0, 0, 0)), url('/image/main/MainAbout.avif')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'ticket-complete':
          "linear-gradient(rgba(27, 28, 35, 0.60), rgba(27, 28, 35, 0.60)), url('/image/ticket/Poster_202503.avif')",
        'blue-grad':
          'radial-gradient(81.86% 81.86% at 50% 50%, #152C5A 0%, #0055FE 100%)',
        'yellow-grad': 'linear-gradient(180deg, #F9B506 0%, #FFF7E6 100%)',
        'red-grad':
          'linear-gradient(180deg, #ED5050 0%, rgba(255, 242, 245, 0.92) 100%)',
      },

      keyframes: {
        'slide-right-dt1': {
          from: { transform: 'translateX(-2856px)' },
          to: { transform: 'translateX(0px)' },
        },
        'slide-left-dt2': {
          from: { transform: 'translateX(-192px)' },
          to: { transform: 'translateX(-3048px)' },
        },
        'slide-right-phone1': {
          from: { transform: 'translateX(-2086px)' },
          to: { transform: 'translateX(0px)' },
        },
        'slide-left-phone2': {
          from: { transform: 'translateX(-141px)' },
          to: { transform: 'translateX(-2227px)' },
        },
      },
      animation: {
        'slide-right-dt1': 'slide-right-dt1 40s infinite linear',
        'slide-left-dt2': 'slide-left-dt2 40s infinite linear',
        'slide-right-ph1': 'slide-right-phone1 40s infinite linear',
        'slide-left-ph2': 'slide-left-phone2 40s infinite linear',
      },
    },
  },
  corePlugins: {
    preflight: true,
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
export default config;
