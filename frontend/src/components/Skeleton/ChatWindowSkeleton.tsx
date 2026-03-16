import { SidebarInset } from "../ui/sidebar";

const ChatWindowSkeleton = () => {
  return (
    <SidebarInset className="flex w-full h-full bg-transparent">
      <div className="flex items-center justify-center flex-1 rounded-2xl bg-card">
        <div className="space-y-4 text-center animate-pulse">
          <div className="mx-auto rounded-full size-40 bg-muted/70 dark:bg-muted/40" />
          <div className="h-6 mx-auto rounded w-72 bg-muted/70 dark:bg-muted/40" />
          <div className="h-4 mx-auto rounded w-52 bg-muted/70 dark:bg-muted/40" />
        </div>
      </div>
    </SidebarInset>
  );
};

export default ChatWindowSkeleton;
