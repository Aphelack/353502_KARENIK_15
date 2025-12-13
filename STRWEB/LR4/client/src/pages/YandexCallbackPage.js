import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function YandexCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (processedRef.current) return;
    processedRef.current = true;

    const code = searchParams.get('code');
    
    if (code) {
      console.log('YandexCallbackPage: Sending code to parent window');
      
      // Send code back to parent window (for popup flow)
      if (window.opener) {
        window.opener.postMessage({
          type: 'yandex-oauth',
          code: code
        }, window.location.origin);
        window.close();
      } else {
        // If not in popup, redirect to login with code
        window.postMessage({
          type: 'yandex-oauth',
          code: code
        }, window.location.origin);
        
        // Fallback: navigate to home
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } else {
      // No code received, redirect to login
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div className="spinner" style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #d32f2f',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p>Authenticating with Yandex...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default YandexCallbackPage;
