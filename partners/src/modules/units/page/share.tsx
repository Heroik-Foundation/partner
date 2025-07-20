import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";
import { Button } from "@/modules/ui/button";
import {
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import copy from "copy-to-clipboard";

interface ShareDialogProps {
  url: string;
  dialogTitle?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const ShareDialog = ({
  url,
  title,
  description,
  children,
  dialogTitle = "Share this channel",
}: ShareDialogProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      copy(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const shareToSocial = (
    platform: "facebook" | "twitter" | "linkedin" | "whatsapp"
  ) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title || "");

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/share?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/shareArticle?url=${encodedUrl}&title=${encodedTitle}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    };

    if (shareUrls[platform]) {
      window.open(
        shareUrls[platform],
        "share-dialog",
        "width=600,height=400,scrollbars=yes,resizable=yes"
      );
      setOpen(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
        setOpen(false);
      } catch (error) {
        const err = error as Error;
        if (err.name !== "AbortError") {
          toast.error("Error sharing");
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Native Share (if available) */}
          {navigator.share && typeof navigator.share === "function" && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleNativeShare}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Share via system
            </Button>
          )}

          {/* Copy Link */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </Button>

          {/* Social Platforms */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => shareToSocial("facebook")}
            >
              <Facebook className="w-4 h-4 mr-2 text-blue-600" />
              Share on Facebook
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => shareToSocial("twitter")}
            >
              <Twitter className="w-4 h-4 mr-2 text-sky-500" />
              Share on Twitter
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => shareToSocial("linkedin")}
            >
              <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
              Share on LinkedIn
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => shareToSocial("whatsapp")}
            >
              <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
              Share on WhatsApp
            </Button>
          </div>

          {/* URL Display */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 break-all">{url}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
