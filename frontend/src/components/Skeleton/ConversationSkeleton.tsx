import { Card } from "../ui/card";

const ConversationSkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="p-3 border-none glass animate-pulse">
          <div className="flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="rounded-full size-10 bg-muted" />

            {/* Info skeleton */}
            <div className="flex-1 space-y-2">
              <div className="w-1/2 h-3 rounded bg-muted" />
              <div className="w-3/4 h-3 rounded bg-muted" />
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export default ConversationSkeleton;
