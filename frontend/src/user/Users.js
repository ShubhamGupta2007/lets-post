import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { getAllUsers } from "../auth/user";
import DefaultProfile from "../images/avatar.png";
const Users = () => {
  const [data, setdata] = useState({
    users: [],
  });

  useEffect(() => {
    getAllUsers().then((d) => {
      if (d.error) {
        console.log(d.error);
      } else {
        setdata({ ...data, users: d.users });
      }
    });
  }, []);
  const displayUsers = (users) => {
    if (isAuthenticated())
      users = users.filter((user) => {
        return user._id !== isAuthenticated().user._id;
      });
    return (
      <div className="row">
        {users.map((user, idx) => {
          return (
            <div className="card col-md-4 p-2 " key={idx}>
              <img
                style={{ height: "300px", width: "100%" }}
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
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Users</h2>
      <div className="card">{displayUsers(data.users)}</div>
    </div>
  );
};

export default Users;
