import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { findPeople, follow } from "../auth/user";
import DefaultProfile from "../images/avatar.png";

const Users = () => {
  const [data, setdata] = useState({
    users: [],
    error: "",
    followMessage: "",
  });

  useEffect(() => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    findPeople(userId, token).then((d) => {
      if (d.error) {
        console.log(d.error);
      } else {
        setdata({ ...data, users: d });
      }
    });
  }, []);

  const clickFollow = (user, i) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    follow(userId, token, user._id).then((d) => {
      if (d.error) {
        this.setState({ error: d.error });
      } else {
        let toFollow = data.users;
        toFollow.splice(i, 1);
        setdata({
          users: toFollow,
          followMessage: `Following ${user.name}`,
        });
      }
    });
  };
  console.log(JSON.stringify(data.users));
  const displayUsers = (users) => {
    return (
      <div className="row">
        {users.map((user, idx) => {
          return (
            <div className="card col-md-4 p-2 " key={idx}>
              <img
                style={{ height: "300px", width: "auto" }}
                className="img-thumbnail"
                src={`${process.env.REACT_APP_API}/user/photo/${
                  user._id
                }?${new Date().getTime()}`}
                onError={(i) => (i.target.src = `${DefaultProfile}`)}
                alt={data.name}
              />
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">{user.email}</p>
                <Link
                  to={`/user/${user._id}`}
                  className="btn btn-primary btn-raised "
                >
                  View Profile
                </Link>

                <button
                  onClick={() => clickFollow(user, idx)}
                  className="btn btn-raised btn-info float-right btn-sm"
                >
                  Follow
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Find People</h2>

      {data.followMessage.length != 0 && (
        <div className="alert alert-success">{data.followMessage}</div>
      )}
      {data.users.length == 0 && (
        <div className="alert alert-info">No new User to follow</div>
      )}
      <div className="card">{displayUsers(data.users)}</div>
    </div>
  );
};

export default Users;
