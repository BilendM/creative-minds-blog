import { auth, db } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Message from "../components/Message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

const Dashboard = () => {
  const route = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [posts, setPosts] = useState<any>([]);
  // See if user is logged in
  const getData = async () => {
    if (loading) {
      return;
    }
    if (!user) {
      route.push("/auth/login");
    }
    if (user) {
      const collectionRef = collection(db, "posts");
      const q = query(
        collectionRef,
        where("user", "==", user?.uid),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any))
        );
      });
      return unsubscribe;
    }
  };

  // Delete Post
  const deletePost = async (id: string) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  // Get User data
  useEffect(() => {
    getData();
    return () => {
      getData();
    };
  }, [user, loading]);
  return (
    <div>
      <h1>Your Posts</h1>
      <div>
        {posts?.map((post: any) => (
          <Message key={post.id} {...post}>
            <div className="flex gap-4">
              <button
                onClick={() => deletePost(post.id)}
                className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
              >
                <BsTrash2Fill className="text-lg" />
                Delete
              </button>
              <Link href={{ pathname: "/post", query: post }}>
                <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                  <AiFillEdit className="text-lg" />
                  Edit
                </button>
              </Link>
            </div>
          </Message>
        ))}
      </div>
      <button
        className="font-medium text-white bg-gray-800 py-2 px-4 rounded-lg my-6"
        onClick={() => signOut(auth)}
      >
        Sign out
      </button>
    </div>
  );
};

export default Dashboard;
