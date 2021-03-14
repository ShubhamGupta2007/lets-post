import React from "react";
import { follow, unfollow } from "../auth/user";

function FollowProfileButton(props) {
  const followClick = () => {
    props.onButtonClick(follow);
  };

  const unfollowClick = () => {
    props.onButtonClick(unfollow);
  };

  return (
    <div>
      <div className="d-inline-block">
        {!props.following ? (
          <button
            onClick={followClick}
            className="btn btn-success btn-raised mr-5"
          >
            Follow
          </button>
        ) : (
          <button
            onClick={unfollowClick}
            className="btn btn-warning btn-raised"
          >
            UnFollow
          </button>
        )}
      </div>
    </div>
  );
}

export default FollowProfileButton;
