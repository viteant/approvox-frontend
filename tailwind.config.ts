import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        'azure-white': '#F0F7FF',
        'deep-navy': '#020617',
        azure: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      boxShadow: {
        'neumorphic-light': '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
        'azure-glow': '0 0 25px rgba(30, 58, 138, 0.2)',
      },
      borderRadius: {
        'container': '32px',
        'element': '0.75rem',
      },
    }
  }
}
