import React, {Component} from 'react';
import {message, Button, Input} from 'antd'
import './index.css'
import {changePassword} from '../../utils/api'

class Index extends Component {

    state = {
        oldPassword:"",
        newPassword:"",
        newPassword2:""
    }

    old = (event)=>{
      this.setState({oldPassword:event.target.value})
    }
    ne = (event)=>{
        this.setState({newPassword:event.target.value})
    }
    ne2 = (event)=>{
        this.setState({newPassword2:event.target.value})
    }
    changePassword = async ()=>{
      if(this.state.newPassword !== this.state.newPassword2){
          message.error('两次密码不一致');
      }else{
          const result = await changePassword({...this.state})
          if(result.code !== "00000"){
              message.error(result.message);
          }else{
              message.success("修改成功");
              window.localStorage.removeItem("token");
              window.location.reload();
          }
      }
    }
    render() {
        return (
            <div className="total">
                <div className="example-input">
                    <Input size="large" type="password" placeholder="旧密码" onChange={this.old} onPressEnter={this.changePassword}/>
                    <Input size="large" type="password" placeholder="新密码" onChange={this.ne}/>
                    <Input size="large" type="password" placeholder="再次输入新密码" onChange={this.ne2}/>
                </div>
                <div className="sub">
                    <Button style={{width:"20%"}} onClick={this.changePassword} >
                        提交
                    </Button>
                </div>
            </div>
        );
    }
}

export default Index;