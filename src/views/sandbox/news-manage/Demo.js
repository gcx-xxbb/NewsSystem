/*
  遇到一个问题：
  当current=1的时候，点击下一步，会同时执行下一步，提交审核，保存草稿箱 这三个事件，同时再点击后两个按钮没有反应
*/

import React, { useState, useEffect } from "react";
import { Steps, PageHeader, Button, Form, Input, Select } from "antd";
import "./news-manage.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// import TitleEdit from "./components/TitleEdit";
import axios from "axios";

const { Step } = Steps;

export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});
  const [category, setCategory] = useState([]);
  const [newsContent, setNewsContent] = useState("");
  const { roleId ,region,username} = JSON.parse(localStorage.getItem("token"));
  const [form] = Form.useForm();

  useEffect(() => {
    axios.get("/categories").then((res) => {
      const data = res.data.map(item=>{
        return {
          value:item.id,
          label:item.title,
        }
      })
      setCategory(data);
    });
  }, []);

  //编辑标题
  const titleedit = () => {
    return (
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 12,
        }}
        autoComplete="off"
      >
        <Form.Item
          label="新闻标题"
          name="title"
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
          name="categoryId"
          rules={[
            {
              required: true,
              message: "请选择新闻种类!",
            },
          ]}
        >
          <Select options={category} />
           
        </Form.Item>
      </Form>
    );
  };

  //编辑内容
  const contentedit = () => {
    return (
      <Form
        form={form}
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
          label="新闻内容"
          name="content"
          rules={[
            {
              required: true,
              message: "请输入新闻标题!",
            },
          ]}
        >
          <ReactQuill
            theme="snow"
            value={newsContent}
            onChange={setNewsContent}
          />
        </Form.Item>
      </Form>
    );
  };

  //调整撰写新闻展示的内容
  const newsWrite = () => {
    switch (current) {
      case 0:
        return titleedit();
      case 1:
        return contentedit();
      default:
        return null;
    }
  };
  //下一步，将表单数据存入formData
  const next = () => {
    form.validateFields().then((values) => {
      setFormData({
        ...formData,
        ...values,
        content: newsContent.toString(),
        region:region ? region:"全球",
        author:username,
        roleId:roleId,
        auditState:2,
        publishState:1,
        createTime:1653655796426,
        star:0,
        view:0
      });   
    });
    setCurrent(current < 2 ? current + 1 : 2);
    console.log(formData, "formData");
  };
  //上一步，跳转到之前的页面
  const prev = () => {
    setCurrent(current - 1);
  };

  //根据按钮提交表单
  const subNews = (published) =>{
    // axios.post("/news",{
    //   ...formData,
    //   publishState:published
    // }).then(
    //   setFormData({})
    // )
    
    console.log(published);
  }

  return (
    <div>
      <PageHeader className="site-page-header" title="撰写新闻" />
      <Steps current={current}>
        <Step title="新闻标题" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或提交审核" />
      </Steps>
      <div className="news-edit">{newsWrite()}</div>

      <div className="news-set">
        {current === 2 && (
          <span>
            <Button type="primary" onClick={subNews(0)} style={{marginRight:"5px"} }>保存草稿箱</Button>
            <Button type="danger" onClick={subNews(1)}>提交审核</Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary"  onClick={next}>
            下一步
          </Button>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
          >
            上一步
          </Button>
        )}
      </div>
    </div>
  );
}
