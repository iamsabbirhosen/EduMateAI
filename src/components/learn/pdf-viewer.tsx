import Image from 'next/image';

interface PdfViewerProps {
  pdfUrl: string;
}

export function PdfViewer({ pdfUrl }: PdfViewerProps) {
  return (
    <div className="w-full aspect-[8.5/11] rounded-lg overflow-hidden border bg-white shadow-inner">
      <Image
        src="https://placehold.co/850x1100"
        alt="PDF Document"
        width={850}
        height={1100}
        className="object-cover w-full h-full"
        data-ai-hint="document paper"
      />
      {/* In a real app, you would use a library like react-pdf to render the actual PDF from pdfUrl */}
    </div>
  );
}
