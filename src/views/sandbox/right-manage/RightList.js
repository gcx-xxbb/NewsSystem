import React, { useEffect, useState } from "react";

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { Table, Tag, Button, Modal } from "antd";
import axios from "axios";

const { confirm } = Modal;

export default function RightList() {
  const [dataSource, setdataSource] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/rights?_embed=children").then((res) => {
      const list = res.data;
      list.forEach(item=>{
        if(item.children.length === 0){
          item.children = ""
        }
      })
      setdataSource(list);
    });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "权限名称",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (key) => {
        return <Tag color="gold">{key}</Tag>;
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
            <Button type="primary" shape="circle" icon={<EditOutlined />} />
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

    let a = dataSource.filter((data) => data.id !== item.id);
    setdataSource(a);
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
      />
    </div>
  );
}
