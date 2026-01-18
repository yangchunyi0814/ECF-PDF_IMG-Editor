
import React, { useRef } from 'react';

interface HeaderProps {
  onLoadImage: (file: File) => void;
  onZoomFit: () => void;
  onDownload: (format: string) => void;
  imageLoaded: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLoadImage, onZoomFit, onDownload, imageLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-[#222] shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <span className="text-sm font-bold">ECF</span>
        </div>
        <h1 className="text-sm font-semibold tracking-tight">Advanced PDF/IMG Editor</h1>
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,application/pdf"
          onChange={(e) => e.target.files?.[0] && onLoadImage(e.target.files[0])}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 text-xs font-medium bg-transparent border border-[#333] hover:bg-[#222] rounded-md transition-colors"
        >
          📂 開啟
        </button>
        <button 
          onClick={onZoomFit}
          className="px-3 py-1.5 text-xs font-medium bg-transparent border border-[#333] hover:bg-[#222] rounded-md transition-colors"
        >
          🔍 適合大小
        </button>
        
        <div className="relative group">
          <button 
            disabled={!imageLoaded}
            className="px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💾 下載 ▼
          </button>
          <div className="absolute right-0 hidden pt-2 group-hover:block w-48 z-[100]">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl overflow-hidden">
                <button onClick={() => onDownload('png')} className="w-full px-4 py-2 text-left text-xs hover:bg-[#333]">PNG 圖像</button>
                <button onClick={() => onDownload('jpg')} className="w-full px-4 py-2 text-left text-xs hover:bg-[#333]">JPG 圖像</button>
                <div className="border-t border-[#333]"></div>
                <button onClick={() => onDownload('pdf')} className="w-full px-4 py-2 text-left text-xs hover:bg-[#333]">PDF 文件</button>
                <button onClick={() => onDownload('pptx')} className="w-full px-4 py-2 text-left text-xs hover:bg-[#333]">PowerPoint (PPTX)</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
