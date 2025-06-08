import Link from "next/link";
import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <HomeLayout>
      <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
        <div className="flex items-center justify-center flex-col mt-8">
          <Image
            className="rounded-2xl overflow-hidden"
            src="/placeholder.svg"
            width={260}
            height={260}
            alt="Not found"
          />
          <h1 className="text-4xl font-bold m-0">404</h1>
          <h2 className="text-lg font-semibold m-0">Not Found</h2>
          <p className="mb-8">Could not find requested resource</p>
          <Button asChild size={"lg"}>
            <Link href="/">
              <HomeIcon size="4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </HomeLayout>
  );
}
