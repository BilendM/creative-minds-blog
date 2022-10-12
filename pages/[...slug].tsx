import Message from "../components/Message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

const Slug = () => {
  const route = useRouter();
  const routeData = route.query as any;
  const [message, setMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<any[]>([]);
  // Submit message
  const submitMessage = async () => {
    if (!auth.currentUser) {
      return route.push("/auth/login");
    }
    if (!message) {
      return toast.error("Message is required", {
        pauseOnHover: false,
        autoClose: 1500,
      });
    }
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth?.currentUser?.photoURL,
        username: auth.currentUser.displayName,
        timestamp: Timestamp.now(),
      }),
    });
    setMessage("");
    // getComments();
  };
  // Get all messages
  const getComments = async () => {
    if (routeData.id) {
      // Snapshot version
      const docRef = doc(db, "posts", routeData.id);
      const unsub = onSnapshot(docRef, (snapshot) => {
        setAllMessages(snapshot.data()?.comments);
      });
      return unsub;
      // const docRef = doc(db, "posts", routeData?.id);
      // const docSnap = await getDoc(docRef);
      // setAllMessages(docSnap.data()?.comments);
    } else {
      route.push("/");
    }
  };
  useEffect(() => {
    if (!route.isReady) return;
    getComments();
    return () => {
      getComments();
    };
  }, [routeData?.id, route.isReady]);
  return (
    <div>
      <Message {...routeData} />
      <div className="my-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            placeholder="Send a message"
            onChange={(e) => setMessage(e.target.value)}
            className="bg-gray-800 w-full p-2 text-white text-sm"
          />
          <button
            onClick={submitMessage}
            className="bg-cyan-500 text-white py-2 px-4 text-sm"
          >
            Submit
          </button>
        </div>
      </div>
      <div className="py-6">
        <h2 className="font-bold ">Comments</h2>
        {allMessages?.map((message, index) => (
          <div className="bg-white p-4 my-4 border-2" key={index}>
            <div className="flex items-center gap-2 mb-4">
              {message.avatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="w-10 rounded-full"
                  src={message.avatar}
                  alt="User Image"
                />
              )}
              <h2>{message.username}</h2>
            </div>
            <h2>{message.message}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slug;
