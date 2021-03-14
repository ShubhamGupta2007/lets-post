import React, { Component } from "react";
import { Redirect, Route } from "react-router";
import { isAuthenticated } from ".";

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <Component {...props}></Component>
        ) : (
          <Redirect
            to={{ pathname: "/signin", state: { from: props.location } }}
          ></Redirect>
        )
      }
    />
  );
}

export default PrivateRoute;
