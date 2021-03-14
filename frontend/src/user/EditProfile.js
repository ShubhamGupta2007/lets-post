import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { isAuthenticated, updateUserInLocalStorage } from "../auth";
import { readUser, updateUser } from "../auth/user";
import DefaultProfile from "../images/avatar.png";
var userData = new FormData();
function EditProfile(props) {
  const [data, setdata] = useState({
    userId: "",
    name: "",
    email: "",
    password: "",
    redirectToProfile: false,
    success: false,
    error: "",
    loading: false,
    fileSize: 0,
    about: "",
  });
  const userId = props.match.params.userId;
  const token = isAuthenticated().token;

  const photoUrl = data.userId
    ? `${
        process.env.REACT_APP_API
      }/user/photo/${userId}?${new Date().getTime()}`
    : DefaultProfile;
  const handleChange = (event) => {
    const { name } = event.target;

    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize =
      name === "photo" ? event.target.files[0].size : data.fileSize;

    userData.set(name, value);

    setdata({ ...data, [name]: value, error: "", success: false, fileSize });
    // console.log(data);
  };
  const onSubmit = (event) => {
    event.preventDefault();

    // console.log("hello");
    setdata({ ...data, loading: true });

    if (isValid()) {
      //   let confirmed = window.confirm(
      //     "Are you sure you want to update your Profile!"
      //   );
      let confirmed = true;
      if (confirmed) {
        updateUser(userId, token, userData).then((d) => {
          if (d.error) {
            setdata({ ...data, error: d.error, loading: false });
          } else {
            updateUserInLocalStorage(d);
            setdata({
              ...data,
              redirectToProfile: true,
            });
          }
        });
      }
    }
  };
  // console.log(photoUrl);
  const isValid = () => {
    const { name, email, fileSize } = data;
    // console.log(name);
    if (fileSize > 100000) {
      setdata({
        ...data,
        error: "File size should be less than 100kb",
        loading: false,
      });
      return false;
    }
    if (name.length === 0) {
      setdata({ ...data, error: "Name is required", loading: false });
      return false;
    }
    // email@domain.com
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setdata({
        ...data,
        error: "A valid Email is required",
        loading: false,
      });
      return false;
    }

    return true;
  };
  useEffect(() => {
    readUser(userId, token).then((d) => {
      if (d.error) {
        setdata({ ...data, redirectToProfile: true });
      } else {
        setdata({
          userId: d.user._id,
          name: d.user.name,
          email: d.user.email,
          password: "",
          about: d.user.about,
        });
      }
    });
  }, [props]);
  if (data.redirectToProfile) {
    return <Redirect to={`/user/${userId}`} />;
  }

  const profileUpdateForm = () => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Profile Photo</label>
          <input
            onChange={handleChange}
            name="photo"
            type="file"
            accept="image/*"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            onChange={handleChange}
            type="text"
            className="form-control"
            name="name"
            value={data.name}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            onChange={handleChange}
            type="email"
            className="form-control"
            name="email"
            value={data.email}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">About</label>
          <textarea
            name="about"
            onChange={handleChange}
            type="text"
            className="form-control"
            value={data.about}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            onChange={handleChange}
            type="password"
            className="form-control"
            name="password"
            value={data.password}
          />
        </div>

        {/* <div className="form-group">
                  <label className="text-muted">
                      {recaptcha ? "Thanks. You got it!" : "What day is today?"}
                  </label>
    
                  <input
                      onChange={recaptchaHandler}
                      type="text"
                      className="form-control"
                  />
              </div> */}

        <button onClick={onSubmit} className="btn btn-raised btn-primary">
          Update
        </button>
      </form>
    );
  };
  // console.log(DefaultProfile);
  return (
    <div className="container">
      <h1 className="mt-5 mb-5">Edit Profile</h1>
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
        src={!data.photo ? photoUrl : window.URL.createObjectURL(data.photo)}
        onError={(i) => (i.target.src = `${DefaultProfile}`)}
        alt={data.name}
      />
      {profileUpdateForm()}
    </div>
  );
}

export default EditProfile;
