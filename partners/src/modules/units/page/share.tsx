import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";
import { Button } from "@/modules/ui/button";
import { Copy, Check, Laptop } from "lucide-react";
import { toast } from "sonner";
import copy from "copy-to-clipboard";

// Social icons
import facebookIcon from "@/assets/socials/facebook-logo.svg";
import instagramIcon from "@/assets/socials/instagram-logo.svg";
import XIcon from "@/assets/socials/twitter-x-logo.svg";
import linkedInIcon from "@/assets/socials/linkedin-logo.svg";
import whatsappIcon from "@/assets/socials/whatsapp-logo.svg";

interface ShareDialogProps {
  url: string;
  dialogTitle?: string;
  title?: string;
  description?: string;
  trigger: React.ReactNode;
}

const socials = [
  {
    name: "Facebook",
    icon: facebookIcon,
    url: (url: string, _: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  },
  {
    name: "Whatsapp",
    icon: whatsappIcon,
    url: (url: string, title: string) =>
      `https://api.whatsapp.com/send?text=${title}%20${url}`,
  },
  {
    name: "Instagram",
    icon: instagramIcon,
    // Instagram has no web-share API → fallback
    url: () => `https://www.instagram.com/`,
  },
  {
    name: "X",
    icon: XIcon,
    url: (url: string, title: string) =>
      `https://twitter.com/share?url=${url}&text=${title}`,
  },
  {
    name: "LinkedIn",
    icon: linkedInIcon,
    url: (url: string, title: string) =>
      `https://www.linkedin.com/shareArticle?url=${url}&title=${title}`,
  },
];

export function ShareDialog({
  url,
  title,
  description,
  trigger,
  dialogTitle = "Share this channel",
}: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || "");

  const copyToClipboard = () => {
    try {
      copy(url);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareToSocial = (getUrl: (url: string, title: string) => string) => {
    const shareUrl = getUrl(encodedUrl, encodedTitle);
    window.open(
      shareUrl,
      "share-dialog",
      "width=600,height=400,scrollbars=yes,resizable=yes"
    );
    setOpen(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || dialogTitle,
          text: description,
          url,
        });
        setOpen(false);
      } catch (err: any) {
        if (err?.name !== "AbortError") toast.error("Error sharing");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-extrabold text-primary">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2.5">
          {/* Native share + copy link */}
          <div className="flex items-center space-x-2.5">
            <Button size={"sm"} className="w-full" onClick={handleNativeShare}>
              <Laptop className="w-4 h-4" />
              Via system
            </Button>

            <Button
              size={"sm"}
              variant="secondary"
              className="w-full"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          {/* Socials */}
          <div className="flex items-center justify-between">
            {socials.map((s) => (
              <button
                key={s.name}
                className="flex flex-col items-center space-y-2"
                onClick={() => shareToSocial(s.url)}
              >
                <img src={s.icon} alt={s.name} className="w-9 h-9" />
                <span className="text-[10px] font-bold text-primary">
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
