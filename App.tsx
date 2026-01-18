
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { EditorMode, Region, ImageRegion, HistoryItem } from './types';
import { GoogleGenAI } from "@google/genai";
import EditorPanel from './components/EditorPanel';
import Toolbar from './components/Toolbar';
import CanvasArea from './components/CanvasArea';
import Header from './components/Header';
import { toast } from './utils/toast';

const App: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalImageData, setOriginalImageData] = useState<string | null>(null);
  const [mode, setMode] = useState<EditorMode>(EditorMode.SELECT);
  const [regions, setRegions] = useState<Region[]>([]);
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);
  const [imageRegions, setImageRegions] = useState<ImageRegion[]>([]);
  const [activeImageRegion, setActiveImageRegion] = useState<ImageRegion | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [displayScale, setDisplayScale] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfPages, setPdfPages] = useState<any[]>([]);
  const [currentPdfPage, setCurrentPdfPage] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize Canvas when Image is set
  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        
        if (!originalImageData) {
            setOriginalImageData(canvas.toDataURL());
        }

        // Initialize history if empty
        if (history.length === 0) {
          const initialImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          setHistory([{
            imageData: initialImageData,
            regions: [],
            timestamp: Date.now(),
            actionName: 'Initial Load'
          }]);
          setHistoryIndex(0);
        }
      }
    }
  }, [image]);

  const saveHistory = useCallback((actionName: string) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const newHistoryItem: HistoryItem = {
      imageData: ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height),
      regions: JSON.parse(JSON.stringify(regions)),
      timestamp: Date.now(),
      actionName
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHistoryItem);
    
    // Limit history
    if (newHistory.length > 30) newHistory.shift();
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex, regions]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      const canvas = canvasRef.current;
      if (canvas && state) {
        canvas.getContext('2d')?.putImageData(state.imageData, 0, 0);
        setRegions(JSON.parse(JSON.stringify(state.regions)));
        setHistoryIndex(newIndex);
        setActiveRegion(null);
        setActiveImageRegion(null);
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      const canvas = canvasRef.current;
      if (canvas && state) {
        canvas.getContext('2d')?.putImageData(state.imageData, 0, 0);
        setRegions(JSON.parse(JSON.stringify(state.regions)));
        setHistoryIndex(newIndex);
        setActiveRegion(null);
        setActiveImageRegion(null);
      }
    }
  };

  const handleImageLoad = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setHistory([]);
        setHistoryIndex(-1);
        setRegions([]);
        setImageRegions([]);
        setOriginalImageData(null);
        setImage(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden text-white bg-[#0a0a0b]">
      <Header 
        onLoadImage={handleImageLoad}
        onZoomFit={() => {}} // Implemented in CanvasArea
        onDownload={() => {}} 
        imageLoaded={!!image}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden border-r border-[#222]">
          <Toolbar 
            mode={mode} 
            setMode={setMode} 
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onUndo={undo}
            onRedo={redo}
            onDetectAll={() => {}}
          />
          
          <CanvasArea 
            image={image}
            mode={mode}
            regions={regions}
            setRegions={setRegions}
            activeRegion={activeRegion}
            setActiveRegion={setActiveRegion}
            imageRegions={imageRegions}
            setImageRegions={setImageRegions}
            activeImageRegion={activeImageRegion}
            setActiveImageRegion={setActiveImageRegion}
            displayScale={displayScale}
            setDisplayScale={setDisplayScale}
            canvasRef={canvasRef}
            saveHistory={saveHistory}
            setIsProcessing={setIsProcessing}
          />
        </div>

        <aside className="w-80 bg-[#111] flex flex-col shrink-0">
          <EditorPanel 
            activeRegion={activeRegion}
            setActiveRegion={setActiveRegion}
            activeImageRegion={activeImageRegion}
            setActiveImageRegion={setActiveImageRegion}
            regions={regions}
            onUpdateRegion={(id, updates) => {
                setRegions(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
            }}
            canvasRef={canvasRef}
            saveHistory={saveHistory}
          />
        </aside>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
          <div className="w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-sm text-gray-400">AI 正在處理圖像中...</p>
        </div>
      )}
    </div>
  );
};

export default App;
