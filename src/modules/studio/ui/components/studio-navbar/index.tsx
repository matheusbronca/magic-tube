import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { StudioUploadModal } from "../studio-upload-modal";

export const StudioNavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center w-full px-2 pr-5 z-50 border-bottom shadow-md">
      <div className="flex items-center gap-4">
        {/* Menu and logo */}
        <SidebarTrigger />
        <Link href="/studio">
          <div className="p-4 flex items-center gap-1">
            <Image src="/logo.svg" alt="logo" width={32} height={32} />
            <p className="text-xl font-semibold tracking-tight">Studio</p>
          </div>
        </Link>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      <div className="flex-shrink-0 items-center flex gap-4">
        <StudioUploadModal />
        <AuthButton />
      </div>
    </nav>
  );
};
