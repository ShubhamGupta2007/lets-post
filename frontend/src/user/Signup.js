import React, { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../auth/index";
// const API = REACT_APP_
export default function Signup() {
  const [data, setdata] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });
  const handleChange = (event) => {
    const { name, value } = event.target;

    setdata({ ...data, [name]: value, error: "", success: false });
    // console.log(data);
  };
  const onSubmit = (event) => {
    event.preventDefault();
    const { name, email, password } = data;

    const user = { name, email, password };

    signup(user).then((d) => {
      if (d.error) {
        setdata({ ...data, error: d.error });
      } else {
        setdata({
          name: "",
          email: "",
          password: "",
          error: "",
          success: true,
        });
      }
    });
  };

  const signupForm = () => {
    return (
      <form>
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
          Submit
        </button>
      </form>
    );
  };
  return (
    <div className="container">
      <h2 className="mb-5 bt-5 ">Signup</h2>
      <div
        className="alert alert-danger"
        style={{ display: data.error ? "" : "none" }}
      >
        {data.error}
      </div>
      <div
        className="alert alert-primary"
        style={{ display: data.success ? "" : "none" }}
      >
        New account is successfully created . Please{" "}
        <Link to="/signin">login</Link>!
      </div>
      {signupForm()}
    </div>
  );
}
