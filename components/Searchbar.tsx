"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

interface SearchbarProps {
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const Searchbar = ({
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: SearchbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") ?? "";

  const [search, setSearch] = useState(query);

  useEffect(() => {
    // only update the URL when the input differs from it
    if (search === query) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set("q", search);
      } else {
        params.delete("q");
      }
      // new search results start from the first page
      params.delete("page");

      const newQuery = params.toString();
      router.push(newQuery ? `${pathname}?${newQuery}` : pathname, {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, query, pathname, router, searchParams]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default Searchbar;
