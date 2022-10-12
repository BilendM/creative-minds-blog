import Image from "next/image";

interface MessageProps {
  description: string;
  avatar: string;
  username: string;
  children?: React.ReactNode;
}

const Message = ({ children, avatar, description, username }: MessageProps) => {
  return (
    <div className="bg-white p-8 border-b-2 rounded-lg font-light">
      <div className="flex items-center gap-2">
        {avatar && (
          <Image
            width={35}
            height={35}
            src={avatar}
            alt="User Image"
            className="w-10  rounded-full"
          />
        )}

        <h2 className="">{username}</h2>
      </div>
      <div className="py-4">
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
};

export default Message;
