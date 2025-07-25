
'use client';
import { useEffect, useRef, useState } from 'react';
import { Loader2, FileText, AlertCircle } from 'lucide-react';

interface PdfViewerProps {
  pdfUrl: string;
}

export function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pdfUrl]);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  // Create a secure PDF URL with minimal security parameters for performance
  const secureUrl = `/api/pdf?path=${encodeURIComponent(pdfUrl)}&t=${Math.floor(Date.now() / 60000)}#toolbar=0&navpanes=0&view=FitH`;

  // Optimized keyboard shortcut prevention
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only prevent critical shortcuts
      if (e.ctrlKey && (e.key === 's' || e.key === 'p')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className="pdf-viewer-container w-full aspect-[8.5/11] rounded-lg overflow-hidden border bg-white shadow-inner relative"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-gray-600">Loading PDF...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <p className="text-sm text-gray-600">Failed to load PDF</p>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={secureUrl}
        className="w-full h-full"
        title="PDF Viewer"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          border: 'none',
          pointerEvents: 'auto'
        }}
        // Optimized sandbox for performance
        sandbox="allow-same-origin allow-scripts"
        loading="lazy"
      />
      
      {/* Minimal security overlay */}
      <div 
        className="absolute inset-0 z-5 pointer-events-none"
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {/* Simplified watermark */}
      <div className="absolute top-4 right-4 z-20 bg-black/20 text-white px-2 py-1 rounded text-xs backdrop-blur-sm pointer-events-none">
        <FileText className="h-3 w-3 inline mr-1" />
        Protected Content
      </div>
    </div>
  );
}
