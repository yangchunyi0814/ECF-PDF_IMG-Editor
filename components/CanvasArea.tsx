
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { EditorMode, Region, ImageRegion } from '../types';
// Import the toast utility to fix "Cannot find name 'toast'" errors
import { toast } from '../utils/toast';

interface CanvasAreaProps {
  image: HTMLImageElement | null;
  mode: EditorMode;
  regions: Region[];
  setRegions: React.Dispatch<React.SetStateAction<Region[]>>;
  activeRegion: Region | null;
  setActiveRegion: (r: Region | null) => void;
  imageRegions: ImageRegion[];
  setImageRegions: React.Dispatch<React.SetStateAction<ImageRegion[]>>;
  activeImageRegion: ImageRegion | null;
  setActiveImageRegion: (r: ImageRegion | null) => void;
  displayScale: number;
  setDisplayScale: (s: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  saveHistory: (name: string) => void;
  setIsProcessing: (b: boolean) => void;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ 
  image, mode, regions, setRegions, activeRegion, setActiveRegion,
  imageRegions, setImageRegions, activeImageRegion, setActiveImageRegion,
  displayScale, setDisplayScale, canvasRef, saveHistory, setIsProcessing 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{x: number, y: number} | null>(null);
  const [selectionRect, setSelectionRect] = useState<{x: number, y: number, w: number, h: number} | null>(null);

  const zoomFit = useCallback(() => {
    if (!image || !containerRef.current) return;
    const padding = 64;
    const availableW = containerRef.current.clientWidth - padding;
    const availableH = containerRef.current.clientHeight - padding;
    const scale = Math.min(availableW / image.width, availableH / image.height, 1);
    setDisplayScale(scale);
  }, [image, setDisplayScale]);

  useEffect(() => {
    if (image) zoomFit();
  }, [image, zoomFit]);

  const getCanvasCoords = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / displayScale,
      y: (e.clientY - rect.top) / displayScale
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!image || e.button !== 0) return;
    const coords = getCanvasCoords(e);
    
    if (mode === EditorMode.REGION || mode === EditorMode.IMAGE_SELECT) {
      setIsSelecting(true);
      setSelectionStart(coords);
      setSelectionRect({ x: coords.x, y: coords.y, w: 0, h: 0 });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting || !selectionStart) return;
    const coords = getCanvasCoords(e);
    setSelectionRect({
      x: Math.min(selectionStart.x, coords.x),
      y: Math.min(selectionStart.y, coords.y),
      w: Math.abs(coords.x - selectionStart.x),
      h: Math.abs(coords.y - selectionStart.y)
    });
  };

  const handleMouseUp = async (e: React.MouseEvent) => {
    if (!isSelecting || !selectionRect) return;
    setIsSelecting(false);

    if (selectionRect.w > 10 && selectionRect.h > 10) {
      if (mode === EditorMode.REGION) {
        await processRegion(selectionRect);
      }
    }
    setSelectionRect(null);
  };

  const processRegion = async (rect: {x: number, y: number, w: number, h: number}) => {
    setIsProcessing(true);
    try {
        // Mocking OCR call - In a real app we'd use Tesseract.recognize
        // For this demo, let's assume a dummy region
        const newRegion: Region = {
            id: Date.now(),
            ...rect,
            originalText: '識別中...',
            text: '識別中...',
            fontSize: 24,
            fontFamily: 'Noto Sans TC',
            fontWeight: '400',
            scaleY: 1,
            color: '#000000',
            bgColor: '#ffffff',
            transparentBg: true,
            padding: 4,
            textAlign: 'left',
            lineHeight: 1.2,
            letterSpacing: 0,
            strokeColor: '#000000',
            strokeWidth: 0,
            shadowColor: '#000000',
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            rotation: 0,
            gradientEnabled: false,
            edited: false
        };
        setRegions(prev => [...prev, newRegion]);
        setActiveRegion(newRegion);
        toast('區域已選取，正在分析文字...', 'info');
        
        // Actually run Tesseract if available
        // @ts-ignore
        if (window.Tesseract) {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const imageData = ctx?.getImageData(rect.x, rect.y, rect.w, rect.h);
                if (imageData) {
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = rect.w;
                    tempCanvas.height = rect.h;
                    tempCanvas.getContext('2d')?.putImageData(imageData, 0, 0);
                    // @ts-ignore
                    const result = await window.Tesseract.recognize(tempCanvas.toDataURL(), 'chi_tra+eng');
                    const text = result.data.text.trim();
                    setRegions(prev => prev.map(r => r.id === newRegion.id ? { ...r, text, originalText: text } : r));
                }
            }
        }
    } catch (err) {
        toast('OCR 失敗', 'error');
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-auto bg-[#050505] relative flex items-center justify-center p-12 custom-scrollbar"
    >
      <div 
        className="relative shadow-2xl transition-transform duration-200"
        style={{ transform: `scale(${displayScale})`, transformOrigin: 'center center' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <canvas ref={canvasRef} id="main-canvas" className="block cursor-default" />
        
        {selectionRect && (
          <div 
            className="absolute border-2 border-dashed border-indigo-500 bg-indigo-500/20 pointer-events-none z-50"
            style={{
              left: selectionRect.x,
              top: selectionRect.y,
              width: selectionRect.w,
              height: selectionRect.h
            }}
          />
        )}

        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {regions.map(r => (
            <div 
              key={r.id}
              onClick={(e) => { e.stopPropagation(); setActiveRegion(r); }}
              className={`absolute border-2 transition-all pointer-events-auto cursor-pointer ${
                activeRegion?.id === r.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-transparent hover:border-indigo-500/50 hover:bg-white/5'
              } ${r.edited ? 'border-emerald-500' : ''}`}
              style={{
                left: r.x,
                top: r.y,
                width: r.w,
                height: r.h,
                transform: `rotate(${r.rotation}deg)`
              }}
            >
                {r.edited && (
                    <div 
                        className="w-full h-full overflow-hidden flex items-center justify-center text-center"
                        style={{
                            background: r.transparentBg ? 'transparent' : r.bgColor,
                            color: r.color,
                            fontFamily: r.fontFamily,
                            fontSize: r.fontSize,
                            fontWeight: r.fontWeight,
                            textAlign: r.textAlign,
                            lineHeight: r.lineHeight,
                            transform: `scaleY(${r.scaleY})`
                        }}
                    >
                        {r.text}
                    </div>
                )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1.5 rounded-full text-[10px] text-gray-400 border border-white/10 backdrop-blur-md">
        縮放: {Math.round(displayScale * 100)}%
      </div>
    </div>
  );
};

export default CanvasArea;
