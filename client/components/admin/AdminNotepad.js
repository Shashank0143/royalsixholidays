import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Palette, 
  Save, 
  Trash2, 
  Clock, 
  LogOut,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const AdminNotepad = ({ onBack }) => {
  const router = useRouter();
  const { logout } = useAuth();
  
  // Notepad state
  const [noteContent, setNoteContent] = useState('');
  const [noteColor, setNoteColor] = useState('bg-yellow-100');
  const [lastSaved, setLastSaved] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Available colors for the notepad
  const colorOptions = [
    { name: 'Yellow', class: 'bg-yellow-100', border: 'border-yellow-300' },
    { name: 'Pink', class: 'bg-pink-100', border: 'border-pink-300' },
    { name: 'Blue', class: 'bg-blue-100', border: 'border-blue-300' },
    { name: 'Green', class: 'bg-green-100', border: 'border-green-300' },
    { name: 'Purple', class: 'bg-purple-100', border: 'border-purple-300' },
    { name: 'Orange', class: 'bg-orange-100', border: 'border-orange-300' },
    { name: 'Gray', class: 'bg-gray-100', border: 'border-gray-300' },
    { name: 'Indigo', class: 'bg-indigo-100', border: 'border-indigo-300' }
  ];

  // Load saved note from database on component mount
  useEffect(() => {
    const loadNote = async () => {
      try {
        const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
        if (!token) return;

        const response = await fetch('/api/admin/note', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNoteContent(data.content || '');
          setNoteColor(data.color || 'bg-yellow-100');
          if (data.createdAt) {
            setLastSaved(new Date(data.createdAt));
          }
          if (data.expiresAt) {
            setExpiryTime(new Date(data.expiresAt));
          }
        } else if (response.status === 401) {
          // Clear invalid token and redirect to login
          localStorage.removeItem('token');
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          window.location.href = '/auth/login?message=Session expired, please login again';
        }
      } catch (error) {
        console.error('Error loading note:', error);
        // If it's a network error with invalid token, clear storage
        if (error.message.includes('token') || error.message.includes('401')) {
          localStorage.removeItem('token');
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
      }
    };

    loadNote();
  }, []);

  // Update time remaining every second
  useEffect(() => {
    const updateTimer = async () => {
      if (expiryTime) {
        const now = new Date().getTime();
        const expiry = expiryTime.getTime();
        const diff = expiry - now;
        
        if (diff <= 0) {
          // Time expired
          await clearNoteData();
          setTimeRemaining('Expired');
        } else {
          // Calculate remaining time
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call
    
    return () => clearInterval(timer);
  }, [expiryTime]);

  const clearNoteData = async () => {
    try {
      const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
      if (!token) return;

      const response = await fetch('/api/admin/note', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNoteContent('');
        setNoteColor('bg-yellow-100');
        setLastSaved(null);
        setExpiryTime(null);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        alert('Session expired. Please login again.');
        window.location.href = '/auth/login?message=Session expired, please login again';
      }
    } catch (error) {
      console.error('Error clearing note:', error);
      if (error.message && (error.message.includes('401') || error.message.includes('token'))) {
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        alert('Session expired. Please login again.');
        window.location.href = '/auth/login?message=Session expired, please login again';
      }
    }
  };

  const saveNote = async () => {
    try {
      // const token = localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
      // if (!token) {
      //   alert('Authentication required. Please login again.');
      //   return;
      // }

      const response = await fetch('/api/admin/note', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: noteContent,
          color: noteColor
        })
      });

      if (response.ok) {
        const data = await response.json();
        setLastSaved(new Date(data.createdAt));
        setExpiryTime(new Date(data.expiresAt));
        setShowSaveConfirm(true);
        
        // Hide confirmation after 2 seconds
        setTimeout(() => {
          setShowSaveConfirm(false);
        }, 2000);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        alert('Session expired. Please login again.');
        window.location.href = '/auth/login?message=Session expired, please login again';
      } else {
        const errorData = await response.json();
        alert('Error saving note: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving note:', error);
      if (error.message && (error.message.includes('401') || error.message.includes('token'))) {
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        alert('Session expired. Please login again.');
        window.location.href = '/auth/login?message=Session expired, please login again';
      } else {
        alert('Error saving note. Please try again.');
      }
    }
  };

  const clearNote = async () => {
    if (confirm('Are you sure you want to clear all notes? This action cannot be undone.')) {
      await clearNoteData();
    }
  };

  const handleBackAndLogout = async () => {
    if (confirm('Going back will log you out completely. Continue?')) {
      await logout();
      if (onBack) {
        onBack();
      }
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleBackAndLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back & Logout
              </motion.button>
              
              <div>
                <h1 className="text-2xl font-bold">🔒 Admin Notepad</h1>
                <p className="text-gray-300 text-sm">Secure 24-hour temporary notes</p>
              </div>
            </div>

            <div className="text-right">
              {expiryTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Expires in: {timeRemaining}</span>
                </div>
              )}
              {lastSaved && (
                <div className="text-xs text-gray-400 mt-1">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Palette className="w-5 h-5 text-white" />
            <h2 className="text-white font-semibold">Choose Note Color</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => (
              <motion.button
                key={color.name}
                onClick={() => setNoteColor(color.class)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 rounded-xl ${color.class} border-2 ${
                  noteColor === color.class 
                    ? 'border-white shadow-lg ring-2 ring-white ring-opacity-50' 
                    : color.border
                } transition-all duration-200`}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Notepad */}
        <motion.div
          layout
          className={`${noteColor} rounded-2xl border-2 ${
            colorOptions.find(c => c.class === noteColor)?.border || 'border-yellow-300'
          } shadow-2xl overflow-hidden`}
        >
          {/* Notepad Header */}
          <div className="bg-white bg-opacity-20 p-4 border-b border-current border-opacity-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="font-mono text-sm text-gray-700">admin_notes.txt</span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Save Confirmation */}
                <AnimatePresence>
                  {showSaveConfirm && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1 text-green-700 text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Saved!
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.button
                  onClick={saveNote}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </motion.button>
                
                <motion.button
                  onClick={clearNote}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </motion.button>
              </div>
            </div>
          </div>

          {/* Notepad Content */}
          <div className="p-6">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Start typing your secure notes here... (Auto-deletes after 24 hours)"
              className="w-full h-96 bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-600 font-mono text-sm leading-relaxed"
              style={{ 
                fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
                lineHeight: '1.6'
              }}
            />
          </div>
        </motion.div>

        {/* Warning Notice */}
        <div className="bg-orange-500 bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 mt-6 text-orange-100">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold">Security Notice</h3>
              <p className="text-sm text-orange-200">
                This notepad automatically deletes all content after 24 hours for security. 
                Save important information elsewhere before the timer expires.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{noteContent.length}</div>
            <div className="text-gray-300 text-sm">Characters</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {noteContent.split(/\s+/).filter(word => word.length > 0).length}
            </div>
            <div className="text-gray-300 text-sm">Words</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {noteContent.split('\n').length}
            </div>
            <div className="text-gray-300 text-sm">Lines</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotepad;