import React, { useState, useEffect } from "react";
import "../style/HeaderBar.css";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MenuIcon from "@mui/icons-material/Menu";

// Full of placeholders for now - just been putting it together
function HeaderBar() {
  const [searchValue, setSearchValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    console.log(showMenu);
  }, [showMenu]);

  function handleSearch(event) {
    event.preventDefault();
    console.log(searchValue);
  }

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
      <form className="navbar__search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="navbar__search-input"
        />
        <button type="submit" className="navbar__search-button">
          <SearchIcon />
        </button>
      </form>
      <div className="navbar__user-container">
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
            <h3>Kit Wiggin</h3>
          </div>
          <MenuIcon onClick={() => setShowMenu(!showMenu)} />
        </div>
        {showMenu ? (
          <div className="navbar__dropdown-menu">
            <Link to="/" className="navbar__dropdown-item">
              View Profile
            </Link>
            <Link to="/logout" className="navbar__dropdown-item">
              Log Out
            </Link>
          </div>
        ) : null}
        {/* <MenuIcon onClick={() => setShowMenu(!showMenu)} /> */}
      </div>
    </div>
  );
}

export default HeaderBar;
