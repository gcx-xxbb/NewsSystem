import React from 'react'
import { Button } from 'antd';
import axios from 'axios';

const ajax = () =>{
  //取数据
  // axios.get('http://localhost:8000/posts').then(res=>{
  //   console.log(res.data);
  // })

  //插入数据 post
  // axios.post('http://localhost:8000/posts',{
  //   title:"只因你太美",
  //   author:"ikun"
  // })

  // //修改 put
  // axios.put('http://localhost:8000/posts/1' ,{
  //   title:'hahahahahaha',
  //   author:'kunkun'
  // })

  // //更新 patch
  // axios.patch('http://localhost:8000/posts/2',{
  //   title:'woshilaoer'
  // })

  //删除
  // axios.delete('http://localhost:8000/posts/4')

  //_embed
  // axios.get('http://localhost:8000/posts?_embed=comments').then(res=>{
  //   console.log(res.data);
  // })

  //_expand
  axios.get('http://localhost:8000/comments?_expand=post').then(
    res=>{
      console.log(res.data)
    }
  )
} 


export default function Home() {
  return (
    <div>
        <Button type="primary" onClick={ajax}>Button</Button>
    </div>
  )
}
