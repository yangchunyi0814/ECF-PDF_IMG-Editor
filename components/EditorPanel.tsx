
import React from 'react';
import { Region, ImageRegion } from '../types';

interface EditorPanelProps {
  activeRegion: Region | null;
  setActiveRegion: (r: Region | null) => void;
  activeImageRegion: ImageRegion | null;
  setActiveImageRegion: (r: ImageRegion | null) => void;
  regions: Region[];
  onUpdateRegion: (id: number, updates: Partial<Region>) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  saveHistory: (name: string) => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({ 
  activeRegion, setActiveRegion, activeImageRegion, 
  regions, onUpdateRegion, canvasRef, saveHistory 
}) => {
  
  if (!activeRegion && !activeImageRegion) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-4xl mb-4 opacity-20">🖱️</div>
        <p className="text-xs text-gray-500 leading-relaxed">
          選取工具後在畫面上拖曳<br />
          或點擊現有區塊開始編輯
        </p>
      </div>
    );
  }

  const handleCommit = () => {
    if (!activeRegion || !canvasRef.current) return;
    saveHistory(`編輯文字: ${activeRegion.text.slice(0, 10)}`);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // First clear area
    if (!activeRegion.transparentBg) {
        ctx.fillStyle = activeRegion.bgColor;
        ctx.fillRect(activeRegion.x, activeRegion.y, activeRegion.w, activeRegion.h);
    }

    // Drawing text logic here...
    // In a real implementation, we'd draw onto the main canvas
    
    onUpdateRegion(activeRegion.id, { edited: true });
    setActiveRegion(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-4 gap-6">
      {activeRegion && (
        <>
            <section className="space-y-3">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">編輯內容</h3>
                <textarea 
                    className="w-full h-24 bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    value={activeRegion.text}
                    onChange={(e) => onUpdateRegion(activeRegion.id, { text: e.target.value })}
                />
            </section>

            <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">外觀設定</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] text-gray-400">字體大小</label>
                        <input 
                            type="number"
                            className="w-full bg-[#1a1a1a] border border-[#333] rounded px-2 py-1 text-xs"
                            value={activeRegion.fontSize}
                            onChange={(e) => onUpdateRegion(activeRegion.id, { fontSize: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[11px] text-gray-400">文字顏色</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color"
                                className="w-8 h-8 rounded bg-transparent cursor-pointer"
                                value={activeRegion.color}
                                onChange={(e) => onUpdateRegion(activeRegion.id, { color: e.target.value })}
                            />
                            <span className="text-[10px] font-mono text-gray-500">{activeRegion.color}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[11px] text-gray-400">背景顏色</label>
                    <div className="flex items-center gap-3">
                        <input 
                            type="color"
                            className="w-8 h-8 rounded bg-transparent cursor-pointer"
                            value={activeRegion.bgColor === 'transparent' ? '#ffffff' : activeRegion.bgColor}
                            onChange={(e) => onUpdateRegion(activeRegion.id, { bgColor: e.target.value, transparentBg: false })}
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={activeRegion.transparentBg}
                                onChange={(e) => onUpdateRegion(activeRegion.id, { transparentBg: e.target.checked })}
                            />
                            <span className="text-xs text-gray-400">透明背景</span>
                        </label>
                    </div>
                </div>
            </section>

            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-[#222]">
                <button 
                    onClick={handleCommit}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition-colors"
                >
                    ✓ 套用修改
                </button>
                <button 
                    onClick={() => setActiveRegion(null)}
                    className="w-full py-2.5 bg-transparent border border-[#333] hover:bg-[#222] rounded-lg text-sm transition-colors"
                >
                    取消
                </button>
            </div>
        </>
      )}
    </div>
  );
};

export default EditorPanel;
