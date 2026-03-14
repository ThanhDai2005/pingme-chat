import { SidebarInset } from "../ui/sidebar";

const ChatWindowSkeleton = () => {
  return (
    <SidebarInset className="flex w-full h-full bg-transparent animate-pulse">
      <div className="flex items-center justify-center flex-1 bg-primary-foreground rounded-2xl">
        <div className="space-y-4 text-center">
          <div className="mx-auto mb-6 rounded-full shadow-inner size-42 bg-muted" />
          <div className="h-10 mx-auto rounded w-96 bg-muted" />
          <div className="h-8 mx-auto rounded w-72 bg-muted" />
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWindowSkeleton;
