import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import Footer from "./core/Footer";
import Home from "./core/Home";
import Menu from "./core/Menu";
import EditPost from "./post/EditPost";
import NewPost from "./post/NewPost";
import Post from "./post/Post";

import EditProfile from "./user/EditProfile";
import FindPeople from "./user/FindPeople";
import Profile from "./user/Profile";
import Signin from "./user/Signin";
import Signup from "./user/Signup";
import Users from "./user/Users";

const Routes = () => {
  return (
    <>
      <Menu></Menu>
      <Switch>
        <Route path="/" exact component={Home} />

        <PrivateRoute path="/post/create" exact component={NewPost} />

        <PrivateRoute path="/post/edit/:postId" exact component={EditPost} />
        <Route path="/users" exact component={Users}></Route>
        <Route path="/signup" exact component={Signup}></Route>
        <Route path="/signin" exact component={Signin}></Route>

        <Route path="/post/:postId" exact component={Post}></Route>

        <PrivateRoute path="/user/:userId" exact component={Profile} />
        <PrivateRoute path="/user/edit/:userId" exact component={EditProfile} />
        <PrivateRoute path="/findpeople" exact component={FindPeople} />
      </Switch>

      <Footer></Footer>
    </>
  );
};

export default Routes;
