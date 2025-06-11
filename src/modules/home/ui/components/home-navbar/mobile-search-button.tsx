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
import { useEffect, useState } from "react";

export const SEARCHED_EVENT = "searched-ev";

export const MobileSearchInput = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleSearchTrigger = () => {
      console.log("RODEI");
      setIsOpen(false);
    };

    window.addEventListener(SEARCHED_EVENT, handleSearchTrigger);
    return () =>
      window.removeEventListener(SEARCHED_EVENT, handleSearchTrigger);
  }, []);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
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
