import React, { useState, useEffect } from "react";
import { FavoriteBorder, Favorite } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import "../style/PostLike.css";

function PostLike({ postID, likers }) {
  const [user, loading] = useAuthState(auth);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (loading) return;
    setLiked(likers.includes(user.uid));
    console.log("liked? " + liked);
  }, [user, loading]);

  const toggleLike = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        setLiked(!liked);
        if (liked) {
          const postRef = doc(db, "posts", postID);
          await updateDoc(postRef, { likers: arrayRemove(user.uid) });
        } else {
          const postRef = doc(db, "posts", postID);
          await updateDoc(postRef, { likers: arrayUnion(user.uid) });
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while attempting to like/unlike a post");
      }
    } else {
      console.log("Can't interact with a post if you're not logged in!");
      return;
    }
  };

  return (
    <div className="postlike">
      <IconButton className="postlike_icon" edge="start" onClick={toggleLike}>
        {liked ? (
          <Favorite fontSize="small" />
        ) : (
          <FavoriteBorder fontSize="small" />
        )}
      </IconButton>
      <span className="postlike_count">{likers.length}</span>
    </div>
  );
}

export default PostLike;
