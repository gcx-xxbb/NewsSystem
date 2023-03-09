import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Tree } from "antd";
import { DeleteOutlined, UnorderedListOutlined } from "@ant-design/icons";
import axios from "axios";

const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setdataSource] = useState([]);
  const [rightList, setRightList] = useState([]);
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      title: "角色名称",
      dataIndex: "roleName",
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
              icon={<UnorderedListOutlined />}
              onClick={() => showModal(item)}
            />
          </div>
        );
      },
    },
  ];

  //初始化
  useEffect(() => {
    axios.get("/roles").then((res) => {
      console.log(res);
      const roleList = res.data;
      setdataSource(roleList);
    });
  }, []);

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      setRightList(res.data);
    });
  }, []);

  //弹窗相关
  const showModal = (item) => {
    setIsModalOpen(true);
    setCurrentRights(item.rights);
    setCurrentId(item.id);
  };
  const handleOk = () => {
    console.log(currentRights.checked ? currentRights.checked : currentRights);
    console.log(currentId);
    setIsModalOpen(false);

    //同步dataSource
    setdataSource(
      dataSource.map((item) => {
        if (item.id == currentId) {
          return {
            ...item,
            rights: currentRights.checked
              ? currentRights.checked
              : currentRights,
          };
        }
        return item
      })
    );
    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    }).then(res=>{
      console.log(res.data);
    })
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCheck = (checkkeys) => {
    console.log(checkkeys);
    setCurrentRights(checkkeys);
  };

  //确认
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

  //删除角色
  const deleteMethod = (item) => {
    console.log(item);
    //当前页面同步状态 + 后端同步
    console.log("confirm");
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/roles/${item.id}`);
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
      <Modal
        open={isModalOpen}
        title="权限列表"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          treeData={rightList}
          checkedKeys={currentRights}
          onCheck={handleCheck}
          // checkStrictly={true}
        />
      </Modal>
    </div>
  );
}
