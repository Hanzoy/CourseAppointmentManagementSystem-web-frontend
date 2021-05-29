import React, {Component} from 'react';
import './index.css';
import Login from 'ant-design-pro/lib/Login';
import 'ant-design-pro/dist/ant-design-pro.css';
import { Alert, Checkbox, message } from 'antd';
import axios from 'axios'
const { Tab, UserName, Password,  Submit } = Login;

class Index extends Component {
    state = {
        notice: '',
        type: 'tab1',
        autoLogin: true,
    };
    onSubmit = (err, values) => {
        console.log('value collected ->', {
            ...values,
            autoLogin: this.state.autoLogin,
        });
        if (this.state.type === 'tab1') {
            this.setState(
                {
                    notice: '',
                },
                async () => {
                    const data = JSON.stringify({password:values.password, username:values.username})
                    const response = await axios.post('/manage/login', data);
                    console.log(response)
                    if(response.data.code !== "00000"){
                        message.error('登陆失败：'+response.data.message);
                    }else{
                        const localStorage = window.localStorage;
                        localStorage.setItem("token", response.data.data.token);
                        this.props.history.push("/");
                    }
                    // if (!err && (values.username !== 'admin' || values.password !== '888888')) {
                    //     setTimeout(() => {
                    //         this.setState({
                    //             notice: 'The combination of username and password is incorrect!',
                    //         });
                    //     }, 500);
                    // }
                }
            );
        }
    };
    onTabChange = key => {
        this.setState({
            type: key,
        });
    };
    changeAutoLogin = e => {
        this.setState({
            autoLogin: e.target.checked,
        });
    };
    render() {
        return (
            <div className="login-body">
                <div className="context">
                    <div className="login-warp">
                        <Login
                            defaultActiveKey={this.state.type}
                            onTabChange={this.onTabChange}
                            onSubmit={this.onSubmit}
                        >
                            <Tab key="tab1" tab="Account">
                                {this.state.notice && (
                                    <Alert
                                        style={{ marginBottom: 24 }}
                                        message={this.state.notice}
                                        type="error"
                                        showIcon
                                        closable
                                    />
                                )}
                                <UserName name="username" />
                                <Password name="password" />
                            </Tab>

                            <div>
                                <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
                                    Keep me logged in
                                </Checkbox>
                            </div>
                            <Submit>Login</Submit>
                        </Login>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;