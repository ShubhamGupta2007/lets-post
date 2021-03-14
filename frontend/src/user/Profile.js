import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { postsByUser } from "../auth/post";
import { readUser } from "../auth/user";
import DefaultProfile from "../images/avatar.png";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ListFollow from "./ListFollow";

const Profile = (props) => {
  const [data, setdata] = useState({
    user: "",
    redirectToSign: false,
    following: false,
  });
  const [posts, setPosts] = useState([]);
  const userId = props.match.params.userId;
  const token = isAuthenticated().token;

  // check follow
  const checkFollow = (user) => {
    const jwt = isAuthenticated();
    // console.log(user.followers);
    const match = user.followers.find((follower) => {
      return follower._id === jwt.user._id;
    });
    return match;
  };

  const clickFollowButton = (callApi) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    callApi(userId, token, data.user._id).then((d) => {
      if (d.error) {
        setdata({ error: d.error });
      } else {
        setdata({ ...data, user: d, following: !data.following });
      }
    });
  };

  useEffect(() => {
    readUser(userId, token).then((d) => {
      if (d.error) {
        setdata({ ...data, redirectToSign: true });
      } else {
        let following = checkFollow(d.user);

        setdata({ ...data, user: d.user, following });
      }
    });
    postsByUser(userId, token).then((d) => {
      if (d.error) {
        console.log(d.err);
      } else {
        setPosts(d.posts);
      }
    });
  }, [props]);
  const photoUrl = userId
    ? `${
        process.env.REACT_APP_API
      }/user/photo/${userId}?${new Date().getTime()}`
    : DefaultProfile;

  if (data.redirectToSign) {
    return <Redirect to="/signin" />;
  }
  return (
    <div className="container ">
      <h2 className="mt-5 mb-5 ">Profile</h2>
      <div className="row">
        <div className="col-md-8">
          <img
            style={{ height: "300px", width: "auto" }}
            className="img-thumbnail"
            src={photoUrl}
            onError={(i) => (i.target.src = `${DefaultProfile}`)}
            alt={data.name}
          />
        </div>
        <div className="col-md-4">
          <div className="lead mt-2">
            <p>Name: {data.user.name}</p>
            <p>Email: {data.user.email}</p>
            <p>Joined: {new Date(data.user.created).toDateString()}</p>
          </div>
          {isAuthenticated() && isAuthenticated().user._id === data.user._id ? (
            <div className="d-inline-block ">
              <Link to={`/post/create`}>
                <button className="btn btn-raised btn-info mr-3 ">
                  Create Post
                </button>
              </Link>
              <Link to={`/user/edit/${data.user._id}`}>
                <button className="btn btn-raised btn-success mr-3 ">
                  Edit
                </button>
              </Link>
              <DeleteUser />
            </div>
          ) : (
            <FollowProfileButton
              following={data.following}
              onButtonClick={clickFollowButton}
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col md-12 mt-5 mb-5">
          <hr />
          <p className="lead">{data.user.about}</p>
          <hr />
          <ListFollow
            followers={data.user.followers}
            following={data.user.following}
            posts={posts}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
