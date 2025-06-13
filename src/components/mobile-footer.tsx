"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  FlameIcon,
  HomeIcon,
  PlaySquareIcon,
  PlusIcon,
  Undo2Icon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { UserIcon, ClapperboardIcon } from "lucide-react";
import {
  UserButton,
  SignInButton,
  SignedIn,
  SignedOut,
  ClerkLoading,
  ClerkLoaded,
  useClerk,
  useAuth,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import PlaySquareFilledIcon from "@/components/icons/play-square-filled";
import HomeFilledIcon from "@/components/icons/home-filled";

const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
    activeIcon: HomeFilledIcon,
  },
  {
    title: "Trending",
    url: "/feed/trending",
    icon: FlameIcon,
  },
  {
    title: "Subscriptions",
    url: "/feed/subscriptions",
    icon: PlaySquareIcon,
    activeIcon: PlaySquareFilledIcon,
    auth: true,
  },
];

type FooterItem = Omit<(typeof items)[number], "activeIcon" | "auth"> & {
  activeIcon?: (typeof items)[number]["activeIcon"];
  auth?: boolean;
};

const FooterItem = ({
  title,
  url,
  icon: Icon,
  activeIcon: ActiveIcon,
  auth,
}: FooterItem) => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const clerk = useClerk();

  const isActive = pathname === url;

  const handleAuth = (e: React.MouseEvent) => {
    if (!auth) return;
    if (isSignedIn) return;
    e.preventDefault();
    clerk.openSignIn();
  };

  return (
    <Button
      asChild
      className={cn(
        "flex flex-col gap-.5 items-center max-w-[48px] text-foregroung bg-transparent shadow-none",
        isActive && !ActiveIcon && "[&_svg]:fill-black",
      )}
      onClick={handleAuth}
    >
      <Link prefetch href={url}>
        {isActive && ActiveIcon ? (
          <ActiveIcon className="size-6 scale-[94%]" />
        ) : (
          <Icon className="size-6" />
        )}
        <div className="text-[10px]">{title}</div>
      </Link>
    </Button>
  );
};

const FooterUserItem = () => {
  const clerk = useClerk();

  if (!clerk.loaded)
    return (
      <Button className="flex flex-col gap-.5 items-center bg-transparent !shadow-none">
        <Image
          src="/user-placeholder.svg"
          width={24}
          height={24}
          alt="Guest user"
        />
        <div className="text-[10px] text-foreground">Sign in</div>
      </Button>
    );

  return (
    <>
      <SignedIn>
        <div className="flex flex-col gap-.5 items-center [&_button]:!size-6 [&_.cl-userButtonTrigger]:!size-6 [&_.cl-avatarBox]:!size-full ">
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Link
                label="My profile"
                href="/users/current"
                labelIcon={<UserIcon className="size-4" />}
              />
              <UserButton.Link
                label="Studio"
                href="/studio"
                labelIcon={<ClapperboardIcon className="size-4" />}
              />
              <UserButton.Action label="manageAccount" />
            </UserButton.MenuItems>
          </UserButton>
          <div className="text-[10px] text-foreground">You</div>
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button className="flex flex-col gap-.5 items-center bg-transparent !shadow-none">
            <Image
              src="/user-placeholder.svg"
              width={24}
              height={24}
              alt="Guest user"
            />
            <div className="text-[10px] text-foreground">Sign in</div>
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};

export const MobileFooter = () => {
  const { isSignedIn } = useAuth();
  const clerk = useClerk();
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const handleAuth = (e: React.MouseEvent) => {
    if (isSignedIn) return;
    e.preventDefault();
    clerk.openSignIn();
  };

  if (!isMobile) return null;
  return (
    <>
      <div className="block min-w-screen min-h-10 h-10 max-h-10" />
      <div
        data-mobile-navigation
        className="pt-2 px-2 fixed bottom-0 left-0 w-screen min-h-[54px] min-w-screen max-w-screen  bg-white flex justify-evenly gap-4 border-muted-foreground border-t border-t-muted-foreground/25 shadow-lg"
      >
        <div className="grid grid-cols-2 items-center gap-6">
          {items.slice(undefined, 2).map((item) => (
            <FooterItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              activeIcon={item.activeIcon}
              url={item.url}
            />
          ))}
        </div>
        <Button
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -mt-1 !p-0 !aspect-square bg-blue-500"
          asChild
          onClick={handleAuth}
        >
          <Link prefetch href={pathname === "/studio" ? "/" : "/studio"}>
            {pathname === "/studio" ? (
              <Undo2Icon className="size-5" />
            ) : (
              <PlusIcon className="size-6" />
            )}
          </Link>
        </Button>
        <div className="size-[20px] bg-transparent -z-10 pointer-events-none" />
        <div className="grid grid-cols-2 items-center gap-6">
          <FooterItem
            auth
            key={items[2].title}
            title={items[2].title}
            icon={items[2].icon}
            activeIcon={items[2].activeIcon}
            url={items[2].url}
          />
          <FooterUserItem />
        </div>
      </div>
    </>
  );
};
