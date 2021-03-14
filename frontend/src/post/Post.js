import React, { useEffect, useState } from "react";
import { getPost, like, removePost, unlike } from "../auth/post";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";

import Comment from "./Comment";
import DefaultPost from "../images/pleasent.jpg";
function Post(props) {
  const [data, setdata] = useState({
    post: "",
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: [],
  });

  const checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  const likeToggle = () => {
    if (!isAuthenticated()) {
      setdata({ redirectToSignin: true });
      return false;
    }
    let callApi = data.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = data.post._id;
    const token = isAuthenticated().token;

    callApi(userId, token, postId).then((d) => {
      if (d.error) {
        console.log(d.error);
      } else {
        setdata({
          ...data,
          like: !data.like,
          likes: d.likes.length,
        });
      }
    });
  };

  const deletePost = () => {
    const postId = props.match.params.postId;
    const token = isAuthenticated().token;
    removePost(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setdata({ ...data, redirectToHome: true });
      }
    });
  };

  const deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your post?");
    if (answer) {
      deletePost();
    }
  };

  const updateComments = (comments) => {
    // console.log(comments);
    setdata({ ...data, comments });
  };

  useEffect(() => {
    const postId = props.match.params.postId;
    getPost(postId).then((d) => {
      if (d.error) {
        setdata({ ...data, error: d.error });
      } else {
        // console.log(d);
        setdata({
          ...data,
          post: d.post,
          likes: d.post.likes.length,
          like: d.post.likes ? checkLike(d.post.likes) : false,
          comments: d.post.comments ? d.post.comments : [],
        });
      }
    });
  }, [props]);

  const displayPost = (post) => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : " Unknown";

    return (
      <div className="card-body">
        <img
          src={`${process.env.REACT_APP_API}/post/photo/${post._id}`}
          alt={post.title}
          onError={(i) => (i.target.src = `${DefaultPost}`)}
          className="img-thunbnail mb-3"
          style={{
            height: "300px",
            width: "100%",
            objectFit: "cover",
          }}
        />

        <h3 onClick={likeToggle}>
          <Link>
            {data.like ? (
              <i
                className="fa fa-thumbs-up text-success bg-dark"
                style={{ padding: "10px", borderRadius: "50%" }}
              />
            ) : (
              <i
                className="fa fa-thumbs-up text-warning bg-dark"
                style={{ padding: "10px", borderRadius: "50%" }}
              />
            )}
          </Link>
          {` ${data.likes}`} Like
        </h3>

        <p className="card-text">{post.body}</p>
        <br />
        <p className="font-italic mark">
          Posted by <Link to={`${posterId}`}>{posterName} </Link>
          on {new Date(post.created).toDateString()}
        </p>
        <div className="d-inline-block">
          <Link to={`/`} className="btn btn-raised btn-primary btn-sm mr-5">
            Back to posts
          </Link>

          {isAuthenticated().user &&
            isAuthenticated().user._id === data.post.postedBy._id && (
              <>
                <Link
                  to={`/post/edit/${post._id}`}
                  className="btn btn-raised btn-warning btn-sm mr-5"
                >
                  Update Post
                </Link>
                <button
                  onClick={deleteConfirmed}
                  className="btn btn-raised btn-danger"
                >
                  Delete Post
                </button>
              </>
            )}
          {/*
          <div>
            {isAuthenticated().user && isAuthenticated().user.role === "admin" && (
              <div class="card mt-5">
                <div className="card-body">
                  <h5 className="card-title">Admin</h5>
                  <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                  <Link
                    to={`/post/edit/${post._id}`}
                    className="btn btn-raised btn-warning btn-sm mr-5"
                  >
                    Update Post
                  </Link>
                  <button
                    onClick={this.deleteConfirmed}
                    className="btn btn-raised btn-danger"
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            // )} */}
          {/* </div> */}
        </div>
      </div>
    );
  };

  if (data.redirectToHome == true) {
    return <Redirect to="/" />;
  }

  if (data.redirectToSignin == true) {
    return <Redirect to="/signin" />;
  }
  return (
    <div className="container">
      <h2 className="display-2 mt-5 mb-5">{data.post.title}</h2>

      {!data.post ? (
        <div className="jumbotron text-center">
          <h2>Loading...</h2>
        </div>
      ) : (
        displayPost(data.post)
      )}

      <Comment
        postId={data.post._id}
        comments={data.comments.reverse()}
        updateComments={updateComments}
      />
    </div>
  );
}

export default Post;
