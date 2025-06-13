import { SignedIn } from "@clerk/nextjs";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "./main-section";
import { Separator } from "@/components/ui/separator";
import { PersonalSection } from "./personal-section";
import { SubscriptionsSection } from "./subscriptions-section";
import Link from "next/link";
import Image from "next/image";
import { AuthorTag } from "@/components/author-tag";

export const HomeSidebar = () => {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <Link prefetch href="/" className="block md:hidden bg-white">
        <div className="p-4 flex items-center gap-1">
          <Image src="/logo.svg" alt="logo" width={36} height={36} />
          <p className="text-xl font-semibold tracking-tight">MagicTube</p>
        </div>
      </Link>
      <SidebarContent className="bg-background ">
        <MainSection />
        <Separator />
        <PersonalSection />
        <SignedIn>
          <>
            <Separator>
              <SubscriptionsSection />
            </Separator>
          </>
        </SignedIn>

        <div className="mt-auto">
          <AuthorTag />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
