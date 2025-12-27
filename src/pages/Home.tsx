/**
 * Trang chủ - Home Page
 * Hiển thị ảnh home.png với nút "Truy cập ngay" và form đăng nhập
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/App';
import homeImage from '@/assets/home.png';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(username, password)) {
      navigate('/app/dashboard');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${homeImage})` }}
      />
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        {!showLogin ? (
          /* Access Button positioned near GVHD/SVTH text */
          <div className="absolute" style={{ bottom: '18%', left: '22%' }}>
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-3 bg-[#1a1a2e] text-white font-medium text-lg border-2 border-white/20 hover:bg-[#16213e] hover:border-white/40 transition-all duration-200"
            >
              Truy cập ngay
            </button>
          </div>
        ) : (
          /* Login Modal */
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-8 max-w-md w-full mx-4 border border-[#e5e5e5]">
              <h2 className="text-xl font-semibold mb-6 text-center text-[#1a1a1a]">
                Đăng nhập hệ thống
              </h2>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors"
                    placeholder="Nhập tên đăng nhập"
                    autoComplete="username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-1">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors"
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                  />
                </div>
                
                {error && (
                  <p className="text-sm text-[#ef4444]">{error}</p>
                )}
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLogin(false);
                      setError('');
                      setUsername('');
                      setPassword('');
                    }}
                    className="flex-1 px-4 py-2 border border-[#e5e5e5] text-sm font-medium text-[#666666] hover:border-[#1a1a1a] transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333333] transition-colors"
                  >
                    Đăng nhập
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
