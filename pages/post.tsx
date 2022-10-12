import { auth, db } from "../utils/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState, useId } from "react";
import { toast } from "react-toastify";

interface Post {
  id?: string;
  description: string;
}

const Post = () => {
  const route = useRouter();
  const routeData = route.query;
  const [user, loading, error] = useAuthState(auth);
  const toastOne = useId();
  const toastTwo = useId();
  // Form state
  const [post, setPost] = useState<Post>({ description: "" });
  // Check user
  const checkUser = async () => {
    if (loading) {
      return;
    }
    if (!user) {
      route.push("/auth/login");
    }
    if (routeData.id) {
      setPost({
        description: routeData.description as string,
        id: routeData.id as string,
      });
    }
  };
  // submit Post
  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    // Run some checks
    if (!post.description) {
      return toast.error("Please add a description", {
        autoClose: 1500,
        pauseOnHover: false,
        toastId: toastOne,
      });
    }
    if (post.description.length > 300) {
      return toast.error("Description too long", {
        autoClose: 1500,
        pauseOnHover: false,
        toastId: toastTwo,
      });
    }
    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id as string);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/");
    } else {
      // Create post
      try {
        const collectionRef = collection(db, "posts");
        await addDoc(collectionRef, {
          ...post,
          timestamp: serverTimestamp(),
          user: user?.uid,
          avatar: user?.photoURL,
          username: user?.displayName,
        });
        toast.success("Post created", {
          autoClose: 1500,
          pauseOnHover: false,
        });
      } catch (error) {
        console.log("error :>> ", error);
      }
      setPost({ ...post, description: "" });
      return route.push("/");
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost} className="">
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty("id") ? "Update Post" : "Create a new Post"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
          ></textarea>
          <p
            className={`text-cyan-600 font-light text-sm ${
              post.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Post;
