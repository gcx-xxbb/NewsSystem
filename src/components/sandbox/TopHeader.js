import React, { useState } from "react";
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Layout, Dropdown, Menu, Avatar } from "antd";
import { withRouter } from "react-router-dom";

const { Header } = Layout;

 function TopHeader(props) {
  const [collapsed, setCollapsed] = useState(false);
  const changeCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
           <Menu.Item>{roleName}</Menu.Item>
          ),
        },
        {
          key: "2",
          label: (
           <Menu.Item danger onClick={()=>{
              localStorage.removeItem('token')
              props.history.replace('/login')
           }}>退出</Menu.Item>
          ),
        },
      ]}
    />
  );

  return (
    <Header style={{ background: "#fff", padding: "0 16px" }}>
      <div>
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "trigger",
            onClick: () => changeCollapsed(),
          }
        )}
        <div style={{ float: "right" }}>
          <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
          <Dropdown overlay={menu}>
            <Avatar size="large" icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </div>
    </Header>
  );
}
export default withRouter(TopHeader)