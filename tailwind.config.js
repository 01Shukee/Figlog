/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base':     '#120609',
        'bg-surface':  '#1c0c11',
        'bg-card':     '#241218',
        'bg-elevated': '#2e1820',
        'border-subtle': '#3d1f28',
        'border-dim':    '#4a2530',
        'text-primary':  '#f5e8ec',
        'text-secondary':'#c4909f',
        'text-muted':    '#7a5060',
        'text-dim':      '#4a2f38',
        'pink':          '#ff2d78',
        'pink-dim':      '#cc1f5e',
        'pink-glow':     '#ff2d7833',
        'pink-soft':     '#ff6b9d',
        'purple':        '#8b5cf6',
        'purple-dim':    '#6d3fd4',
        'heat-0':  '#1c0c11',
        'heat-1':  '#5c1a35',
        'heat-2':  '#991a4a',
        'heat-3':  '#cc1f5e',
        'heat-4':  '#ff2d78',
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
        body:    ['Barlow', 'sans-serif'],
      },
      fontSize: {
        // Page hero headings (Commit Changes, ARCHIVE, Contribution.)
        'page-hero': ['48px', { lineHeight: '1.05', fontWeight: '800' }],
        // Stat numbers (42 DAYS, 2h 14m, 2,481)
        'stat-xl':   ['72px', { lineHeight: '1',    fontWeight: '900' }],
        'stat-lg':   ['52px', { lineHeight: '1',    fontWeight: '900' }],
        'stat-md':   ['36px', { lineHeight: '1',    fontWeight: '800' }],
        // Section headings within cards
        'card-head': ['24px', { lineHeight: '1.2',  fontWeight: '700' }],
        // Labels (COMMIT MESSAGE, SESSION HISTORY etc.)
        'label':     ['10px', { lineHeight: '1',    fontWeight: '500', letterSpacing: '0.15em' }],
        // Body copy
        'body-sm':   ['13px', { lineHeight: '1.5',  fontWeight: '400' }],
        'body-xs':   ['11px', { lineHeight: '1.4',  fontWeight: '400' }],
        // Session row items
        'row-val':   ['22px', { lineHeight: '1',    fontWeight: '800' }],
      },
      letterSpacing: {
        'label': '0.15em',
        'wide':  '0.08em',
      },
    },
  },
  plugins: [],
}
