import React, {Component} from 'react';
import './index.css'
import {Modal, Button, Descriptions, Select, InputNumber, Form, Input} from "antd";
import { Card,  Divider,} from 'antd';
import { Table, Badge, Menu, Popconfirm } from 'antd';

import {getCourse, getUserInfo, addCourseTime, updateCourseTime, deleteCourseTime} from '../../../utils/api'

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
const { Option } = Select;

class EditableCell extends React.Component {
    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={this.toggleEdit}
            >
                {children}
            </div>
        );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                    children
                )}
            </td>
        );
    }
}
class Index extends Component {

    state={
        name:'',
        phone:'',
        nickName:'',
        avatarUrl:'',
        course:[],
        operation:[],
        visible: false,
        courseList:[],
        inputNumber:0,
        selectValue:-1
    }
    menu = (
        <Menu>
            <Menu.Item>Action 1</Menu.Item>
            <Menu.Item>Action 2</Menu.Item>
        </Menu>
    );
    async componentDidMount() {
        const res = await getCourse();
        const {openid} = this.props.match.params;
        const result = await getUserInfo({openid:openid});
        this.setState({...result.data.userInfo,courseList:res.data.course})
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = async e => {
        const {inputNumber, selectValue} = this.state
        console.log(e);
        this.setState({
            visible: false,
        });
        console.log(inputNumber, selectValue)
        await addCourseTime({openid:this.props.match.params.openid, courseId: selectValue, count: inputNumber})
        const res = await getCourse();
        const {openid} = this.props.match.params;
        const result = await getUserInfo({openid:openid});
        this.setState({...result.data.userInfo,courseList:res.data.course})
    };

    deleteCourseTime = (value)=>{
        return async ()=>{
            await deleteCourseTime({openid: this.props.match.params.openid, courseId: value.id})
            window.location.reload();
        }
    }

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
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
         { title: '剩余课时数量', dataIndex: 'count', key: 'count', editable: true, },
         {
             title: 'operation',
             dataIndex: 'operation',
             render: (_, record)=>{
                 return (
                     <Popconfirm title="确认删除？" okText="Yes" cancelText="No" onConfirm={this.deleteCourseTime(record)}>
                         <Button>删除</Button>
                     </Popconfirm>
                 )
             }
         },

    ];
    inputChange = (value)=>{
      this.setState({inputNumber: value})
    }
    selectChange = (value)=>{
      this.setState({selectValue:value})
    }

    handleSave = async row => {
        console.log(row)
        const result = await updateCourseTime({openid: this.props.match.params.openid, courseId: row.id, count: row.count})
        console.log(result)
        const newData = [...this.state.course];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ course: newData });
    };

    render() {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
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
                    <div className={"title"}>
                        <div className="text">课程概览</div>
                        <Button type="primary" onClick={this.showModal}>
                            添加课程
                        </Button>
                        <Modal
                            title="添加课程"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            <Select defaultValue={-1} style={{ width: 120 }} onChange={this.selectChange}>
                                <Option value={-1}>请选择课程</Option>
                                {
                                    this.state.courseList.map(item => (<Option value={item.id}>{item.name}</Option>))
                                }
                            </Select>
                            <InputNumber min={0} max={2000} defaultValue={0} onChange={this.inputChange} />
                        </Modal>
                    </div>
                    <Table
                        components={components}
                        className="components-table-demo-nested"
                        columns={columns}
                        expandedRowRender={this.expandedRowRender}
                        dataSource={this.state.course}
                        rowKey={record => record.id}
                        bordered
                    />

                </Card>
            </div>
        );
    }
}
export default Index;