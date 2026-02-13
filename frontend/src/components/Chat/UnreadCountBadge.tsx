import { Badge } from "../ui/badge";

const UnreadCountBadge = ({ unreadCount }) => {
  return (
    <>
      <div className="absolute z-20 pulse-ring -top-1 -right-1">
        <Badge className="text-xs border size-5 bg-gradient-chat border-background">
          {unreadCount > 9 ? "9+" : unreadCount}
        </Badge>
      </div>
    </>
  );
};

export default UnreadCountBadge;
