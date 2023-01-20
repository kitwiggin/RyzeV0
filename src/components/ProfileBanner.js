import React, { useEffect, useState, useCallback } from "react";
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
  onSnapshot,
} from "firebase/firestore";
import { Avatar, Button } from "@mui/material";
import {
  Add,
  AttachMoney,
  Cancel,
  ModeEdit,
  PortableWifiOff,
  UnfoldLessTwoTone,
  Close,
} from "@mui/icons-material";
import { useAuthState } from "react-firebase-hooks/auth";
import EditProfile from "./EditProfile";
import FollowInfo from "./FollowInfo";
import "../style/ProfileBanner.css";

function ProfileBanner() {
  const [profileInfo, setProfileInfo] = useState("");
  const [followed, setFollowed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [editing, setEditing] = useState(false);
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [currUsername, setCurrUsername] = useState(username);
  const [avatar, setAvatar] = useState("");
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [runProfileUpdate, setRunProfileUpdate] = useState(false);

  useEffect(() => {
    if (loading) return;
    // if (!user) return navigate("/login");
    fetchProfile();

    // fetchFollowerInfo();

    // const fetchData = async () => {
    //   await fetchProfile();
    //   await fetchFollowerInfo();
    // };

    // try {
    //   fetchData();
    // } catch (err) {
    //   console.log("error with fetch data in profileBanner useEffect");
    //   console.log(err);
    // }

    // fetchProfile().then(fetchFollowerInfo());

    /// Feel like useCallback around fetchProfile and including it in here might be something to explore
    // }, [fetchProfile, user, loading]);
  }, [runProfileUpdate, user, loading, username]);

  // const fetchProfile = useCallback(async () => {
  const fetchProfile = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const profileDoc = await getDocs(q);
      setProfileInfo(profileDoc.docs[0].data());

      if (profileDoc.docs[0].exists()) {
        const followingID = user.uid + "_" + profileDoc.docs[0].data().uid;
        const ref = doc(db, "following", followingID);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          setFollowed(true);
          setSubscribed(docSnap.data().subscribed);
        }
      }

      fetchFollowerInfo();
    } catch (err) {
      console.log("No such document for username:" + username);
      console.log(err);
      console.log(err.message);
    }
    // }, []);
  };

  const fetchFollowerInfo = async () => {
    if (profileInfo) {
      try {
        const qFollowing = query(
          collection(db, "following"),
          where("followingUID", "==", profileInfo.uid)
        );
        onSnapshot(qFollowing, (snapshot) => {
          setFollowing(snapshot.docs.map((doc) => doc.data().followedUID));
        });
        const qFollowers = query(
          collection(db, "following"),
          where("followedUID", "==", profileInfo.uid)
        );
        onSnapshot(qFollowers, (snapshot) => {
          setFollowers(snapshot.docs.map((doc) => doc.data().followingUID));
        });
      } catch (err) {
        console.log("Trouble getting the followerInfo for" + username);
        console.log(err);
        console.log(err.message);
      }
    } else {
      setRunProfileUpdate(!runProfileUpdate);
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
    // what does this actually do?
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
    setRunProfileUpdate(!runProfileUpdate);
    // Close editing container
    setEditing(false);
  };

  const clickFollowers = async (e) => {
    console.log("clicked followers");
    console.log(followers);
    setShowFollowers(true);
  };

  const clickFollowing = async (e) => {
    console.log("clicked following");
    console.log(following);
    setShowFollowing(true);
  };

  // Why do the 'different user' follow/sub buttons briefly show up
  // when viewing logged in profile...?
  // This is definitely not secure enough to stop someone editing someone else's profile...
  return (
    <div className="ProfileBanner">
      <div className="profile-info">
        <div className="avatar-name">
          <Avatar src={profileInfo.avatar} className="large-avatar" />
          <div className="name">
            <h2>{profileInfo.name}</h2>
          </div>
        </div>
        {followers && following ? (
          <div className="follow-info">
            {/* <h4 onClick={() => clickFollowers()}>
              Followers: {followers.length}
            </h4> */}
            <FollowInfo title="Followers" UIDList={followers} />
            <FollowInfo title="Following" UIDList={following} />
            {/* <h4 onClick={() => clickFollowing()}>
              Following: {following.length}
            </h4> */}
          </div>
        ) : (
          <></>
        )}
      </div>
      {/* {showFollowers && (
        <div className="followers-popup">
          <div className="close-btn">
            <button onClick={() => setShowFollowers(false)}>
              <Close />
            </button>
          </div>
          <ul>
            {["kev", "steve", "bob", "emily", "nick", "jolene"].map(
              (follower) => (
                <li key={follower}>{follower}</li>
              )
            )}
          </ul>
        </div>
      )} */}
      {/* {showFollowing && (
        <div className="followers-popup">
          <div className="close-btn">
            <button onClick={() => setShowFollowing(false)}>
              <Close />
            </button>
          </div>
          <ul>
            {["kev", "steve", "bob", "emily", "nick", "jolene"].map(
              (follower) => (
                <li key={follower}>{follower}</li>
              )
            )}
          </ul>
        </div>
      )} */}
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
      {/* {editing ? <EditProfile profileInfo={profileInfo} /> : <></>} */}
    </div>
  );
}

export default ProfileBanner;
