import { Ellipsis } from "lucide-react";
import AvatarUser from "./UserAvatar";

const GroupChatAvatar = ({ participants, type }) => {
  const avatar = [];
  const limit = Math.min(participants.length, 4);

  for (let i = 0; i < limit; i++) {
    const member = participants[i];
    avatar.push(
      <AvatarUser
        key={i}
        type={type}
        name={member.userId.displayName}
        avatarUrl={member.userId.avatarUrl ?? undefined}
      />,
    );
  }

  return (
    <>
      <div className="relative flex -space-x-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:ring-2">
        {participants.length <= limit ? (
          <>{avatar}</>
        ) : (
          <>
            {avatar}
            <div className="z-10 flex items-center justify-center rounded-full size-8 bg-muted ring-2 ring-background text-muted-foreground">
              <Ellipsis className="size-4" />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GroupChatAvatar;
