import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import vercelLogo from "../public/vercel.svg";

const Nav = () => {
  const [user, loading, error] = useAuthState(auth);

  const picture = user?.photoURL || vercelLogo;

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-lg font-medium">Creative Minds</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href="/auth/login">
            <a className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg font-medium ml-8">
              Join now
            </a>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button className="font-medium bg-cyan-500 text-white py-2 px-4 rounded-md text-sm">
                Post
              </button>
            </Link>
            <Link href="/dashboard">
              <div style={{ height: "35px" }}>
                <Image
                  height={35}
                  width={35}
                  className="w-9 h-9 rounded-full cursor-pointer"
                  src={picture}
                  alt="User Profile Image"
                />
              </div>
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
