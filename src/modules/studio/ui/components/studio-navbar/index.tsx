import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { StudioUploadModal } from "../studio-upload-modal";

export const StudioNavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center w-full px-2 pr-5 z-50 border-bottom">
      <div className="hidden md:block">
        <SidebarTrigger className="rounded-full p-5" />
      </div>
      <div className="flex items-center gap-2">
        {/* Menu and logo */}
        <Link prefetch href="/studio">
          <div className="p-4 flex items-center gap-1">
            <Image src="/logo.svg" alt="logo" width={36} height={36} />
            <p className="text-xl font-semibold tracking-tight">Studio</p>
          </div>
        </Link>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      <div className="flex-shrink-0 items-center flex gap-4">
        <StudioUploadModal />
        <div className="hidden md:block">
          <AuthButton />
        </div>
      </div>
      <div className="block md:hidden">
        <SidebarTrigger className="rounded-full p-5" />
      </div>
    </nav>
  );
};
