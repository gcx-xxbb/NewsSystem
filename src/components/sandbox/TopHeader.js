import React, { useState } from "react";
import { UserOutlined ,MenuUnfoldOutlined,MenuFoldOutlined} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Avatar } from "antd";

const { Header } = Layout;

export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false);
  const changeCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menu = [{ label: '超级管理员', key: 'item-1' }
]
    

  return (
    <Header style={{ background: "#fff", padding: "0 16px" }}>
      <div>
      {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => changeCollapsed(),
          })}
      <div style={{ float: "right" }}>
        <span>欢迎谁回来</span>
        <Dropdown menu={menu}>
        <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
      </div>
      
    </Header>
  );
}
