import { theme } from '../../styles/theme';

export const Heading = ({ children, level = 1, color = theme.colors.textMain }) => {
  const Tag = `h${level}`;
  const sizes = { 1: '2.5rem', 2: '1.8rem', 3: '1.3rem' };
  
  return (
    <Tag style={{ color, fontFamily: theme.fonts.heading, fontSize: sizes[level], fontWeight: 700, marginTop: 0, marginBottom: '15px' }}>
      {children}
    </Tag>
  );
};

export const Text = ({ children, muted, bold }) => (
  <p style={{ color: muted ? theme.colors.textMuted : theme.colors.textMain, fontFamily: theme.fonts.body, fontSize: '1.1rem', fontWeight: bold ? 'bold' : 'normal', letterSpacing: '0.5px' }}>
    {children}
  </p>
);