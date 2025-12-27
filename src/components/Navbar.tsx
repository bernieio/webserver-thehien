/**
 * Navbar Component
 * Navigation bar với menu style Cloudflare, dropdown cho Kết quả
 */

import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/App';
import logo1 from '@/assets/navbar-left-1st-logo.png';
import logo2 from '@/assets/navbar-left-2nd-logo.png';
import rightLogo from '@/assets/navbar-right-1st-logo.png';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 text-xl font-medium transition-colors ${
      isActive
        ? 'text-[#1a1a1a] border-b-2 border-[#1a1a1a]'
        : 'text-[#666666] hover:text-[#1a1a1a]'
    }`;

  return (
    <nav className="border-b border-[#e5e5e5] bg-white sticky top-0 z-50">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logos */}
          <div className="flex items-center gap-3">
            <img src={logo1} alt="Logo 1" className="h-10 w-auto" />
            <img src={logo2} alt="Logo 2" className="h-10 w-auto" />
          </div>

          {/* Center: Navigation Links */}
          <div className="flex items-center gap-1">
            <NavLink to="/app/about" className={navLinkClass}>
              Giới thiệu
            </NavLink>
            
            <NavLink to="/app/dashboard" className={navLinkClass}>
              Vận hành
            </NavLink>
            
            {/* Kết quả Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`px-4 py-2 text-xl font-medium transition-colors flex items-center gap-1 ${
                  location.pathname.includes('/app/images') || location.pathname.includes('/app/logs')
                    ? 'text-[#1a1a1a] border-b-2 border-[#1a1a1a]'
                    : 'text-[#666666] hover:text-[#1a1a1a]'
                }`}
              >
                Kết quả
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-[#e5e5e5] shadow-lg min-w-[160px] z-50">
                  <NavLink
                    to="/app/images"
                    onClick={() => setIsDropdownOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 text-xl transition-colors ${
                        isActive ? 'bg-[#fafafa] text-[#1a1a1a] font-medium' : 'text-[#666666] hover:bg-[#fafafa]'
                      }`
                    }
                  >
                    Ảnh
                  </NavLink>
                  <NavLink
                    to="/app/logs"
                    onClick={() => setIsDropdownOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 text-xl transition-colors ${
                        isActive ? 'bg-[#fafafa] text-[#1a1a1a] font-medium' : 'text-[#666666] hover:bg-[#fafafa]'
                      }`
                    }
                  >
                    Nhật ký
                  </NavLink>
                </div>
              )}
            </div>
            
            <NavLink to="/app/system" className={navLinkClass}>
              Hệ thống
            </NavLink>
          </div>

          {/* Right: Logo + Logout */}
          <div className="flex items-center gap-4">
            <img src={rightLogo} alt="Right Logo" className="h-10 w-auto" />
            <button
              onClick={handleLogout}
              className="text-xl text-[#666666] hover:text-[#1a1a1a] transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
