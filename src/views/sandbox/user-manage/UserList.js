import React, { useEffect, useState } from "react";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import { Table, Tag, Button, Modal, Popover, Switch } from "antd";
import axios from "axios";

const { confirm } = Modal;

export default function UserList() {
  const [dataSource, setdataSource] = useState([]);
  const [roleList, setRoleList] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/users").then((res) => {
      // console.log(res.data);
      setdataSource(res.data);   
      // initData()
    });
  }, []);
  useEffect(()=>{
    axios.get("http://localhost:5000/roles").then(res=>{
      setRoleList(res.data)
    })
  },[])

  const initData = () => {
    axios.get("http://localhost:5000/roles").then((res) => {
      setRoleList(res.data);
      const dataList = dataSource.map((item) => {
        for (var i = 0; i < roleList.length; i++) {
          if (item.roleId == roleList[i].id) {
            return {
              ...item,
              roleName: roleList[i].roleName,
            };
          }
        }
      });
      console.log(dataSource);
      setdataSource(dataList);
    });
  };

  const columns = [
    {
      title: "地区",
      dataIndex: "region",
      render: (region) => {
        return <b>{region}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "username",
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      dataIndex:"roleState",
      render: (item) => {
        return (
          <Switch
            checked={item.roleState}
            onChange={() => {
              switchMethod(item);
            }}
          ></Switch>
        );
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              style={{ marginRight: "5px" }}
              onClick={() => showConfirm(item)}
            />

            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                console.log("对数据进行操作");
              }}
            />
          </div>
        );
      },
    },
  ];

  const showConfirm = (item) => {
    confirm({
      title: "你确定要删除?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteMethod(item);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const deleteMethod = (item) => {
    console.log(item);
    //当前页面同步状态 + 后端同步

    // let a = dataSource.filter((data) => data.id !== item.id);
    // setdataSource(a);

    //删除远程数据
    // axios.delete(`http://localhost:5000/rights/${item.id}`)

    if (item.grade === 1) {
      setdataSource(dataSource.filter((data) => data.id !== item.id));
      axios.delete(`http://localhost:5000/rights/${item.id}`);
    } else {
      let list = dataSource.filter((data) => data.id == item.rightId);

      list[0].children = list[0].children.filter((data) => data.id !== item.id);

      setdataSource([...dataSource]);
      axios.delete(`http://localhost:5000/children/${item.id}`);
    }
  };
  //修改用户状态
  const switchMethod = (item) => {
    item.roleState = !item.roleState;
    setdataSource([...dataSource]);
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState,
    });
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
