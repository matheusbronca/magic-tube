import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavBar } from "../components/home-navbar";
import { HomeSidebar } from "../components/home-sidebar";
import { MobileFooter } from "@/components/mobile-footer";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavBar />
        <div className="flex min-h-screen md:pt-[4rem]">
          <HomeSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
        <MobileFooter />
      </div>
    </SidebarProvider>
  );
};
