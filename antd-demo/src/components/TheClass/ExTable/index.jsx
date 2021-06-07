import React, {Component} from 'react';
import './index.css'
import { Menu, } from 'antd';
import {NavLink} from "react-router-dom";
import EXTheTable from '../../EXTheTable'
import Pubsub from 'pubsub-js'

class Index extends Component {
    state = {
        current: '1',
    };

    handleClick = e => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
        Pubsub.publish("week",{week:e.key})
    };
    render() {
        return (
            <div>
                <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal">
                    <Menu.Item key="1">
                        <NavLink to="/home/class/exTable/1">
                            星期一
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <NavLink to="/home/class/exTable/2">
                            星期二
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <NavLink to="/home/class/exTable/3">
                            星期三
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <NavLink to="/home/class/exTable/4">
                            星期四
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="5">
                        <NavLink to="/home/class/exTable/5">
                            星期五
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <NavLink to="/home/class/exTable/6">
                            星期六
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="7">
                        <NavLink to="/home/class/exTable/7">
                            星期天
                        </NavLink>
                    </Menu.Item>
                </Menu>
                <div className="table">
                    <EXTheTable week={this.state.current}/>
                </div>
            </div>
        );
    }
}

export default Index;