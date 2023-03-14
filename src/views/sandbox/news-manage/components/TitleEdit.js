import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import "../news-manage.css";
import axios from "axios";
import { Select } from "antd";

export default function TitleEdit() {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    axios.get("/categories").then((res) => {
      setCategory(res.data);
    });
  },[]);

  return (
    <div className="content">
      <Form
        name="basic"
        labelCol={{
          span: 2,
        }}
        wrapperCol={{
          span: 12,
        }}
        
        autoComplete="off"
      >
        <Form.Item
          label="新闻标题"
          name="newstitle"
          rules={[
            {
              required: true,
              message: "请输入新闻标题!",
            },
          ]}
        >
          <Input autoComplete="none" />
        </Form.Item>
        <Form.Item
          label="新闻种类"
          name="newscategory"
          rules={[
            {
              required: true,
              message: "请选择新闻种类!",
            },
          ]}
        >
          <Select
            onChange={console.log("a")}
            options={category}
          />
        </Form.Item>
      </Form>
    </div>
  );
}
