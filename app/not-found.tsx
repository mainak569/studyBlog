import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="background-light850_dark100 flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="h1-bold text-dark100_light900">Page not found</h1>
      <p className="paragraph-regular text-dark400_light700">
        The page you&apos;re looking for doesn&apos;t exist or was deleted.
      </p>
      <Link href="/">
        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
