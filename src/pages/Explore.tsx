import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Sparkles, Volume2, VolumeX, ChevronUp, ChevronDown, Trash2, MessageSquareText, Send } from "lucide-react";
import { addVideoComment, deleteVideo, getVideos, subscribeToVideoComments, toggleVideoLike } from "@/integrations/firebase/videos";
import type { VideoCommentDocument, VideoDocument } from "@/integrations/firebase/videos";
import { useAuth } from "@/context/AuthContext";
import { getUserDocument } from "@/integrations/firebase/users";
import { toast } from "sonner";
import VideoPostForm from "@/components/video/VideoPostForm";
import MessageDialog from "@/components/messaging/MessageDialog";
import { deleteFile } from "@/integrations/firebase/storage";

const Explore = () => {
  const { user } = useAuth();
  const [clips, setClips] = useState<VideoDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorNames, setAuthorNames] = useState<{ [userId: string]: string }>({});
  const [authorAvatars, setAuthorAvatars] = useState<{ [userId: string]: string | undefined }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [messageOpen, setMessageOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<VideoCommentDocument[]>([]);
  const [commentDraft, setCommentDraft] = useState("");
  const [commentSending, setCommentSending] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const currentClip = clips[currentIndex];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videos = await getVideos({ limit: 30 });
        setClips(videos);

        // Fetch author names
        const userIds = [...new Set(videos.map((v) => v.userId))];
        const names: { [userId: string]: string } = {};
        const avatars: { [userId: string]: string | undefined } = {};

        await Promise.all(
          userIds.map(async (userId) => {
            try {
              const userDoc = await getUserDocument(userId);
              names[userId] = userDoc?.profile.fullName || 'Unknown';
              avatars[userId] = userDoc?.profile.avatarUrl || undefined;
            } catch {
              names[userId] = 'Unknown';
              avatars[userId] = undefined;
            }
          })
        );
        setAuthorNames(names);
        setAuthorAvatars(avatars);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const refreshVideos = async () => {
    try {
      setLoading(true);
      const videos = await getVideos({ limit: 30 });
      setClips(videos);

      const userIds = [...new Set(videos.map((v) => v.userId))];
      const names: { [userId: string]: string } = {};
      const avatars: { [userId: string]: string | undefined } = {};

      await Promise.all(
        userIds.map(async (userId) => {
          try {
            const userDoc = await getUserDocument(userId);
            names[userId] = userDoc?.profile.fullName || 'Unknown';
            avatars[userId] = userDoc?.profile.avatarUrl || undefined;
          } catch {
            names[userId] = 'Unknown';
            avatars[userId] = undefined;
          }
        })
      );
      setAuthorNames(names);
      setAuthorAvatars(avatars);
      setCurrentIndex((i) => Math.min(i, Math.max(0, videos.length - 1)));
    } catch (error) {
      console.error('Error refreshing videos:', error);
      toast.error('Failed to refresh videos');
    } finally {
      setLoading(false);
    }
  };

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

  const toggleLike = async (clipId: string) => {
    if (!user) {
      toast.error('Please log in to like videos');
      return;
    }

    try {
      const result = await toggleVideoLike(clipId, user.uid);
      // Update local state
      setClips(prev => prev.map(clip => 
        clip.id === clipId 
          ? { ...clip, likes: result.likes, likedBy: result.liked ? [...(clip.likedBy || []), user.uid] : (clip.likedBy || []).filter(id => id !== user.uid) }
          : clip
      ));
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast.error(error.message || 'Failed to like video');
    }
  };

  const handleDelete = async (clip: VideoDocument) => {
    if (!user) {
      toast.error('Please log in');
      return;
    }
    if (clip.userId !== user.uid) {
      toast.error('You can only delete your own videos');
      return;
    }

    try {
      toast.loading('Deleting video...', { id: `delete-video-${clip.id}` });
      await deleteVideo(clip.id);
      if (clip.videoUrl) {
        await deleteFile(clip.videoUrl);
      }
      toast.success('Video deleted', { id: `delete-video-${clip.id}` });

      setClips((prev) => {
        const next = prev.filter((v) => v.id !== clip.id);
        setCurrentIndex((idx) => Math.min(idx, Math.max(0, next.length - 1)));
        return next;
      });
    } catch (error: any) {
      console.error('Error deleting video:', error);
      toast.error(error.message || 'Failed to delete video', { id: `delete-video-${clip.id}` });
    }
  };

  useEffect(() => {
    if (!commentsOpen) {
      setComments([]);
      setCommentDraft("");
      return;
    }

    if (!currentClip?.id) return;

    const unsubscribe = subscribeToVideoComments(currentClip.id, (data) => {
      setComments(data);

      const commenterIds = [...new Set(data.map((c) => c.userId))];
      const missingIds = commenterIds.filter((id) => !authorNames[id]);
      if (missingIds.length === 0) return;

      Promise.all(
        missingIds.map(async (userId) => {
          try {
            const userDoc = await getUserDocument(userId);
            return {
              userId,
              name: userDoc?.profile.fullName || 'Unknown',
              avatar: userDoc?.profile.avatarUrl || undefined,
            };
          } catch {
            return { userId, name: 'Unknown', avatar: undefined };
          }
        })
      )
        .then((results) => {
          setAuthorNames((prev) => {
            const next = { ...prev };
            results.forEach((r) => {
              next[r.userId] = r.name;
            });
            return next;
          });
          setAuthorAvatars((prev) => {
            const next = { ...prev };
            results.forEach((r) => {
              next[r.userId] = r.avatar;
            });
            return next;
          });
        })
        .catch(() => {});
    });

    return () => {
      unsubscribe();
    };
  }, [commentsOpen, currentClip?.id]);

  const handleSendComment = async () => {
    if (!user) {
      window.location.href = "/auth";
      return;
    }
    if (!currentClip?.id) return;

    const content = commentDraft.trim();
    if (!content) return;

    setCommentSending(true);
    try {
      await addVideoComment(currentClip.id, user.uid, content);
      setCommentDraft("");

      // optimistic counter update
      setClips((prev) =>
        prev.map((v) => (v.id === currentClip.id ? { ...v, comments: (v.comments || 0) + 1 } : v))
      );
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setCommentSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-semkat-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading videos...</p>
          </div>
        </main>
      </div>
    );
  }

  if (clips.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-white/60">No videos yet</p>
            <p className="text-white/40 text-sm mt-1">Be the first to post a video!</p>
          </div>
        </main>
      </div>
    );
  }

  const isLiked = user && currentClip?.likedBy?.includes(user.uid);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />

      <main className="flex-1 relative overflow-hidden">
        {/* Upload button */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <VideoPostForm
            onSuccess={refreshVideos}
            triggerVariant="hero"
            triggerSize="icon"
            triggerClassName="h-10 w-10 rounded-full"
            triggerLabel=""
          />
        </div>

        {currentClip && (
          <MessageDialog
            open={messageOpen}
            onOpenChange={setMessageOpen}
            otherUserId={currentClip.userId}
            otherUserName={authorNames[currentClip.userId]}
          />
        )}

        {currentClip && (
          <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
            <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="font-heading">Comments</DialogTitle>
              </DialogHeader>

              <div className="max-h-[360px] overflow-y-auto space-y-3 pr-1">
                {comments.length === 0 ? (
                  <p className="text-white/50 text-sm">No comments yet. Be the first to comment.</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={authorAvatars[c.userId]} />
                        <AvatarFallback className="bg-white/10 text-white/80 text-xs">
                          {(authorNames[c.userId] || 'U').slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm text-white/90">{authorNames[c.userId] || 'Unknown'}</p>
                          <p className="text-xs text-white/40">
                            {c.createdAt?.toDate?.().toLocaleString?.()}
                          </p>
                        </div>
                        <p className="text-sm text-white/75 whitespace-pre-wrap">{c.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/10 pt-3 flex gap-2">
                <Input
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                  placeholder="Write a comment..."
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  disabled={commentSending}
                />
                <Button
                  variant="hero"
                  size="icon"
                  onClick={handleSendComment}
                  disabled={commentSending || !commentDraft.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

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
                  poster={clip.coverUrl || undefined}
                  muted={muted}
                  loop
                  playsInline
                  controls={false}
                  preload={index === currentIndex ? "auto" : "metadata"}
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
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 border border-white/15">
                      <AvatarImage src={authorAvatars[clip.userId]} />
                      <AvatarFallback className="bg-white/10 text-white/80 text-xs">
                        {(authorNames[clip.userId] || 'U').slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-white/80 text-sm">@{authorNames[clip.userId] || 'Unknown'}</p>
                  </div>
                </div>

                {/* Right side action buttons */}
                <div className="absolute right-4 bottom-32 flex flex-col items-center gap-5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 ${
                      index === currentIndex && isLiked ? 'text-red-500' : 'text-white'
                    }`}
                    onClick={() => toggleLike(clip.id)}
                  >
                    <Heart className={`h-6 w-6 ${index === currentIndex && isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <span className="text-xs text-white/80">{clip.likes || 0}</span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
                    onClick={() => {
                      if (!user) {
                        window.location.href = "/auth";
                        return;
                      }
                      setCommentsOpen(true);
                    }}
                  >
                    <MessageSquareText className="h-6 w-6" />
                  </Button>
                  <span className="text-xs text-white/80">{clip.comments || 0}</span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
                    onClick={() => {
                      if (!user) {
                        window.location.href = "/auth";
                        return;
                      }
                      setMessageOpen(true);
                    }}
                  >
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                  <span className="text-xs text-white/80">Message</span>

                  {user && clip.userId === user.uid && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
                        onClick={() => handleDelete(clip)}
                      >
                        <Trash2 className="h-6 w-6" />
                      </Button>
                      <span className="text-xs text-white/80">Delete</span>
                    </>
                  )}
                  
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
                  className="absolute top-4 right-16 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
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
