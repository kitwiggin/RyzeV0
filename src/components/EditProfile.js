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
// import { useAuthState } from "react-firebase-hooks/auth";

function EditProfile({ profileInfo }) {
  const [name, setName] = useState(profileInfo.name);
  const [currUsername, setCurrUsername] = useState(profileInfo.username);
  const [avatar, setAvatar] = useState(profileInfo.avatar);
  const { username } = useParams();
  const navigate = useNavigate();

  // This is very WIP
  const makeEdit = async (e) => {
    try {
      const docRef = doc(db, "users", profileInfo.uid);
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
  };

  return (
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
  );
}

export default EditProfile;
