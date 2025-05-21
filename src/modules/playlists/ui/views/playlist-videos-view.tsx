import { PlaylistHeaderSection } from "../sections/playlist-header-section";
import { PlaylistVideosSection } from "../sections/playlist-videos-section";

interface PlaylistVideosViewProps {
  playlistId: string;
}

export const PlaylistVideosView = ({ playlistId }: PlaylistVideosViewProps) => {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistHeaderSection playlistId={playlistId} />
      <PlaylistVideosSection playlistId={playlistId} />
    </div>
  );
};
