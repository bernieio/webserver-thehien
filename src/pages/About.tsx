/**
 * Tab Giới thiệu - About Page
 * Hiển thị ảnh about.png (placeholder khi chưa có ảnh)
 */

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/30">
      <div className="text-center space-y-4">
        <div className="w-full max-w-4xl mx-auto p-8 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground text-lg">
            Vui lòng tải lên ảnh <code className="bg-muted px-2 py-1 rounded">src/assets/about.png</code>
          </p>
        </div>
      </div>
    </div>
  );
}
