import { theme } from '../../styles/theme';

export default function Button({ children, onClick, isLoading, ...props }) {
  return (
    <button 
      onClick={onClick} 
      disabled={isLoading}
      style={{ 
        padding: '14px 28px', 
        backgroundColor: isLoading ? '#bdc3c7' : theme.colors.primary, 
        color: 'white', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: isLoading ? 'not-allowed' : 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        fontFamily: theme.fonts.body, 
        letterSpacing: '1px',
        width: '100%',
        maxWidth: '300px',
        boxShadow: isLoading ? 'none' : '0 4px 6px rgba(44, 62, 80, 0.2)',
        transition: 'all 0.3s ease'
      }}
      {...props}
    >
      {isLoading ? "YAPAY ZEKA DÜŞÜNÜYOR 🧠..." : children}
    </button>
  );
}