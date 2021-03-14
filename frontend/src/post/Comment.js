import React, { useState } from "react";
import { comment, uncomment } from "../auth/post";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/avatar.png";

const Comment = (props) => {
  const [data, setdata] = useState({
    text: "",
    error: "",
  });

  const handleChange = (event) => {
    setdata({ ...data, error: "", text: event.target.value });
  };

  const isValid = () => {
    const { text } = data;
    if (!text.length > 0 || text.length > 150) {
      setdata({
        ...data,
        error: "Comment should not be empty and less than 150 characters long",
      });
      return false;
    }
    return true;
  };

  const addComment = (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      setdata({ ...data, error: "Please signin to leave a comment" });
      return false;
    }

    if (isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = props.postId;

      comment(userId, token, postId, { text: data.text }).then((d) => {
        if (d.error) {
          console.log(d.error);
        } else {
          setdata({ text: "", error: "" });

          //   console.log(d.co);
          // dispatch fresh list of coments to parent (SinglePost)
          props.updateComments(d.comments);
        }
      });
    }
  };

  const deleteComment = (comment) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = props.postId;

    uncomment(userId, token, postId, comment).then((d) => {
      if (d.error) {
        console.log(d.error);
      } else {
        props.updateComments(d.comments);
      }
    });
  };

  const deleteConfirmed = (comment) => {
    let answer = window.confirm(
      "Are you sure you want to delete your comment?"
    );
    if (answer) {
      deleteComment(comment);
    }
  };

  const { comments } = props;
  const { error } = data;

  return (
    <div>
      <h2 className="mt-5 mb-5">Leave a comment</h2>

      <form onSubmit={addComment}>
        <div className="form-group">
          <input
            type="text"
            onChange={handleChange}
            value={data.text}
            className="form-control"
            placeholder="Leave a comment..."
          />
          <button className="btn btn-raised btn-success mt-2">Post</button>
        </div>
      </form>

      <div
        className="alert alert-danger"
        style={{ display: data.error ? "" : "none" }}
      >
        {error}
      </div>

      <div className="col-md-12">
        <h3 className="text-primary">{comments.length} Comments</h3>
        <hr />
        {comments.map((comment, i) => (
          <div key={i}>
            <div>
              <Link to={`/user/${comment.postedBy._id}`}>
                <img
                  style={{
                    borderRadius: "50%",
                    border: "1px solid black",
                  }}
                  className="float-left mr-2"
                  height="30px"
                  width="30px"
                  onError={(i) => (i.target.src = `${DefaultProfile}`)}
                  src={`${process.env.REACT_APP_API}/user/photo/${comment.postedBy._id}`}
                  alt={comment.postedBy.name}
                />
              </Link>
              <div>
                <p className="lead">{comment.text}</p>
                <p className="font-italic mark">
                  Posted by{" "}
                  <Link to={`/user/${comment.postedBy._id}`}>
                    {comment.postedBy.name}{" "}
                  </Link>
                  on {new Date(comment.created).toDateString()}
                  <span>
                    {isAuthenticated().user &&
                      isAuthenticated().user._id === comment.postedBy._id && (
                        <>
                          <span
                            onClick={() => deleteConfirmed(comment)}
                            className="text-danger float-right mr-1"
                          >
                            Remove
                          </span>
                        </>
                      )}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comment;
