import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type ContextType = {
  isChangeThumbnailOpen: boolean;
  setIsChangeThumbnailOpen: React.Dispatch<SetStateAction<boolean>> | undefined;
  isGenerateThumbnailOpen: boolean;
  setIsGenerateThumbnailOpen:
    | React.Dispatch<SetStateAction<boolean>>
    | undefined;
  isShareModalOpen: boolean;
  setIsShareModalOpen: React.Dispatch<SetStateAction<boolean>> | undefined;
};

const Context = createContext<ContextType>({
  isChangeThumbnailOpen: false,
  setIsChangeThumbnailOpen: undefined,
  isGenerateThumbnailOpen: false,
  setIsGenerateThumbnailOpen: undefined,
  isShareModalOpen: false,
  setIsShareModalOpen: undefined,
});

export const VideoModalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isChangeThumbnailOpen, setIsChangeThumbnailOpen] = useState(false);
  const [isGenerateThumbnailOpen, setIsGenerateThumbnailOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <Context.Provider
      value={{
        isChangeThumbnailOpen,
        setIsChangeThumbnailOpen,
        isGenerateThumbnailOpen,
        setIsGenerateThumbnailOpen,
        isShareModalOpen,
        setIsShareModalOpen,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useVideoModal = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error(
      "useVideoFormContext must be used inside VideoFormContextProvider",
    );
  }

  return context;
};
