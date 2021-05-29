import {Component} from 'react';
import {Spin} from 'antd';
import './index.css'
import { Table, Divider, Avatar, Button} from 'antd';
import {NavLink} from "react-router-dom";
import axios from "axios";

class Index extends Component {

    state = {
        loading: true,
        data : []
    }

    columns = [
        {
            title: '头像',
            dataIndex: 'avatarUrl',
            key: 'avatarUrl',
            render: text => <Avatar src={text} />
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            render: text => <NavLink to={"#"}>{text}</NavLink>
        },
        {
            title: '微信昵称',
            dataIndex: 'nickName',
            key: 'nickName'
        },
        {
            title: '电话',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '设置',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button onClick={this.setting(record)}>查看</Button>
                    {/*<NavLink to={"#"}>Invite {record.name}</NavLink>*/}
                    <Divider type="vertical" />
                    <Button >修改</Button>
                </span>
            ),
        },
    ]

    async componentDidMount() {
        const token = window.localStorage.getItem("token");
        const result = await axios.post("/manage/getAllUsers", JSON.stringify({token: token}))
        console.log(result);
        this.setState({loading:false,data:result.data.data.users});
    }

    clickRow = (record, index, event)=>{
        console.log("record",record)
        console.log("index",index)
        console.log("event", event)
    }

    setting = (record)=>{
        return ()=>{
            console.log(record);
        }
    }



    render() {
        return (
            <div>{
                this.state.loading ?
                    <Spin/> :
                    <Table columns={this.columns} dataSource={this.state.data}/>
            }</div>
        );
    }

}

export default Index;