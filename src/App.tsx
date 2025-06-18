import React from 'react';

const App: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.errorBox}>
        <h1 style={styles.title}>Oops! Something went wrong.</h1>
        <p style={styles.message}>
          We couldn’t load the website. Please check your connection or try again later.
        </p>
        <p style={styles.contact}>
          If the problem persists, contact the developer.
          <a style={styles.link}>
          </a>
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    fontFamily: 'Segoe UI, sans-serif',
  },
  errorBox: {
    textAlign: 'center',
    padding: '40px',
    maxWidth: '500px',
  },
  title: {
    fontSize: '24px',
    color: '#d32f2f',
    marginBottom: '10px',
  },
  message: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '20px',
  },
  contact: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '30px',
  },
  link: {
    color: '#1976d2',
    textDecoration: 'none',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default App;
