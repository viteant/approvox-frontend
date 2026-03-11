export default defineAppConfig({
  ui: {
    colors: {
      primary: 'azure',
      neutral: 'slate'
    },
    button: {
      defaultProps: {
        size: 'md',
        variant: 'solid'
      },
      slots: {
        root: 'rounded-element font-semibold shadow-sm transition-all duration-200 active:scale-[0.98]'
      }
    },
    card: {
      slots: {
        root: 'rounded-container bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl border border-white/40 dark:border-blue-900/30 shadow-neumorphic-light dark:shadow-azure-glow dark:ring-1 dark:ring-white/10 overflow-hidden',
        body: 'p-6'
      }
    },
    input: {
      slots: {
        root: 'rounded-element',
        base: 'rounded-element w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-none ring-1 ring-slate-200 dark:ring-slate-700/50 focus:ring-2 focus:ring-primary-500 transition-all h-12'
      }
    },
    formField: {
      slots: {
        root: 'w-full',
        wrapper: 'w-full',
        container: 'w-full'
      }
    }
  }
})
