"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

const Filters = ({
  filters,
}: {
  filters: {
    name: string;
    value: string;
  }[];
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const active = searchParams.get("filter") ?? "";

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // clicking the active filter again clears it
    if (active === value) {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }
    params.delete("page");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === filter.value
              ? "dark:hover:bg-dark-400 bg-primary-100 text-myPrimary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          }`}
          onClick={() => handleFilter(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default Filters;
