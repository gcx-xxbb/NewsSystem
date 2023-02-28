import React from "react";
import { HashRouter, Redirect, Route } from "react-router-dom";
import Login from "../views/login/login";
import NewsSandBox from "../views/sandbox/NewsSandBox";

export default function IndexRouter() {
  return (
    <HashRouter>
        <Route path="/login" component={Login} />
        <Route path="/" render = {() =>
          localStorage.getItem("token") ?
          <NewsSandBox></NewsSandBox> :
          <Redirect to="/login" />
        } />
    </HashRouter>
  );
}
