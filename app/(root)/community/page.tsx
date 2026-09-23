import { Metadata } from "next";
import Link from "next/link";

import CustomPagination from "@/components/global/CustomPagination";
import Filters from "@/components/global/Filters";
import MobileFilters from "@/components/global/MobileFilters";
import Searchbar from "@/components/Searchbar";
import UserCard from "@/components/UserCard";
import { UserFilters } from "@/constants/filters";
import { getUsers, USERS_PAGE_SIZE } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Community | StudyBlog",
};

const Page = async ({
  searchParams,
}: {
  searchParams: {
    page?: string;
    filter?: string;
    q?: string;
  };
}) => {
  const { users, total, pageNo } = await getUsers({
    q: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Searchbar
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Users"
          otherClasses="flex-1"
        />
        <MobileFilters
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <Filters filters={UserFilters} />

      <div className="mt-12">
        {users.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>{searchParams.q ? "No users match your search" : "No users yet"}</p>
            <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
              Join to be the first!
            </Link>
          </div>
        )}
      </div>
      <div className="mt-10">
        <CustomPagination
          page={pageNo}
          total={total}
          pageSize={USERS_PAGE_SIZE}
        />
      </div>
    </>
  );
};

export default Page;
