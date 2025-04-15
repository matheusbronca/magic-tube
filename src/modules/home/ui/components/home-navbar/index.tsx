import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";

export const HomeNavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center w-full px-2 pr-5 z-50">
      <div className="flex items-center gap-4">
        {/* Menu and logo */}
        <SidebarTrigger />
        <Link href="/">
          <div className="p-4 flex items-center gap-1">
            <Image src="/logo.svg" alt="logo" width={32} height={32} />
            <p className="text-xl font-semibold tracking-tight">NewTube</p>
          </div>
        </Link>
      </div>

      {/* Search bar  */}
      <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
        <SearchInput />
      </div>
      <div className="flex-shrink-0 items-center flex gap-4">
        <AuthButton />
      </div>
    </nav>
  );
};
