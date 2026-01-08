import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sendMessage, subscribeToMessages, markMessagesAsRead } from "@/integrations/firebase/messages";
import { getUserDocument } from "@/integrations/firebase/users";
import { toast } from "sonner";
import type { MessageDocument } from "@/integrations/firebase/messages";

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  otherUserId: string;
  otherUserName?: string;
}

const MessageDialog = ({ open, onOpenChange, otherUserId, otherUserName }: MessageDialogProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [otherUser, setOtherUser] = useState<{ name: string; avatar?: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !user || !otherUserId) return;

    // Fetch other user's info
    const fetchOtherUser = async () => {
      try {
        const userDoc = await getUserDocument(otherUserId);
        if (userDoc) {
          setOtherUser({
            name: userDoc.profile.fullName || otherUserName || "User",
            avatar: userDoc.profile.avatarUrl || undefined,
          });
        } else {
          setOtherUser({ name: otherUserName || "User" });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setOtherUser({ name: otherUserName || "User" });
      }
    };

    fetchOtherUser();

    // Subscribe to messages
    const unsubscribe = subscribeToMessages(user.uid, otherUserId, (newMessages) => {
      setMessages(newMessages);
      // Mark messages as read
      markMessagesAsRead(user.uid, otherUserId, user.uid).catch(console.error);
    });

    return () => {
      unsubscribe();
    };
  }, [open, user, otherUserId, otherUserName]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    setLoading(true);
    try {
      await sendMessage({
        senderId: user.uid,
        receiverId: otherUserId,
        content: message.trim(),
      });
      setMessage("");
      toast.success("Message sent");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-white/10 text-white flex flex-col h-[600px] max-w-md">
        <DialogHeader className="border-b border-white/10 pb-3">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-semkat-orange" />
            {otherUser?.name || "Message"}
          </DialogTitle>
        </DialogHeader>

        {/* Messages container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto space-y-3 py-4 px-2"
        >
          {messages.length === 0 ? (
            <div className="text-center text-white/50 py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.senderId === user.uid;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      isOwn
                        ? "bg-semkat-orange text-white"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? "text-white/70" : "text-white/50"}`}>
                      {msg.createdAt?.toDate?.().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <form onSubmit={handleSend} className="border-t border-white/10 pt-3">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              disabled={loading}
            />
            <Button
              type="submit"
              variant="hero"
              size="icon"
              disabled={loading || !message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDialog;
