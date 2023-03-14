import React, { useState, useEffect, useRef } from "react";
import { Steps, PageHeader, Button, Form, Input, Select, message ,notification} from "antd";
import "./news-manage.css";

// import TitleEdit from "./components/TitleEdit";
import axios from "axios";
import NewsEditor from "../../../components/news-manage/NewsEditor";

const { Step } = Steps;

export default function NewsAdd(props) {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});
  const [category, setCategory] = useState([]);
  const [newsContent, setNewsContent] = useState("");
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );

  useEffect(() => {
    axios.get("/categories").then((res) => {
      const data = res.data.map((item) => {
        return {
          value: item.id,
          label: item.title,
        };
      });
      setCategory(data);
    });
  }, []);

  const NewsForm = useRef({});

  //下一步，将表单数据存入formData
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          setFormData(res);
          setCurrent(current + 1);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      if (newsContent === "" || newsContent.trim() === "<p></p> ") {
        message.error("新闻内容不能为空");
      } else {
        setCurrent(current + 1);
      }
    }
  };
  //上一步，跳转到之前的页面
  const handlePrev = () => {
    setCurrent(current - 1);
  };

  //根据按钮提交表单
  const subNews = (auditState) => {
    const formInfo = {
      ...formData,
      content:newsContent,
      region: region?region:"全球",
      author: username,
      roleId: roleId,
      auditState: auditState,    //0草稿箱 1审核中 2审核通过
      publishState: 0,
      createTime: Date.now(),
      star: 0,
      view: 0,
    };
 
    axios.post("/news",formInfo).then(res=>{
      notification.info({
        message: `通知`,
        description:
          `你可以到${auditState === 0 ? "草稿箱" : "审核列表" }中查看你的新闻`,
        placement:"bottomRight"
      });
      setTimeout(function(){
        props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
      },500)
    })
  };

  return (
    <div>
      <PageHeader className="site-page-header" title="撰写新闻" />
      <Steps current={current}>
        <Step title="新闻标题" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或提交审核" />
      </Steps>
      {/* <div className="news-edit">{newsWrite()}</div> */}

      <div className="news-edit">
        <div className={current === 0 ? "" : "hidden"}>
          <Form
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
            autoComplete="off"
            ref={NewsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: "请输入新闻标题",
                },
              ]}
            >
              <Input />
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
        </div>

        <div className={current === 1 ? "" : "hidden"}>
          <NewsEditor
            getContent={(value) => {
              setNewsContent(value);
            }}
          />
        </div>

        <div className={current === 2 ? "" : "hidden"}></div>
      </div>
      <div className="news-set">
        {current === 2 && (
          <span>
            <Button
              type="primary"
              onClick={() => subNews(0)}
              style={{ marginRight: "5px" }}
            >
              保存草稿箱
            </Button>
            <Button type="danger" onClick={() => subNews(1)}>
              提交审核
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={() => handleNext()}>
            下一步
          </Button>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => handlePrev()}
          >
            上一步
          </Button>
        )}
      </div>
    </div>
  );
}
