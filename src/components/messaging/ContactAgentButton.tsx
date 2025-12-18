import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import WhatsAppChat from "./WhatsAppChat";

interface ContactAgentButtonProps {
  agentName: string;
  agentPhone: string;
  propertyTitle?: string;
  variant?: "default" | "hero" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const ContactAgentButton = ({ 
  agentName, 
  agentPhone, 
  propertyTitle,
  variant = "hero",
  size = "default",
  className = ""
}: ContactAgentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`gap-2 ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-4 w-4" />
        Contact Agent
      </Button>

      <WhatsAppChat
        agentName={agentName}
        agentPhone={agentPhone}
        propertyTitle={propertyTitle}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default ContactAgentButton;
