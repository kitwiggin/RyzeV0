import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { Avatar, Button } from "@mui/material";
import { Add, AttachMoney, Cancel, ModeEdit } from "@mui/icons-material";
import { useAuthState } from "react-firebase-hooks/auth";

function ProfileBanner() {
  const [profileInfo, setProfileInfo] = useState("");
  const [followed, setFollowed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [editing, setEditing] = useState(false);
  const { username } = useParams();
  const [user, loading, error] = useAuthState(auth);

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
      const doc = await getDocs(q);
      setProfileInfo(doc.docs[0].data());
    } catch (err) {
      console.log("No such document for username:" + username);
    }
  };

  const clickFollow = async (e) => {
    e.preventDefault();
    setFollowed(!followed);
  };

  const clickSubscribe = async (e) => {
    e.preventDefault();
    setSubscribed(!subscribed);
  };

  const clickEdit = async (e) => {
    e.preventDefault();
    setEditing(!editing);
  };

  // Why do the logged out follow/sub buttons briefly show up...?
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
                  Edit Profile
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
        <h3>Log in to see user info</h3>
      )}
      {editing ? (
        <div className="profile_editing">
          Editing Profile TODO: copy register_container... separate component?
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ProfileBanner;
