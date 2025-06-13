import { Button } from "@/components/ui/button";
import { APP_URL } from "@/constants";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export const VideoLink = ({ videoId }: { videoId: string | undefined }) => {
  const [isCopied, setIsCopied] = useState(false);

  const fullUrl = `${APP_URL}/videos/${videoId}`;

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    toast.success("Done!", {
      description: "Copied to clipboard",
      descriptionClassName: "!text-muted-foreground",
    });

    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!videoId) return;
  return (
    <div className="flex items-center gap-x-2 bg-blue-100 px-4 pr-0 rounded-lg wrap-anywhere">
      <Link prefetch href={`/videos/${videoId}`}>
        <p className="line-clamp-1 text-sm text-blue-500">{fullUrl}</p>
      </Link>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="shrink-0 !rounded-md border-4 border-blue-100"
        onClick={onCopy}
        disabled={isCopied}
      >
        {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  );
};
