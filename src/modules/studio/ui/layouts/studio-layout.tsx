import { MobileFooter } from "@/components/mobile-footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudioNavBar } from "@/modules/studio/ui/components/studio-navbar";
import { StudioSidebar } from "@/modules/studio/ui/components/studio-sidebar";

interface StudioLayoutProps {
  children: React.ReactNode;
}

export const StudioLayout = ({ children }: StudioLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavBar />
        <div className="flex min-h-screen md:pt-[4rem]">
          <StudioSidebar />
          <main className="flex-1 overflow-y-auto md:py-0 pt-14 pb-6">
            {children}
          </main>
        </div>
        <MobileFooter />
      </div>
    </SidebarProvider>
  );
};
