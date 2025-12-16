import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Play, Pause, Heart, MessageCircle, Share2, Sparkles } from "lucide-react";

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
    ],
    [],
  );

  const [activeId, setActiveId] = useState(clips[0]?.id);
  const [muted, setMuted] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />

      <main className="flex-1 pb-12">
        <section className="relative overflow-hidden py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(249,115,22,0.25),transparent_40%),radial-gradient(circle_at_75%_15%,rgba(14,165,233,0.25),transparent_35%)]" />
          <div className="container relative flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/15">
              <Sparkles className="h-6 w-6 text-orange-300" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Immersive video feed</p>
              <h1 className="font-heading text-3xl font-bold">Explore</h1>
            </div>
          </div>
        </section>

        <section className="container pb-10">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {clips.map((clip) => {
                const isActive = activeId === clip.id;
                return (
                  <Card
                    key={clip.id}
                    className="bg-white/5 border-white/10 text-white overflow-hidden"
                    onMouseEnter={() => setActiveId(clip.id)}
                  >
                    <div className="relative aspect-[9/16] sm:aspect-[16/9]">
                      <video
                        key={clip.id}
                        className="w-full h-full object-cover"
                        src={clip.videoUrl}
                        poster={clip.coverUrl}
                        autoPlay={isActive}
                        muted={muted}
                        loop
                        playsInline
                        controls={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div>
                          <Badge variant="outline" className="border-white/30 text-white/90 mb-2">
                            {clip.role === "agent" ? "Agent" : "User"} • {clip.location}
                          </Badge>
                          <h3 className="font-heading text-xl font-semibold">{clip.title}</h3>
                          <p className="text-white/70 text-sm">{clip.author}</p>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Heart className="h-5 w-5" />
                            <span className="sr-only">Like</span>
                          </Button>
                          <span className="text-xs text-white/70">{clip.likes}</span>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <MessageCircle className="h-5 w-5" />
                            <span className="sr-only">Comment</span>
                          </Button>
                          <span className="text-xs text-white/70">{clip.comments}</span>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Share2 className="h-5 w-5" />
                            <span className="sr-only">Share</span>
                          </Button>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-white/30 text-white bg-black/30 hover:bg-black/50"
                          onClick={() => setMuted((m) => !m)}
                        >
                          {muted ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-4">
              <Card className="bg-white/5 border-white/10 text-white p-5">
                <h3 className="font-heading text-xl font-semibold mb-2">Post a video</h3>
                <p className="text-white/70 text-sm mb-4">
                  Agents and users can upload property walk-throughs, drone shots, or neighborhood tours.
                </p>
                <Button variant="hero" className="w-full">Upload</Button>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500/20 to-sky-500/20 border-white/10 text-white p-5">
                <h4 className="font-heading font-semibold text-lg mb-2">Pro tips</h4>
                <ul className="text-sm text-white/80 space-y-2">
                  <li>• Keep clips between 10–60s, vertical or horizontal.</li>
                  <li>• Show documents or verification badges to build trust.</li>
                  <li>• Include voice-over for remote buyers.</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Explore;

