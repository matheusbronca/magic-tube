import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { MobileSearchInput } from "./mobile-search-button";
import { StickyHeader } from "@/components/sticky-header";

export const HomeNavBar = () => {
  return (
    <StickyHeader additionalHeight={46}>
      <nav className="h-16 bg-white flex items-center w-full px-2 pr-5 z-50 md:fixed">
        <div className="flex items-center gap-2 md:gap-4 w-full">
          <div className="hidden md:block">
            <SidebarTrigger className="rounded-full p-5" />
          </div>

          {/* Menu and logo */}
          <div className="flex items-center flex-shrink-0">
            <Link prefetch href="/">
              <div className="p-4 pl-1 flex items-center gap-1">
                <Image src="/logo.svg" alt="logo" width={36} height={36} />
                <p className="text-xl font-semibold tracking-tight">
                  MagicTube
                </p>
              </div>
            </Link>
          </div>

          {/* Search bar  */}
          <div className="flex-1 flex justify-end md:justify-center max-w-[720px] mx-auto">
            <div className="hidden md:flex w-full">
              <SearchInput />
            </div>
            <div className="block md:hidden">
              <MobileSearchInput />
            </div>
          </div>
          <div className="flex-shrink-0 items-center gap-4 hidden md:flex">
            <AuthButton />
          </div>
          <div className="block md:hidden">
            <SidebarTrigger className="rounded-full p-5" />
          </div>
        </div>
      </nav>
    </StickyHeader>
  );
};
