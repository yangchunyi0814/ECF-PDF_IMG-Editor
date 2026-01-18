
import React from 'react';
import { EditorMode } from '../types';

interface ToolbarProps {
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDetectAll: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ mode, setMode, canUndo, canRedo, onUndo, onRedo, onDetectAll }) => {
  const tools = [
    { id: EditorMode.SELECT, icon: '⬚', label: '選取' },
    { id: EditorMode.REGION, icon: '⛶', label: '框選文字' },
    { id: EditorMode.IMAGE_SELECT, icon: '🖼️', label: '圖選' },
    { id: EditorMode.LASSO, icon: '✂️', label: '套索' },
    { id: EditorMode.MAGIC_WAND, icon: '🪄', label: '魔術棒' },
    { id: EditorMode.EYEDROPPER, icon: '💧', label: '取色' },
    { id: EditorMode.CROP, icon: '✂️', label: '裁切' },
    { id: EditorMode.BRUSH, icon: '🖌️', label: '畫筆' },
    { id: EditorMode.SHAPE, icon: '⬜', label: '形狀' },
    { id: EditorMode.ARROW, icon: '➡️', label: '箭頭' },
    { id: EditorMode.MOSAIC, icon: '🔲', label: '馬賽克' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-[#111] border-b border-[#222]">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setMode(tool.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === tool.id 
              ? 'bg-indigo-600 text-white border-indigo-500' 
              : 'bg-[#1a1a1a] text-gray-400 border-[#333] border hover:border-indigo-500 hover:text-white'
          }`}
          title={tool.label}
        >
          <span>{tool.icon}</span>
          <span className="hidden sm:inline">{tool.label}</span>
        </button>
      ))}
      <div className="w-px h-6 mx-2 bg-[#333]"></div>
      <button 
        onClick={onUndo} 
        disabled={!canUndo}
        className="p-1.5 rounded hover:bg-[#222] disabled:opacity-30"
        title="復原 (Ctrl+Z)"
      >
        ↶
      </button>
      <button 
        onClick={onRedo} 
        disabled={!canRedo}
        className="p-1.5 rounded hover:bg-[#222] disabled:opacity-30"
        title="重做 (Ctrl+Y)"
      >
        ↷
      </button>
      <div className="w-px h-6 mx-2 bg-[#333]"></div>
      <button 
        onClick={onDetectAll}
        className="px-3 py-1.5 text-xs font-medium bg-[#1a1a1a] text-gray-400 border border-[#333] hover:text-white hover:border-indigo-500 rounded-md transition-all"
      >
        🎯 自動偵測
      </button>
    </div>
  );
};

export default Toolbar;
