import React, { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import "../style/FollowInfo.css";
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "../firebase";
import { Avatar } from "@mui/material";
import { VerifiedUser } from "@mui/icons-material";
import { Link } from "react-router-dom";

function FollowInfo({ title, UIDList }) {
  const [showFollowers, setShowFollowers] = useState(false);
  const [listElements, setListElements] = useState([]);

  useEffect(() => {
    getProfileInfo();
  }, [UIDList]);

  const getProfileInfo = async () => {
    try {
      var profileList = [];
      for (const uid of UIDList.slice(0, 100)) {
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const profileDoc = await getDocs(q);
        if (profileDoc.docs[0].exists()) {
          profileList.push(profileDoc.docs[0].data());
        }
      }
      setListElements(profileList);
    } catch (err) {
      console.log("error fetching profile infos from UID list");
      console.log(err);
      console.log(err.message);
    }
  };

  return (
    <div>
      <div className="follow-info">
        <h4 onClick={() => setShowFollowers(true)}>
          {title}: {UIDList.length}
        </h4>
      </div>
      {showFollowers && (
        <div className="followers-popup">
          <div className="close-btn">
            <button onClick={() => setShowFollowers(false)}>
              <Close />
            </button>
          </div>
          <ul>
            {listElements &&
              listElements.map((element) => (
                <li key={element.uid}>
                  <div className="post__avatar">
                    <Avatar src={element.avatar} />
                  </div>
                  <div className="post__headerText">
                    <h3>
                      {element.name}
                      <span className="post__headerSpecial">
                        {element.verified && (
                          <VerifiedUser className="post__badge" />
                        )}
                        <Link
                          to={`/profile/${element.username}`}
                          onClick={() => this.forceUpdate}
                        >
                          @{element.username}
                        </Link>
                      </span>
                    </h3>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FollowInfo;
