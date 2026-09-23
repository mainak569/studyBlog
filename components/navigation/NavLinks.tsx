"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";

// Sidebar links shared by the desktop sidebar and the mobile menu
const NavLinks = ({
  isMobile = false,
  onNavigate,
}: {
  isMobile?: boolean;
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <>
      {sidebarLinks.map((item) => {
        let route = item.route;

        // the profile link points at the signed-in user's profile
        if (item.route === "/profile") {
          if (!userId) return null;
          route = `/profile/${userId}`;
        }

        const active =
          (pathname.startsWith(route) && route.length > 1) ||
          pathname === route;

        return (
          <Link
            href={route}
            key={item.route}
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-start gap-4 bg-transparent p-4 hover:primary-gradient hover:text-light-900 rounded-lg",
              active
                ? "primary-gradient rounded-lg text-light-900"
                : "text-dark300_light900"
            )}
          >
            {active ? (
              <item.active className="size-8" />
            ) : (
              <item.icon className="size-8" />
            )}
            <p
              className={cn(
                !isMobile && "max-lg:hidden",
                active ? "base-bold" : "base-medium"
              )}
            >
              {item.label}
            </p>
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;
