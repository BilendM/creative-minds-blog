import Head from "next/head";
import Message from "../components/Message";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Link from "next/link";

interface Post {
  id: string;
  description: string;
  avatar: string;
  username: string;
  user: string;
  timestamp: string;
  comments: any[];
}

export default function Home() {
  // Create a state with all the posts
  const [posts, setPosts] = useState<Post[]>([]);

  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post))
      );
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
    return () => {
      getPosts();
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="my-12 text-lg font-medium">
        <h2 className="">See what other people are saying</h2>
        {posts?.map((post: Post) => (
          <Message key={post.id} {...post}>
            <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
              <button>
                {post?.comments?.length > 0 ? post?.comments?.length : 0}{" "}
                Comments
              </button>
            </Link>
          </Message>
        ))}
      </div>
    </div>
  );
}