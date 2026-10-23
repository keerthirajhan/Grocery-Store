// "Fruitique" palette: cream background, leaf green, orange accent
export const colors = {
  gradTop: '#F7F9EF',
  gradBottom: '#EEF3E0',
  card: '#FFFFFF',
  yellow: '#DCE8B4', // pale lime (chips, steppers)
  olive: '#55781F', // primary leaf green
  oliveDark: '#3E5C14',
  tab: '#FFFFFF', // floating white nav bar
  text: '#1E2A12',
  muted: '#76806A',
  grey: '#B9C3A8',
  red: '#E0453A',
  white: '#FFFFFF',
  green: '#4E9A2B',
  accent: '#F29B2C', // orange
};

export const shadow = {
  shadowColor: '#2c3d10',
  shadowOpacity: 0.13,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 5 },
  elevation: 4,
};

const TINTS = ['#EAF1D8', '#FDEFD6', '#F6E4DD', '#E6EEF5', '#F1EAF6', '#E3F1EA'];
export const tintFor = (name = '') =>
  TINTS[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % TINTS.length];
export const ratingFor = (name = '') => (4.3 + (name.length % 7) / 10).toFixed(1);
