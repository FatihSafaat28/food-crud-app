import { Card, CardFooter, CardHeader } from "./card";

interface MenuCardSkeletonProps {
  count?: number;
}

/**
 * Skeleton loader for menu cards
 */
export function MenuCardSkeleton({ count = 5 }: MenuCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="flex flex-col overflow-hidden h-full">
          <div className="h-32 w-full bg-muted animate-pulse" />
          <CardHeader className="pb-2 justify-center text-center">
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded mx-auto mb-2" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded mx-auto" />
          </CardHeader>
          <CardFooter className="mt-auto border-t pt-2 gap-2">
            <div className="h-8 w-full bg-muted animate-pulse rounded" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

interface CategoryCardSkeletonProps {
  count?: number;
}

/**
 * Skeleton loader for category cards
 */
export function CategoryCardSkeleton({ count = 5 }: CategoryCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-10 w-24 bg-muted animate-pulse rounded-lg"
        />
      ))}
    </>
  );
}

interface DetailSkeletonProps {
  className?: string;
}

/**
 * Skeleton loader for detail pages
 */
export function DetailSkeleton({ className }: DetailSkeletonProps) {
  return (
    <div className={`flex h-64 items-center justify-center ${className || ""}`}>
      <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
    </div>
  );
}
