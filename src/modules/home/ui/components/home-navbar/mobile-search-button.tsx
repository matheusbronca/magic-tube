"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SearchInput } from "./search-input";
import { SearchIcon } from "lucide-react";

export const MobileSearchInput = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="border-none shadow-none">
          <SearchIcon className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-center">
            <DrawerTitle>Browse and discover</DrawerTitle>
            <SearchInput />
          </DrawerHeader>
          <div className="">
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
