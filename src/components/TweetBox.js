import React, { useState, useEffect } from "react";
import { Avatar, Button } from "@mui/material";
import { db, auth } from "../firebase";
import "../style/TweetBox.css";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function TweetBox() {
  const [tweetMessage, setTweetMessage] = useState("");
  // Need to make sure images are the right size for display
  const [tweetImage, setTweetImage] = useState("");
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState("");

  const sendTweet = async (e) => {
    e.preventDefault();

    // Feel like it's inefficient to be getting all user data in each component
    // Maybe should get once in app and pass in via props?
    try {
      await addDoc(collection(db, "posts"), {
        username: userData.username,
        displayName: userData.name,
        avatar: userData.avatar,
        verified: userData.verified ? userData.verified : true,
        text: tweetMessage,
        image: tweetImage,
      });
      console.log(user.uid);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setTweetMessage("");
    setTweetImage("");
  };

  const fetchUserData = async () => {
    if (user) {
      try {
        // const q = query(collection(db, "users"), where("uid", "==", user.uid));
        // const doc = await getDocs(q);
        // setUserData(doc.docs[0].data());
        const ref = doc(db, "users", user.uid);
        const docSnap = await getDoc(ref);
        setUserData(docSnap.data());
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user TWEETBOX data");
      }
    }
  };

  useEffect(() => {
    if (loading) return;
    // if (!user) return navigate("/login");
    fetchUserData();
  }, [user, loading]);

  return (
    <div className="tweetBox">
      <form>
        <div className="tweetBox__input">
          {userData.avatar ? <Avatar src={userData.avatar} /> : <></>}

          <input
            placeholder="What's happening?"
            value={tweetMessage}
            onChange={(e) => setTweetMessage(e.target.value)}
            type="text"
            className="tweetBox__imageInput"
          />
        </div>
        <input
          placeholder="Optional: Enter image URL"
          value={tweetImage}
          onChange={(e) => setTweetImage(e.target.value)}
          type="text"
          className="tweetBox__imageInput"
        />
        {user ? (
          <Button
            onClick={sendTweet}
            type="submit"
            className="tweetBox__button"
          >
            Tweet
          </Button>
        ) : (
          <h4>You need to log in to post</h4>
        )}
      </form>
    </div>
  );
}

export default TweetBox;
