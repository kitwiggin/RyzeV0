import React, { useState, useEffect } from "react";
import "../style/HeaderBar.css";
import { Link } from "react-router-dom";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import SearchBar from "./SearchBar";

// Full of placeholders for now - just been putting it together
function HeaderBar() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (loading) return;
    fetchUserData();
  }, [user, loading]);

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

  // Ideally, I would like the dropdown menu to dissapear when anywhere is clicked
  return (
    <div className="navbar">
      <Link to="/">
        <img
          src="https://scalebranding.com/wp-content/uploads/2021/04/r-block-logo_1.jpg"
          alt="logo"
          className="navbar__logo"
        />
      </Link>
      <Link to="/" className="navbar__title">
        <h1>Ryze</h1>
      </Link>
      <SearchBar className="navbar__search-form" />
      <div className="navbar__user-container">
        {user ? (
          <div>
            <div
              className="navbar__user-dropdown"
              onClick={() => setShowMenu(!showMenu)}
            >
              <div
                className="navbar__user-icon"
                onClick={() => setShowMenu(!showMenu)}
              >
                <PermIdentityIcon />
              </div>
              <div
                className="navbar__user-name"
                onClick={() => setShowMenu(!showMenu)}
              >
                <h3>{userData.name}</h3>
              </div>
              <MenuIcon onClick={() => setShowMenu(!showMenu)} />
            </div>
            {showMenu ? (
              <div className="navbar__dropdown-menu">
                <Link
                  to={`/profile/${userData.username}`}
                  className="navbar__dropdown-item"
                >
                  View Profile
                </Link>
                <Link to="/" className="navbar__dropdown-item" onClick={logout}>
                  Log out
                </Link>
                {/* <div lassName="navbar__dropdown-item">
                  <button onClick={logout}>Log Out</button>{" "}
                </div> */}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="navbar__logged-out">
            You are not currently logged in. Please{" "}
            <Link to="/login">login</Link> or{" "}
            <Link to="/register">register</Link> now!
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderBar;
