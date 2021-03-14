import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { getPost, updatePost } from "../auth/post";
import { isAuthenticated } from "../auth";

import DefaultPost from "../images/pleasent.jpg";
var postData = new FormData();
function EditPost(props) {
  const [data, setdata] = useState({
    title: "",
    body: "",
    photo: "",
    error: "",
    user: {},
    fileSize: 0,
    loading: true,
    redirectToPost: false,
  });

  const postId = props.match.params.postId;
  const userId = isAuthenticated().user._id;
  const token = isAuthenticated().token;

  const handleChange = (event) => {
    const { name } = event.target;

    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize =
      name === "photo"
        ? event.target.files[0] == undefined
          ? ""
          : event.target.files[0].size
        : data.fileSize;

    postData.set(name, value);

    setdata({ ...data, [name]: value, error: "", success: false, fileSize });
    // console.log(data);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    setdata({ ...data, loading: true });

    if (isValid()) {
      let confirmed = true;
      if (confirmed) {
        updatePost(postId, token, postData).then((d) => {
          if (d.error) {
            console.log(d.error);
            setdata({ ...data, error: d.error, loading: false });
          } else {
            // console.log(JSON.stringify(d));
            setdata({
              ...data,
              redirectToPost: true,
              loading: false,
            });
          }
        });
      }
    }
  };
  const isValid = () => {
    const { body, title, fileSize } = data;
    // console.log(name);
    if (fileSize > 1000000) {
      setdata({
        ...data,
        error: "File size should be less than 1mb",
        loading: false,
      });
      return false;
    }
    if (title.length === 0) {
      setdata({ ...data, error: "Title is required", loading: false });
      return false;
    }
    if (body.length === 0) {
      setdata({ ...data, error: "Body is required", loading: false });
      return false;
    }

    return true;
  };
  useEffect(() => {
    getPost(postId).then((d) => {
      if (d.error) {
        setdata({ ...data, error: d.error });
      } else {
        setdata({
          ...data,
          title: d.post.title,
          body: d.post.body,
          user: isAuthenticated().user,
          loading: false,
        });
      }
    });
  }, [props]);

  if (data.redirectToPost) {
    return <Redirect to={`/post/${postId}`} />;
  }

  const EditPostForm = () => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Upload Photo</label>
          <input
            onChange={handleChange}
            name="photo"
            type="file"
            accept="image/*"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Tile</label>
          <input
            onChange={handleChange}
            type="text"
            className="form-control"
            name="title"
            value={data.title}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Body</label>
          <textarea
            name="body"
            onChange={handleChange}
            type="text"
            className="form-control"
            value={data.body}
          />
        </div>
        <div className="d-inline-block">
          <Link
            to={`/post/${postId}`}
            className="btn btn-raised btn-primary btn-sm mr-5"
          >
            Back to post
          </Link>
          <button onClick={onSubmit} className="btn btn-raised btn-warning">
            Update
          </button>
        </div>
      </form>
    );
  };
  // console.log(DefaultProfile);
  return (
    <div className="container">
      <h1 className="mt-5 mb-5">{data.title}</h1>
      <div
        className="alert alert-danger"
        style={{ display: data.error ? "" : "none" }}
      >
        {data.error}
      </div>
      <div
        className="jumbotron text-center"
        style={{ display: data.loading ? "" : "none" }}
      >
        <h2>Loading...</h2>
      </div>

      <img
        style={{ height: "300px", width: "auto" }}
        className="img-thumbnail"
        src={
          data.photo
            ? window.URL.createObjectURL(data.photo)
            : `${
                process.env.REACT_APP_API
              }/post/photo/${postId}?${new Date().getTime()}`
        }
        onError={(i) => (i.target.src = `${DefaultPost}`)}
        alt={data.name}
      />

      {EditPostForm()}
    </div>
  );
}

export default EditPost;
