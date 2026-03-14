import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AvatarUser = ({ type, name, avatarUrl }) => {
  if (!name) {
    name = "moji";
  }

  return (
    <>
      <Avatar
        className={`
    ${type === "sidebar" && "size-12 text-base"}
    ${type === "chat" && "size-8 text-sm"}
    ${type === "profile" && "size-24 text-3xl shadow-lg ring-white ring-4"}
  `}
      >
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback
          className={`text-white font-semibold ${!avatarUrl ? "bg-blue-500" : ""}`}
        >
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </>
  );
};

export default AvatarUser;
