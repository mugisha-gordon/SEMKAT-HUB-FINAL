import { useMemo, useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Sparkles, Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react";

type Clip = {
  id: string;
  title: string;
  location: string;
  author: string;
  role: "agent" | "user";
  videoUrl: string;
  coverUrl: string;
  likes: number;
  comments: number;
};

const Explore = () => {
  const clips = useMemo<Clip[]>(
    () => [
      {
        id: "c1",
        title: "Skyline villa sunset tour",
        location: "Kololo, Kampala",
        author: "Grace Nakato",
        role: "agent",
        videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
        coverUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200",
        likes: 128,
        comments: 14,
      },
      {
        id: "c2",
        title: "Drone flyover of 10-acre Mukono plot",
        location: "Mukono, Central Region",
        author: "Samuel Opio",
        role: "agent",
        videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Night_City.mp4",
        coverUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200",
        likes: 204,
        comments: 33,
      },
      {
        id: "c3",
        title: "Apartment interior walkthrough",
        location: "Naguru, Kampala",
        author: "Lydia (buyer)",
        role: "user",
        videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Sunrise-Timelapse.mp4",
        coverUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200",
        likes: 96,
        comments: 9,
      },
      {
        id: "c4",
        title: "Luxury penthouse with city views",
        location: "Nakasero, Kampala",
        author: "David Ssempijja",
        role: "agent",
        videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
        coverUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
        likes: 312,
        comments: 47,
      },
    ],
    [],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < clips.length) {
      setCurrentIndex(index);
    }
  };

  const handleScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0 && currentIndex < clips.length - 1) {
      goToSlide(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  // Touch handling for mobile
  const touchStartY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0 && currentIndex < clips.length - 1) {
        goToSlide(currentIndex + 1);
      } else if (deltaY < 0 && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
    }
  };

  // Play/pause videos based on current index
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex]);

  const toggleLike = (clipId: string) => {
    setLiked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clipId)) {
        newSet.delete(clipId);
      } else {
        newSet.add(clipId);
      }
      return newSet;
    });
  };

  const currentClip = clips[currentIndex];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />

      <main className="flex-1 relative overflow-hidden">
        {/* TikTok-style vertical snap scroll container */}
        <div
          ref={containerRef}
          className="h-[calc(100vh-80px)] overflow-hidden relative"
          onWheel={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Video slides */}
          <div
            className="transition-transform duration-500 ease-out h-full"
            style={{ transform: `translateY(-${currentIndex * 100}%)` }}
          >
            {clips.map((clip, index) => (
              <div key={clip.id} className="h-full w-full relative flex items-center justify-center">
                {/* Video */}
                <video
                  ref={el => { videoRefs.current[index] = el; }}
                  className="h-full w-full object-cover"
                  src={clip.videoUrl}
                  poster={clip.coverUrl}
                  muted={muted}
                  loop
                  playsInline
                  controls={false}
                />
                
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-24">
                  <Badge 
                    variant="outline" 
                    className="border-white/40 text-white/90 mb-3 bg-black/30 backdrop-blur-sm"
                  >
                    {clip.role === "agent" ? "Agent" : "User"} • {clip.location}
                  </Badge>
                  <h3 className="font-heading text-2xl font-bold mb-1 drop-shadow-lg">{clip.title}</h3>
                  <p className="text-white/80 text-sm">@{clip.author}</p>
                </div>

                {/* Right side action buttons */}
                <div className="absolute right-4 bottom-32 flex flex-col items-center gap-5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 ${
                      liked.has(clip.id) ? 'text-red-500' : 'text-white'
                    }`}
                    onClick={() => toggleLike(clip.id)}
                  >
                    <Heart className={`h-6 w-6 ${liked.has(clip.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <span className="text-xs text-white/80">{clip.likes + (liked.has(clip.id) ? 1 : 0)}</span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                  <span className="text-xs text-white/80">{clip.comments}</span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
                  >
                    <Share2 className="h-6 w-6" />
                  </Button>
                  <span className="text-xs text-white/80">Share</span>
                </div>

                {/* Sound toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
                  onClick={() => setMuted((m) => !m)}
                >
                  {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </div>
            ))}
          </div>

          {/* Navigation indicators */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {clips.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-1.5 h-8 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          {currentIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-20 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
              onClick={() => goToSlide(currentIndex - 1)}
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          )}
          {currentIndex < clips.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-20 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 animate-bounce"
              onClick={() => goToSlide(currentIndex + 1)}
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          )}

          {/* Header badge */}
          <div className="absolute top-4 left-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/15">
              <Sparkles className="h-5 w-5 text-orange-300" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold">Explore</h1>
              <p className="text-white/60 text-xs">{currentIndex + 1} / {clips.length}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explore;
