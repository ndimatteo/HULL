module.exports = {
  corePlugins: {
    preflight: false,
  },
  purge: [
    './components/**/*.js',
    './lib/**/*.js',
    './modules/**/*.js',
    './pages/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
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
      serif: ['GandurNew Light', 'serif'],
      sans: ['Satan', 'sans-serif'],
      mono: ['Courier', 'monospace'],
    },
    screens: {
      xs: '480px',
      sm: '768px',
      md: '940px',
      lg: '1200px',
      xl: '1600px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
