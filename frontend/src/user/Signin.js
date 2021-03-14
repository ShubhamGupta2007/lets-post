import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { authenticate, signin } from "../auth";

const Signin = () => {
  const [data, setdata] = useState({
    email: "",
    password: "",
    error: "",
    redirect: false,
    loading: false,
  });
  const handleChange = (event) => {
    const { name, value } = event.target;

    setdata({ ...data, [name]: value, error: "" });
    // console.log(data);
  };
  const onSubmit = (event) => {
    event.preventDefault();

    setdata({ ...data, loading: true });
    const { email, password } = data;

    const user = { email, password };
    // console.log({ user });
    signin(user).then((d) => {
      if (d.error) {
        setdata({ ...data, error: d.error, loading: false });
      } else {
        authenticate(d, () => {
          setdata({ ...data, redirect: true });
        });
      }
    });
  };

  const signinForm = () => {
    return (
      <form>
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

  if (data.redirect) {
    return <Redirect to="/" />;
  }
  return (
    <div className="container">
      <h2 className="mb-5 bt-5 ">Signin</h2>
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
      {signinForm()}
    </div>
  );
};

export default Signin;
