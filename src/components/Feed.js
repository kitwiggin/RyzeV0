import React, { useEffect, useState } from "react";
import "../style/Feed.css";
import Post from "./Post";
import TweetBox from "./TweetBox";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    try {
      onSnapshot(collection(db, "posts"), (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
    } catch (e) {
      console.error("Error reading snapshot: ", e);
    }
  }, []);

  // Tweets have no order, bit embarassing
  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>
      <TweetBox />
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

export default Feed;
