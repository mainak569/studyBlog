"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { SignedOut } from "@clerk/nextjs";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import NavLinks from "@/components/navigation/NavLinks";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          aria-label="Open menu"
        >
          <Menu className="text-dark100_light900 size-7" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light900_dark200 flex flex-col overflow-y-auto border-none"
      >
        <SheetTitle asChild>
          <Link href="/" onClick={close} className="flex items-center gap-1">
            <Image src="/favicon.ico" width={23} height={23} alt="StudyBlog" />
            <p className="h2-bold font-spaceGrotesk text-dark100_light900">
              Study<span className="text-myPrimary-500">Blog</span>
            </p>
          </Link>
        </SheetTitle>
        <nav className="mt-8 flex flex-1 flex-col gap-3">
          <NavLinks isMobile onNavigate={close} />
        </nav>
        <SignedOut>
          <div className="flex flex-col gap-3">
            <Link href="/sign-in" onClick={close}>
              <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                <span className="primary-text-gradient">Sign In</span>
              </Button>
            </Link>
            <Link href="/sign-up" onClick={close}>
              <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                Sign Up
              </Button>
            </Link>
          </div>
        </SignedOut>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
