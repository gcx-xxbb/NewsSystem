import React, { useEffect, useState } from "react";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import {
  Table,
  Button,
  Modal,
  Switch,
  Form,
  Input,
  Select,
  Divider,
} from "antd";
import axios from "axios";

const { confirm } = Modal;

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

export default function UserList() {
  const [dataSource, setdataSource] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [formData, setFormData] = useState({});
  const [open, setOpen] = useState(false);
  //获取初始数据
  useEffect(() => {
    axios.get("http://localhost:5000/users?_expand=role").then((res) => {
      console.log(res.data);
      setdataSource(res.data);
      // initData()
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/roles").then((res) => {
      const roles = res.data.map((item) => {
        return {
          id: item.id,
          value: item.roleType,
          label: item.roleName,
        };
      });
      setRoleList(roles);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/regions").then((res) => {
      setRegionList(res.data);
    });
  }, []);
  //表头
  const columns = [
    {
      title: "地区",
      dataIndex: "region",
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => {
        return role.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      render: (item) => {
        return (
          <Switch
            disabled={item.default}
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
              disabled={item.default}
            />

            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={item.default}
              onClick={() => {
                editForm(item)
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

  const deleteMethod = (item) => {
    console.log(item);
    //当前页面同步状态 + 后端同步
    setdataSource(dataSource.filter((data) => data.id !== item.id));

    //删除远程数据
    axios.delete(`http://localhost:5000/users/${item.id}`);
  };

  //编辑用户
  const editForm = (item)=>{
    setOpen(true)
    setFormData(item)
  }

  const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    return (
      <Modal
        open={open}
        title="添加用户"
        okText="确认"
        cancelText="取消"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log(values);
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          name=" AddUser"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: "请输入用户名!",
              },
            ]}
            initialValue={formData.username}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: "请输入密码!",
              },
            ]}
            initialValue={formData.password}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="region"
            label="地区"
            // rules={[{ required: true }]}
            initialValue={formData.region}
          >
            <Select onChange={handleChange} options={regionList} />
          </Form.Item>
          <Form.Item
            name="roleId"
            label="角色"
            rules={[{ required: true }]}
            // initialValue={3}
            initialValue={formData.roleId}
          >
            <Select onChange={handleChange} options={roleList} />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  //修改用户状态
  const switchMethod = (item) => {
    item.roleState = !item.roleState;
    setdataSource([...dataSource]);
    axios.patch(`http://localhost:5000/users/${item.id}`, {
      roleState: item.roleState,
    });
  };

  //添加用户相关
  const onCreate = (values) => {
    console.log(values);
    setOpen(false);
    const data = {
      ...values,
      region: values.region || "",
      default: formData.default || false,
      roleState: formData.roleState || false,
    };
    if(formData.id){
      axios.patch(`http://localhost:5000/users/${formData.id}`,data).then(
        res=>{
          axios.get("http://localhost:5000/users?_expand=role").then((res) => {
            setdataSource(res.data);
          });
        }
      )
    }else{
      axios.post("http://localhost:5000/users",data)
    }
    setFormData({})
   
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        添加用户
      </Button>
      <Divider />
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />
      <CollectionCreateForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </div>
  );
}
