/**
 * Tab Giới thiệu - About Page
 * Hiển thị ảnh about.png
 */

import aboutImage from '@/assets/about.png';

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <img
        src={aboutImage}
        alt="Giới thiệu"
        className="w-full h-auto"
      />
    </div>
  );
}
