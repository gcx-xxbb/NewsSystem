import React, { useEffect, useState } from "react";
import {UserOutlined } from '@ant-design/icons'
import { Layout, Menu } from "antd";
import "./index.css";
import MenuItem from "antd/lib/menu/MenuItem";
import { withRouter } from "react-router-dom";
import axios from "axios";

const { Sider } = Layout;
const { SubMenu } = Menu;

function SideMenu(props) {
  const iconList = {
    "/home": <UserOutlined />,
    "/user-manage/list": <UserOutlined />,
    "/user-manage": <UserOutlined />,
    "/right-manage/role/list": <UserOutlined />,
    "/right-manage/right/list": <UserOutlined />,
    "/right-manage": <UserOutlined />,
    "/news-manage/add": <UserOutlined />,
    "/news-manage/draft": <UserOutlined />,
    "/news-manage/category": <UserOutlined />,
    "/news-manage": <UserOutlined />,
    "/audit-manage/audit": <UserOutlined />,
    "/audit-manage/list": <UserOutlined />,
    "/audit-manage": <UserOutlined />,
    "/publish-manage/unpublished": <UserOutlined />,
    "/publish-manage/published": <UserOutlined />,
    "/publish-manage/sunset": <UserOutlined />,
    "/publish-manage": <UserOutlined />,
  };

  const [menu, setMenu] = useState([]);

  //获取列表数据
  useEffect(() => {
    axios.get("http://localhost:5000/rights?_embed=children").then((res) => {
      setMenu(res.data);
    });
  }, []);

  const checkPagePermission = (item) => {
    return item.pagepermisson === 1;
  };

  const renderMenu = (menuList) => {
    return menuList.map((item) => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                {iconList[item.key]}
                <span>{item.title}</span>
              </span>
            }
          >
            {renderMenu(item.children)}
          </SubMenu>
        );
      }
      return checkPagePermission(item) && (
        <MenuItem
          key={item.key}
          onClick={() => {
            // console.log(props);
            props.history.push(item.key);
          }}
        >
          {iconList[item.key]}
          {item.title}
        </MenuItem>
      );
    });
  };

  const selectKeys = [props.location.pathname];
  const openKeys = ["/" + props.location.pathname.split("/")[1]];
  
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={false}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">全球新闻发布管理系统</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectKeys}
            defaultOpenKeys={openKeys}
          >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  );
}

export default withRouter(SideMenu);
