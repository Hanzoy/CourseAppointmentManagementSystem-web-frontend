import React, {Component} from 'react';
import {NavLink, Redirect, Route, Switch} from 'react-router-dom';
import TheIndex from '../TheIndex'
import Users from '../Users'
import Client from '../Client'
import TheClass from '../TheClass'
import SettingAdmin from '../SettingAdmin'
import SettingPassword from '../SettingPassword'
import './index.css';
import { Menu, Icon, Layout, Breadcrumb } from 'antd';
const { SubMenu } = Menu;
const {Header, Content, Footer, Sider } = Layout

class Index extends Component {
    state = {
        collapsed: false,
    };

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    logout = ()=>{
        const localStorage = window.localStorage;
        localStorage.removeItem("token");
        this.props.history.push('/login')
    }

    render() {
        const storage = window.localStorage;
        if(storage.getItem("token") == null){
            return <Redirect to="/login"/>
        }
        return (<Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.toggleCollapsed}>
                <div className="logo" />
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}
                >
                    <Menu.Item key="1">
                        <NavLink to="/home/index">
                            <Icon type="pie-chart" />
                            <span>首页</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <NavLink to="/home/users">
                            <Icon type="team" />
                            <span>用户管理</span>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <NavLink to="/home/client">
                            <Icon type="inbox" />
                            <span>客户端管理</span>
                        </NavLink>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                            <Icon type="mail" />
                            <span>课程管理</span>
                        </span>
                        }
                    >
                        <Menu.Item key="5"><NavLink to="/home/class">课程</NavLink></Menu.Item>
                        <Menu.Item key="6"><NavLink to="/home/class">课程</NavLink></Menu.Item>
                        <Menu.Item key="7"><NavLink to="/home/class">课程</NavLink></Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        title={
                            <span>
                            <Icon type="appstore" />
                            <span>设置</span>
                        </span>
                        }
                    >
                        <Menu.Item key="9"><NavLink to="/home/setting/admin">管理员设置</NavLink></Menu.Item>
                        <Menu.Item key="10"><NavLink to="/home/setting/changePassword">修改密码</NavLink></Menu.Item>
                        {/*<SubMenu key="sub3" title="Submenu">*/}
                        {/*    <Menu.Item key="11">Option 11</Menu.Item>*/}
                        {/*    <Menu.Item key="12">Option 12</Menu.Item>*/}
                        {/*</SubMenu>*/}
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }} className="header">
                    <div className="logout" onClick={this.logout}>
                        <div className="header-name">
                            退出登录
                        </div>
                        <Icon type="logout" />
                    </div>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                    </Breadcrumb>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                        <Switch>
                            <Route exact path="/" component={TheIndex}/>
                            <Route exact path="/home" component={TheIndex}/>
                            <Route path="/home/index" component={TheIndex}/>
                            <Route path="/home/users" component={Users}/>
                            <Route path="/home/client" component={Client}/>
                            <Route path="/home/class" component={TheClass}/>
                            <Route path="/home/setting/admin" component={SettingAdmin}/>
                            <Route path="/home/setting/changePassword" component={SettingPassword}/>
                        </Switch>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Power by Ant Design ©2021 Created by Hanzoy</Footer>
            </Layout>
        </Layout>
        );
    }
}

export default Index;