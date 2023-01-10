import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  collection,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Avatar, Button } from "@mui/material";
import {
  Add,
  AttachMoney,
  Cancel,
  ModeEdit,
  PortableWifiOff,
  UnfoldLessTwoTone,
} from "@mui/icons-material";
import { useAuthState } from "react-firebase-hooks/auth";
import EditProfile from "./EditProfile";

function ProfileBanner() {
  const [profileInfo, setProfileInfo] = useState("");
  const [followed, setFollowed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [editing, setEditing] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState(profileInfo.name);
  const [currUsername, setCurrUsername] = useState(username);
  const [avatar, setAvatar] = useState(profileInfo.avatar);

  useEffect(() => {
    if (loading) return;
    // if (!user) return navigate("/login");
    // fetchUserData();
    fetchProfile();
  }, [profileInfo, user, loading]);

  const fetchProfile = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const profileDoc = await getDocs(q);
      setProfileInfo(profileDoc.docs[0].data());

      if (profileDoc.docs[0].exists()) {
        const followingID = user.uid + "_" + profileInfo.uid;
        const ref = doc(db, "following", followingID);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          setFollowed(true);
          setSubscribed(docSnap.data().subscribed);
        }
      }
    } catch (err) {
      console.log("No such document for username:" + username);
      console.log(err);
      console.log(err.message);
    }
  };

  /// Follow/unfollow stuff
  // Follow/unfollow - unfollowing will also unscubscribe
  // subscribe/unsubscribe just updates field in following document
  const clickFollow = async (e) => {
    e.preventDefault();
    if (!followed) {
      await follow(false);
    } else {
      await unFollow();
      setSubscribed(false);
    }
    setFollowed(!followed);
  };

  const clickSubscribe = async (e) => {
    e.preventDefault();
    if (!subscribed) {
      await follow(true);
    } else {
      await follow(false);
    }
    setSubscribed(!subscribed);
  };

  // Add numFollower increment
  const follow = async (subscribing) => {
    const followID = user.uid + "_" + profileInfo.uid;
    await setDoc(doc(db, "following", followID), {
      followedUID: profileInfo.uid,
      followingUID: user.uid,
      subscribed: subscribing,
    });
  };

  const unFollow = async () => {
    const followID = user.uid + "_" + profileInfo.uid;
    await deleteDoc(doc(db, "following", followID));
  };

  const clickEdit = async (e) => {
    e.preventDefault();
    // Set name and avatar equal to profileInfo here so it only happens once
    // when edit is clicked
    if (!editing) {
      setName(profileInfo.name);
      setAvatar(profileInfo.avatar);
    }
    setEditing(!editing);
  };

  // This is very WIP
  const makeEdit = async (e) => {
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        name: name,
        username: currUsername,
        avatar: avatar,
      });
      if (currUsername != username)
        navigate("/profile/" + currUsername, { replace: true });
    } catch (err) {
      console.error(err);
      alert("An error occured while updating user data");
    }
    // Close editing container
    setEditing(false);
  };

  // Why do the 'different user' follow/sub buttons briefly show up
  // when viewing logged in profile...?
  // This is definitely not secure enough to stop someone editing someone else's profile...
  return (
    <div className="profileBanner">
      <div className="profileInfo">
        <div className="profileAvatar">
          <Avatar src={profileInfo.avatar} />
        </div>
        <div className="profileHeader">
          <h3>{profileInfo.name}</h3>
        </div>
        <div className="followInfo">
          <span>Followers: {profileInfo.numFollowers}</span>
          <span>Following: {profileInfo.numFollowing}</span>
        </div>
      </div>
      {user ? (
        <div className="profileInfo_logged">
          {profileInfo && profileInfo.uid == user.uid ? (
            <div className="profileInfo_in">
              <form>
                <Button
                  onClick={clickEdit}
                  type="submit"
                  className="edit__button"
                  variant="outlined"
                  endIcon={<ModeEdit />}
                >
                  {editing ? "Close editing" : "Edit Profile"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="profileInfo_out">
              <form>
                <Button
                  onClick={clickFollow}
                  type="submit"
                  className="follow__button"
                  variant="outlined"
                  endIcon={followed ? <Cancel /> : <Add />}
                >
                  {followed ? "Unfollow" : "Follow"}
                </Button>
                <Button
                  onClick={clickSubscribe}
                  type="submit"
                  className="subscribe__button"
                  variant="outlined"
                  endIcon={subscribed ? <Cancel /> : <AttachMoney />}
                >
                  {subscribed ? "Unsubscribe" : "Subscribe"}
                </Button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <h3>Log in to see user profile info</h3>
      )}
      {editing ? (
        <div className="profile_editing">
          Editing Profile TODO: copy register_container... separate component?
          <div className="register__container">
            Full name:
            <input
              type="text"
              className="register__textBox"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
            Username:
            <input
              type="text"
              className="register__textBox"
              value={currUsername}
              onChange={(e) => setCurrUsername(e.target.value)}
              placeholder="Username"
            />
            Avatar:
            <input
              type="text"
              className="register__textBox"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Avatar URL"
            />
            <button className="register__btn" onClick={makeEdit}>
              Edit
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ProfileBanner;
