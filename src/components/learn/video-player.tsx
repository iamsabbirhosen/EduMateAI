import Image from 'next/image';

interface VideoPlayerProps {
  topicTitle: string;
}

export function VideoPlayer({ topicTitle }: VideoPlayerProps) {
  // In a real app, this would use the YouTube API to search for videos
  const mockVideos = [
    { id: '1', title: `${topicTitle} Explained`, thumbnailUrl: 'https://placehold.co/560x315' },
    { id: '2', title: `Solving problems with ${topicTitle}`, thumbnailUrl: 'https://placehold.co/560x315' },
    { id: '3', title: `Advanced ${topicTitle} Concepts`, thumbnailUrl: 'https://placehold.co/560x315' },
  ];

  return (
    <div className="space-y-4">
      {mockVideos.map(video => (
        <div key={video.id} className="rounded-lg border bg-card p-3 shadow-sm">
          <p className="font-semibold mb-2">{video.title}</p>
          <div className="aspect-video w-full overflow-hidden rounded-md">
            <Image 
              src={video.thumbnailUrl}
              alt={video.title}
              width={560}
              height={315}
              className="w-full h-full object-cover"
              data-ai-hint="video lesson"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
