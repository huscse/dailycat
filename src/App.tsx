// App.tsx
import React from 'react';

const App: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.errorText}>Error loading page</h1>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
  } as React.CSSProperties,
  errorText: {
    color: '#721c24',
    backgroundColor: '#f8d7da',
    padding: '1rem 2rem',
    border: '1px solid #f5c6cb',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
  } as React.CSSProperties,
};

export default App;
