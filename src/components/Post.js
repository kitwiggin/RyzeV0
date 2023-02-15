import React from "react";
import { Avatar } from "@mui/material";
import {
  ChatBubbleOutline,
  FavoriteBorder,
  Publish,
  Repeat,
  VerifiedUser,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import "../style/Post.css";
import PostLike from "./PostLike";

// Posts are static and don't update avatar etc. when user
// updates their info :(
function Post({
  postID,
  displayName,
  username,
  verified,
  text,
  image,
  avatar,
  likers,
}) {
  return (
    <div className="post">
      <div className="post__avatar">
        <Avatar src={avatar} />
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {displayName}
              <span className="post__headerSpecial">
                {verified && <VerifiedUser className="post__badge" />}
                <Link to={`/profile/${username}`}>@{username}</Link>
              </span>
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{text}</p>
          </div>
        </div>
        <img src={image} alt="" />
        <div className="post__footer">
          <ChatBubbleOutline fontSize="small" />
          <Repeat fontSize="small" />
          {/* <FavoriteBorder fontSize="small" /> */}
          <PostLike postID={postID} likers={likers} />
          <Publish fontSize="small" />
        </div>
      </div>
    </div>
  );
}

export default Post;
