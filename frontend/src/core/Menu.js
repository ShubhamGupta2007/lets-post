import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated, signout } from "../auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#ff9900" };
  else return { color: "#ffffff" };
};

const Menu = ({ history }) => (
  <div>
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link className="nav-link" style={isActive(history, "/")} to="/">
          Home
        </Link>
      </li>

      <li className="nav-item">
        <Link
          className="nav-link"
          style={isActive(history, "/users")}
          to="/users"
        >
          Users
        </Link>
      </li>

      <li className="nav-item">
        <Link
          to={`/post/create`}
          style={isActive(history, `/post/create`)}
          className="nav-link"
        >
          Create Post
        </Link>
      </li>

      {!isAuthenticated() && (
        <React.Fragment>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signin")}
                to="/signin"
              >
                Sign In
              </Link>
            </li>
          </ul>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/signup")}
              to="/signup"
            >
              Sign Up
            </Link>
          </li>
        </React.Fragment>
      )}

      {isAuthenticated() && isAuthenticated().user.role === "admin" && (
        <li className="nav-item">
          <Link
            to={`/admin`}
            style={isActive(history, `/admin`)}
            className="nav-link"
          >
            Admin
          </Link>
        </li>
      )}

      {isAuthenticated() && (
        <>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item justify-content-end">
              <Link
                to={`/findpeople`}
                style={isActive(history, `/findpeople`)}
                className="nav-link"
              >
                Find People
              </Link>
            </li>
          </ul>

          <li className="nav-item justify-content-end">
            <Link
              to={`/user/${isAuthenticated().user._id}`}
              style={isActive(history, `/user/${isAuthenticated().user._id}`)}
              className="nav-link"
            >
              {`${isAuthenticated().user.name}'s profile`}
            </Link>
          </li>

          <li className="nav-item justify-content-end">
            <span
              className="nav-link"
              style={{ cursor: "pointer", color: "#fff" }}
              onClick={() => signout(() => history.push("/"))}
            >
              Sign Out
            </span>
          </li>
        </>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
