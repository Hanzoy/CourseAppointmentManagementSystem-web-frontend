import React, {Component} from 'react';
import './index.css'
import {Button, Descriptions} from "antd";
import { Card,  Divider,} from 'antd';
import { Table, Badge, Menu } from 'antd';

import {getUserInfo} from '../../../utils/api'


class Index extends Component {

    state={
        name:'',
        phone:'',
        nickName:'',
        avatarUrl:'',
        course:[],
        operation:[]
    }
    menu = (
        <Menu>
            <Menu.Item>Action 1</Menu.Item>
            <Menu.Item>Action 2</Menu.Item>
        </Menu>
    );
    async componentDidMount() {
        const {openid} = this.props.match.params;
        const result = await getUserInfo({openid:openid});
        this.setState({...result.data.userInfo})
    }

     expandedRowRender = (record) => {
        const columns = [
            { title: 'Date', dataIndex: 'date', key: 'date' },
            { title: 'Time', dataIndex: 'time', key: 'time' },
            {
                title: 'Operation',
                key: 'operation',
                render: (value) => {
                    if(value.operation === "1"){
                        return (
                            <span>
                                <Badge status="success" />
                                预约
                            </span>
                        )
                    }else{
                        return (
                            <span>
                                <Badge status="error" />
                                取消预约
                            </span>
                        )
                    }

                },
            },
            { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
          //   {
          //       title: 'Action',
          //       dataIndex: 'operation',
          //       key: 'operation',
          //       render: () => (
          //           <span className="table-operation">
          //   <p>Pause</p>
          //   <p>Stop</p>
          // </span>
          //       ),
          //   },
        ];
        const data = this.state.operation.filter(item => record.name === item.courseName);
        return <Table columns={columns} dataSource={data} pagination={false} rowKey={record => record.timestamp}/>;
    };

     columns = [
         { title: '课程号', dataIndex: 'id', key: 'id' },
         { title: '课程名', dataIndex: 'name', key: 'name' },
         { title: '剩余课时数量', dataIndex: 'count', key: 'count' },
    ];
    render() {
        return (
            <div>
                <Card bordered={false}>
                    <div className="w-back">
                        <Button onClick={()=>{
                            this.props.history.goBack();
                        }} className="back">返回</Button>
                    </div>
                    <Descriptions
                        title="用户信息"
                        style={{
                            marginBottom: 32,
                        }}
                    >
                        <Descriptions.Item label="姓名">{this.state.name}</Descriptions.Item>
                        <Descriptions.Item label="微信昵称">{this.state.nickName}</Descriptions.Item>
                        <Descriptions.Item label="电话">{this.state.phone}</Descriptions.Item>
                    </Descriptions>
                    <Divider
                        style={{
                            marginBottom: 32,
                        }}
                    />
                    <div className={"title"}>课程概览</div>
                    <Table
                        className="components-table-demo-nested"
                        columns={this.columns}
                        expandedRowRender={this.expandedRowRender}
                        dataSource={this.state.course}
                        rowKey={record => record.id}
                    />

                </Card>
            </div>
        );
    }
}
export default Index;