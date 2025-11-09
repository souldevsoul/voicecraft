import { createTheme, MantineColorsTuple } from '@mantine/core';

// VoiceCraft Brand Colors - Brutalist Black/White/Yellow
const primaryYellow: MantineColorsTuple = [
  '#fef9c3',
  '#fef08a',
  '#fde047',
  '#facc15',
  '#eab308', // Main brand color
  '#ca8a04',
  '#a16207',
  '#854d0e',
  '#713f12',
  '#422006',
];

const secondaryBlack: MantineColorsTuple = [
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#475569',
  '#334155',
  '#1e293b',
  '#0f172a',
];

export const mantineTheme = createTheme({
  /** Primary color - Yellow */
  primaryColor: 'yellow',

  /** Colors */
  colors: {
    yellow: primaryYellow,
    dark: secondaryBlack,
  },

  /** Font family */
  fontFamily: 'var(--font-inter), system-ui, sans-serif',
  fontFamilyMonospace: 'Fira Code, monospace',
  headings: {
    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '3.5rem', lineHeight: '1.1' },
      h2: { fontSize: '2.75rem', lineHeight: '1.2' },
      h3: { fontSize: '2rem', lineHeight: '1.3' },
      h4: { fontSize: '1.5rem', lineHeight: '1.4' },
      h5: { fontSize: '1.25rem', lineHeight: '1.5' },
      h6: { fontSize: '1rem', lineHeight: '1.5' },
    },
  },

  /** Spacing (8pt grid) */
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },

  /** Border radius */
  radius: {
    xs: '0.375rem',  // 6px
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
  },

  /** Shadows - Brutalist */
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.12)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
  },

  /** Component defaults */
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
      },
    },
    Input: {
      defaultProps: {
        radius: 'md',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
      },
    },
  },

  /** Other settings */
  cursorType: 'pointer',
  focusRing: 'auto',
  activeClassName: 'mantine-active',
  defaultGradient: {
    from: 'yellow',
    to: 'yellow.6',
    deg: 135,
  },
});
