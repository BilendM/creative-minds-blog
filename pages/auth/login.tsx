import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

const Login = () => {
  const route = useRouter();
  const [user, loading, error] = useAuthState(auth);

  // Sign in with google
  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      route.push("/");
    } else {
      console.log("Login");
    }
  }, [user, route]);

  return (
    <div className="shadow-xl mt-32 max-w-[600px] mx-auto p-10 text-gray-700 rounded-lg">
      <h2 className="text-2xl font-medium">Join Today</h2>
      <div className="py-4">
        <h3 className="py-4">Sign in with one of the providers</h3>
        <button
          onClick={signInWithGoogle}
          className="text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2"
        >
          <FcGoogle className="text-2xl" /> Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
