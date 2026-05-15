import { theme } from '../../styles/theme';

export default function Card({ children, variant = 'default' }) {
  const styles = {
    default: { 
      padding: '30px', backgroundColor: theme.colors.background, border: `1px solid ${theme.colors.border}`, 
      borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
    },
    success: { 
      padding: '30px', backgroundColor: theme.colors.surface, borderRadius: '12px', 
      borderLeft: `6px solid ${theme.colors.secondary}`, boxShadow: '0 8px 20px rgba(0,0,0,0.04)' 
    },
    error: { 
      padding: '20px', backgroundColor: theme.colors.dangerBg, borderRadius: '8px', 
      borderLeft: `5px solid ${theme.colors.danger}` 
    }
  };

  return <div style={styles[variant]}>{children}</div>;
}