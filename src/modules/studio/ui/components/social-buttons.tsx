// Exemplo de SocialShareButtons.jsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { X } from "./social-icons/x";
import { WhatsApp } from "./social-icons/whatsapp";
import { Facebook } from "./social-icons/facebook";
import { LinkedIn } from "./social-icons/linkedin";
import { Instagram } from "./social-icons/instagram";

interface SocialShareButtonsProps {
  videoId: string;
}

export function SocialShareButtons({ videoId }: SocialShareButtonsProps) {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(
    "http://localhost:3000",
    "https://magictube.matheusbronca.com",
  );
  const fullUrl = `${APP_URL}/videos/${videoId}`;

  // URLs de compartilhamento
  const whatsappShareLink = `https://wa.me/?text=${encodeURIComponent(fullUrl)}`;
  // Instagram não possui URL nativa para compartilhamento; usamos ação customizada
  const instagramShareLink = "#";
  const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
  const linkedinShareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
  const xShareLink = `https://x.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent("Confira esse vídeo!")}`;

  return (
    <div className="flex gap-2">
      {/* WhatsApp */}
      <Button
        asChild
        size="icon"
        className="p-0 bg-transparent hover:bg-transparent group"
      >
        <Link
          href={whatsappShareLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsApp className="size-full group-hover:opacity-80" />
        </Link>
      </Button>

      {/* Instagram */}
      <Button
        asChild
        size="icon"
        className="p-0 bg-transparent hover:bg-transparent group"
      >
        <Link
          href={instagramShareLink}
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(fullUrl);
            alert("Link copiado para compartilhar no Instagram!");
          }}
        >
          <Instagram className="size-full group-hover:opacity-80" />
        </Link>
      </Button>

      {/* Facebook */}
      <Button
        asChild
        size="icon"
        className="p-0 bg-transparent hover:bg-transparent group"
      >
        <Link
          href={facebookShareLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="size-full group-hover:opacity-80" />
        </Link>
      </Button>

      {/* LinkedIn */}
      <Button
        asChild
        size="icon"
        className="p-0 bg-transparent hover:bg-transparent group"
      >
        <Link
          href={linkedinShareLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedIn className="size-full group-hover:opacity-80" />
        </Link>
      </Button>

      {/* X (antigo Twitter) */}
      <Button
        asChild
        size="icon"
        className="p-0 bg-transparent hover:bg-transparent group"
      >
        <Link href={xShareLink} target="_blank" rel="noopener noreferrer">
          <X className="size-full group-hover:opacity-80" />
        </Link>
      </Button>
    </div>
  );
}
