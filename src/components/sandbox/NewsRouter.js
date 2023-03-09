import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "../../views/sandbox/home/Home";
import UserList from "../../views/sandbox/user-manage/UserList";
import RoleList from "../../views/sandbox/right-manage/RoleList";
import RightList from "../../views/sandbox/right-manage/RightList";
import NoPermission from "../../views/sandbox/nopermission/NoPermission";
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory";
import Audit from "../../views/sandbox/audit-manage/Audit";
import AditList from "../../views/sandbox/audit-manage/AditList";
import Unpublished from "../../views/sandbox/publish-manage/Unpublished";
import Published from "../../views/sandbox/publish-manage/Published";
import Sunset from "../../views/sandbox/publish-manage/Sunset";
import axios from "axios";

const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset,
};

export default function NewsRouter() {
  const [BackRouteList, setBackRouteList] = useState([]);
  useEffect(() => {
    Promise.all([
      axios.get("/rights"),
      axios.get("/children"),
    ]).then((res) => {
      // console.log(res,"asd");
      setBackRouteList([...res[0].data, ...res[1].data]);
    });
  }, []);

  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))

  const checkRoute = (item)=>{
    return LocalRouterMap[item.key] && item.pagepermisson
  }

  const checkUserPermission = (item) =>{
    //判断当前登录用户的权限列表是否包含item.key
    return rights.includes(item.key)
  }
  
  return (
    <div>
      <Switch>
        {/* <Route path="/home" component={Home} />
        <Route path="/user-manage/list" component={UserList} />
        <Route path="/right-manage/role/list" component={RoleList} />
        <Route path="/right-manage/right/list" component={RightList} /> */}
        {BackRouteList.map((item) => {
         if(checkRoute(item) && checkUserPermission(item)){
          return (
            <Route
              path={item.key}
              component={LocalRouterMap[item.key]}
              key={item.key}
              exact
            />
          );
         }else{
          return null
         }
         
        })}

        <Redirect from="/" to="/home" exact />
        {BackRouteList.length > 0 && (
          <Route path="*" component={NoPermission} />
        )}
      </Switch>
    </div>
  );
}
