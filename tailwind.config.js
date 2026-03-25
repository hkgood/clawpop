/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          start: '#1A1A1A',  // 极简黑
          end: '#333333',    // 深灰
        },
        bg: {
          primary: '#FAFAFA',  // 纯白 (light)
          secondary: '#FFFFFF', // 白
          dark: '#F5F5F5',     // 浅灰
          // 暗色主题
          'dark-primary': '#0A0A0A',
          'dark-secondary': '#141414',
          'dark-dark': '#000000',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#666666',
          // 暗色主题
          'dark-primary': '#FAFAFA',
          'dark-secondary': '#A0A0A0',
        },
        status: {
          success: 'var(--success-color, #000000)',  // 极简黑
          warning: 'var(--warning-color, #666666)',   // 灰色
          error: 'var(--error-color, #1A1A1A)',    // 极简黑
        }
      },
      fontFamily: {
        sans: ['SF Pro Display', 'SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',  // 极简快速过渡
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
