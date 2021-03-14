import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { isAuthenticated } from "../auth";
import { createPost } from "../auth/post";
import DefaultProfile from "../images/avatar.png";
var postData = new FormData();
function NewPost(props) {
  const [data, setdata] = useState({
    title: "",
    body: "",
    photo: "",
    error: "",
    user: {},
    fileSize: 0,
    loading: false,
    redirectToProfile: false,
  });
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

    // console.log(userId);
    if (isValid()) {
      let confirmed = true;
      if (confirmed) {
        createPost(userId, token, postData).then((d) => {
          if (d.error) {
            console.log(d.error);
            setdata({ ...data, error: d.error, loading: false });
          } else {
            setdata({
              ...data,

              redirectToHome: true,
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
    setdata({ ...data, user: isAuthenticated().user });
  }, [props]);
  if (data.redirectToHome) {
    return <Redirect to="/" />;
  }

  const NewPostForm = () => {
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
        <button onClick={onSubmit} className="btn btn-raised btn-primary">
          Create
        </button>
      </form>
    );
  };
  // console.log(DefaultProfile);
  return (
    <div className="container">
      <h1 className="mt-5 mb-5">Create New Post</h1>
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
      {data.photo && (
        <img
          style={{ height: "300px", width: "auto" }}
          className="img-thumbnail"
          src={window.URL.createObjectURL(data.photo)}
          onError={(i) => (i.target.src = `${DefaultProfile}`)}
          alt={data.name}
        />
      )}
      {NewPostForm()}
    </div>
  );
}

export default NewPost;
