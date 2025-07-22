
interface PdfViewerProps {
  pdfUrl: string;
}

export function PdfViewer({ pdfUrl }: PdfViewerProps) {
  return (
    <div className="w-full aspect-[8.5/11] rounded-lg overflow-hidden border bg-white shadow-inner">
       <iframe
        src={pdfUrl}
        className="w-full h-full"
        title="PDF Viewer"
      />
    </div>
  );
}
