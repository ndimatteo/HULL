module.exports = {
  corePlugins: {
    preflight: false,
  },
  purge: {
    content: [
      './components/**/*.js',
      './lib/**/*.js',
      './modules/**/*.js',
      './pages/**/*.js',
    ],
    options: {
      safelist: [
        /^grid-cols-/,
        /^xs:grid-cols-/,
        /^sm:grid-cols-/,
        /^md:grid-cols-/,
        /^lg:grid-cols-/,
        /^xl:grid-cols-/,

        /^col-span-/,
        /^xs:col-span-/,
        /^sm:col-span-/,
        /^md:col-span-/,
        /^lg:col-span-/,
        /^xl:col-span-/,

        /^col-start-/,
        /^xs:col-start-/,
        /^sm:col-start-/,
        /^md:col-start-/,
        /^lg:col-start-/,
        /^xl:col-start-/,

        /^max-w-/,
        /^text-/,
        'mr-auto',
        'mx-auto',
        'ml-auto',
      ],
    },
  },
  darkMode: false,
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#FFFFFF',
      pageBG: 'var(--pageBG)',
      pageText: 'var(--pageText)',
    },
    fontFamily: {
      inherit: 'inherit',
      sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
      mono: ['Courier', 'monospace'],
    },
    screens: {
      xs: '480px',
      sm: '768px',
      md: '940px',
      lg: '1200px',
      xl: '1600px',
    },
    extend: {
      zIndex: {
        '-1': '-10',
        50: 50,
        60: 60,
        70: 70,
        80: 80,
        90: 90,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
