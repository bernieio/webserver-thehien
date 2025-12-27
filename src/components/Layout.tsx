/**
 * Layout Component
 * Bố cục chính với Navbar và Outlet cho các trang con
 */

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
}
