import React, { useEffect } from "react";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import nProgress from "nprogress";
import 'nprogress/nprogress.css'

import "./NewsSandBox.css";
import { Layout } from "antd";
import NewsRouter from "../../components/sandbox/NewsRouter";
const { Content } = Layout;

export default function NewsSandBox() {
  nProgress.start()
  useEffect(()=>{
    nProgress.done()
  },[])
  return (
    <Layout hasSider  >
      <SideMenu />
      <Layout className="site-layout" style={{ marginLeft: 200 }}> 
        <TopHeader />
        <Content
          style={{
            margin: "24px 16px",
            height: "100%",
            padding: 24,
            minHeight: "calc(100vh - 64px - 48px)",
          }}
        >
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  );
}
