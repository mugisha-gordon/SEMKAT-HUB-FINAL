import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  Send, 
  Phone, 
  X,
  ExternalLink
} from "lucide-react";

interface WhatsAppChatProps {
  agentName: string;
  agentPhone: string;
  propertyTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

const WhatsAppChat = ({ agentName, agentPhone, propertyTitle, isOpen, onClose }: WhatsAppChatProps) => {
  const [message, setMessage] = useState(
    propertyTitle 
      ? `Hi, I'm interested in the property: ${propertyTitle}. Can you provide more information?`
      : `Hi, I'm interested in your listings. Can you help me?`
  );

  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove all non-numeric characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    // If starts with 0, assume Uganda and replace with +256
    if (cleaned.startsWith('0')) {
      cleaned = '+256' + cleaned.substring(1);
    }
    // Remove + for WhatsApp URL
    return cleaned.replace('+', '');
  };

  const openWhatsApp = () => {
    const formattedPhone = formatPhoneForWhatsApp(agentPhone);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Chat Window - Semkat Orange & Sky Blue Theme */}
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-scale-in border-2 border-semkat-orange/30">
        {/* Header - Semkat Orange Gradient */}
        <div className="bg-gradient-hero p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-white">{agentName}</h3>
                <p className="text-white/80 text-sm flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {agentPhone}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat Body - Sky Blue accents */}
        <div className="p-4 space-y-4 bg-background min-h-[200px]">
          {/* Semkat branding notice */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-semkat-sky/10 border border-semkat-sky/30">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-semkat-sky" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-semkat-sky text-xs font-semibold">Chat via WhatsApp</span>
            </div>
          </div>

          {/* Message Preview - Orange accent */}
          <div className="bg-semkat-orange-light rounded-xl p-4 border border-semkat-orange/20">
            <p className="text-muted-foreground text-sm mb-2 font-medium">Your message:</p>
            <p className="text-foreground text-sm">{message}</p>
          </div>

          {/* Message Input - Sky Blue focus */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">Edit your message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full min-h-[100px] bg-card border-2 border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:border-semkat-sky focus:ring-2 focus:ring-semkat-sky/20 resize-none transition-all"
              placeholder="Type your message..."
            />
          </div>
        </div>

        {/* Footer - Semkat Sky Blue Send Button */}
        <div className="p-4 bg-muted/50 border-t border-border">
          <Button
            onClick={openWhatsApp}
            className="w-full bg-gradient-hero hover:opacity-90 text-white font-semibold gap-2 h-12 text-base rounded-xl shadow-lg"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Send via WhatsApp
            <ExternalLink className="h-4 w-4" />
          </Button>
          <p className="text-muted-foreground text-xs text-center mt-3">
            You'll be redirected to WhatsApp to continue the conversation
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChat;
