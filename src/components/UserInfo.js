import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Avatar } from "@mui/material";

function UserInfo() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState("");

  const fetchUserData = async () => {
    if (user) {
      try {
        const ref = doc(db, "users", user.uid);
        const docSnap = await getDoc(ref);
        setUserData(docSnap.data());
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching USERINFO user data");
      }
    }
  };

  useEffect(() => {
    if (loading) return;
    // if (!user) return navigate("/login");
    fetchUserData();
  }, [user, loading]);

  return (
    <div className="userInfo">
      <div>
        {user ? (
          <div className="userInfo_in">
            <div className="userInfo_name">
              <h3>Logged in as {userData.name}</h3>
            </div>
            <div className="userInfo_body">
              {" "}
              <ul>
                <li>
                  <Avatar src={userData.avatar} />
                </li>
                <li>email: {user.email}</li>
                <li>
                  <Link to={`/profile/${userData.username}`}>
                    @{userData.username}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="userInfo_in_logout">
              <button className="logout_btn" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="userInfo_out">
            You are not currently logged in...kinda cringe? You should{" "}
            <Link to="/login">login</Link> or{" "}
            <Link to="/register">register</Link> right now tbh
          </div>
        )}
      </div>
    </div>
  );
}

export default UserInfo;
