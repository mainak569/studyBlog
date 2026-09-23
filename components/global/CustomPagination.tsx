"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// `page` is 0-based and matches the "?page=" search param
const CustomPagination = ({
  page,
  total,
  pageSize = 10,
}: {
  page: number;
  total: number;
  pageSize?: number;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasPrevious = page > 0;
  const hasNext = page + 1 < totalPages;

  if (!hasPrevious && !hasNext) return null;

  const goToPage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNumber <= 0) {
      params.delete("page");
    } else {
      params.set("page", pageNumber.toString());
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <Pagination>
      <PaginationContent>
        {hasPrevious && (
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious onClick={() => goToPage(page - 1)} />
          </PaginationItem>
        )}
        <PaginationItem>
          <span className="body-medium text-dark400_light800 px-4">
            Page {page + 1} of {totalPages}
          </span>
        </PaginationItem>
        {hasNext && (
          <PaginationItem className="cursor-pointer">
            <PaginationNext onClick={() => goToPage(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
