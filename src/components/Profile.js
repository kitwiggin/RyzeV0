import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../style/Feed.css";
import ProfileFeed from "./ProfileFeed";
import ProfileBanner from "./ProfileBanner";
import HeaderBar from "./HeaderBar";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function Profile() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState("");

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
        alert("An error occured while fetching user PROFILE data");
      }
    }
  };

  useEffect(() => {
    if (loading) return;
    // if (!user) return navigate("/login");
    fetchUserData();
  }, [user, loading]);

  return (
    <div className="profile">
      <HeaderBar />
      <ProfileBanner />
      <ProfileFeed />
    </div>
  );
}

export default Profile;
