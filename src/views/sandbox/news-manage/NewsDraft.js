import React, { useEffect, useState } from "react";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import {
  Table,
  Button,
  Modal,
} from "antd";
import axios from "axios";

const { confirm } = Modal;

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

export default function NewsDraft() {
  const [dataSource, setdataSource] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [formData, setFormData] = useState({});
  const [open, setOpen] = useState(false);
  // const { roleId ,region} = JSON.parse(localStorage.getItem("token"));
  //获取初始数据
  useEffect(() =>{
    axios.get("/categories").then(res=>{
      setCategoryList(res.data)
    })
  })
  useEffect(() => {
    axios.get("/news?auditState=0").then((res) => {
      console.log(res.data);
      const data = res.data.map(item=>{
        return {
          ...item,
          categoryName:categoryList[item.categoryId -1].value
        }
      })
      console.log(data);
      setdataSource(data)
    });
  }, []);

  
  //表头
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title) => {
        return <a href="##">{title}</a>
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex:"categoryName",
      // render:(categoryId) =>{
      //   return <span>{categoryList[categoryId]}</span>
      // }
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
              disabled={item.default}
            />

            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => {
                editForm(item);
                console.log("对数据进行操作");
              }}
            />
          </div>
        );
      },
    },
  ];
  //删除操作
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

  //删除新闻
  const deleteMethod = (item) => {
    console.log(item);
    //当前页面同步状态 + 后端同步
    setdataSource(dataSource.filter((data) => data.id !== item.id));

    //删除远程数据
    axios.delete(`/users/${item.id}`);
  };

  //编辑用户
  const editForm = (item) => {
    setOpen(true);
    setFormData(item);
  };

  //修改用户状态
  const switchMethod = (item) => {
    item.roleState = !item.roleState;
    setdataSource([...dataSource]);
    axios.patch(`/users/${item.id}`, {
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
      {/* <CollectionCreateForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      /> */}
    </div>
  );
}
