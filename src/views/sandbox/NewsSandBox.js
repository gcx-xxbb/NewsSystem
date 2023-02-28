import React from "react";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "./home/Home";
import UserList from "./user-manage/UserList";
import RoleList from "./right-manage/RoleList";
import RightList from "./right-manage/RightList";
import NoPermission from "./nopermission/NoPermission";
import "./NewsSandBox.css";
import { Layout } from "antd";
const { Content } = Layout;

export default function NewsSandBox() {
  return (
    <Layout hasSider  >
      <SideMenu />
      <Layout className="site-layout" style={{ marginLeft: 200 }}> 
        <TopHeader />
        <Content
          style={{
            margin: "24px 16px",
            height: "100%",
            padding: 24,
            minHeight: "calc(100vh - 64px - 48px)",
          }}
        >
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/user-manage/list" component={UserList} />
            <Route path="/right-manage/role/list" component={RoleList} />
            <Route path="/right-manage/right/list" component={RightList} />

            <Redirect from="/" to="/home" exact />
            <Route path="*" component={NoPermission} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
}
