import "@/styles/globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

// Set axios base URL
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
}
