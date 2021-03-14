import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { isAuthenticated, signout } from "../auth";
import { deleteuser } from "../auth/user";

export default function DeleteUser(props) {
  const [state, setstate] = useState({
    redirectToHome: false,
  });

  const deleteConfirmed = () => {
    let confirmed = window.confirm(
      "Are you sure you want to delete your account!"
    );

    if (confirmed) {
      let token = isAuthenticated().token;
      let userId = isAuthenticated().user._id;

      deleteuser(userId, token).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          signout(() => {
            console.log("User is deleted ");
          });
          setstate({ redirectToHome: true });
        }
      });
    }
  };

  if (state.redirectToHome) return <Redirect to="/"></Redirect>;

  return (
    <button onClick={deleteConfirmed} className="btn btn-raised btn-danger ">
      Delete
    </button>
  );
}
