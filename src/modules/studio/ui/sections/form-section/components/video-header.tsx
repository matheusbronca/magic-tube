import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon, RotateCcwIcon, TrashIcon } from "lucide-react";
import { useVideoFormContext } from "../context/video-form-section-context";
import { SaveButton } from "./video-form/save-button";

export const VideoHeader = () => {
  const {
    videoId,
    actions: { revalidate, remove },
  } = useVideoFormContext();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">Video details</h1>
        <p className="text-xs text-muted-foreground">
          Manage your video details
        </p>
      </div>
      <div className="flex items-center gap-x-2">
        <SaveButton className="min-w-20" />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size="icon">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => revalidate.mutate({ id: videoId })}
            >
              <RotateCcwIcon className="size-4 mr-2" />
              Revalidate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => remove.mutate({ id: videoId })}>
              <TrashIcon className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
