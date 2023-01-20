import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../style/Feed.css";
import Post from "./Post";
import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

// Should keep posts from the same user even if they change their username
function ProfileFeed() {
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    try {
      const q = query(
        collection(db, "posts"),
        where("username", "==", username)
      );
      onSnapshot(q, (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
    } catch (e) {
      console.error("Error reading snapshot: ", e);
    }
  }, []);

  return (
    <div className="feed">
      {posts.map((post) => (
        <Post
          key={post.id}
          displayName={post.data.displayName}
          username={post.data.username}
          verified={post.data.verified}
          text={post.data.text}
          avatar={post.data.avatar}
          image={post.data.image}
        />
      ))}
    </div>
  );
}

export default ProfileFeed;
