import React, {Component} from 'react';
import { Table, Input, Button, Popconfirm, Form ,message} from 'antd';
import './index.css'
import {getEXTimetable, addEXTimetable, deleteEXTimetable, editEXTimetable, getCourse, getCoach} from "../../utils/api";
import { TimePicker } from 'antd';
import moment from 'moment';
import PubSub from 'pubsub-js'
import { Select } from 'antd';

const { Option } = Select;

const format = 'HH:mm';
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

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
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '开始时间',
                dataIndex: 'startTime',
                render: (text, record)=>{
                    return <TimePicker defaultValue={moment(text, format)} format={format} onChange={this.timeChange(record, "startTime")}/>
                }
            },
            {
                title: '结束时间',
                dataIndex: 'endTime',
                render: (text, record)=>{
                    return <TimePicker defaultValue={moment(text, format)} format={format} onChange={this.timeChange(record,"endTime")}/>
                }
            },
            {
                title: '人数上限',
                dataIndex: 'toplimit',
                editable: true,
            },
            {
                title: '备注',
                dataIndex: 'remark',
                editable: true,
            },
            {
                title: '地址',
                dataIndex: 'address',
                editable: true,
            },
            {
                title: '消耗课时',
                dataIndex: 'cost',
                editable: true,
            },
            {
                title: '教练',
                dataIndex: 'coachId',
                render: (text, record)=>{
                    return (
                        <Select defaultValue={text} style={{ width: 120 }} onChange={this.coachChange(text, record)}>
                            {
                                this.state.coach.map((item)=>{
                                  return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                                })
                            }
                        </Select>
                    )
                }
            },
            {
                title: 'operation',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record)}>
                            <Button>Delete</Button>
                        </Popconfirm>
                    ) : null,
            },
        ];

        this.state = {
            coach:[],
            dataSource: [],
            count: 2,
            selectCourse: "",
            week: "1",
            courseList:[{}]
        };
    }
    timeChange = (record, type)=>{
        return async (_,timeString)=>{
            console.log("record", record)
            console.log("timeString", timeString)
            if(type === "startTime"){
                record.startTime = timeString;
            }else if(type === "endTime"){
                record.endTime = timeString;
            }
            const result = await editEXTimetable({...record})
            if(result.code === "00000"){
                const newData = [...this.state.dataSource];
                const index = newData.findIndex(item => record.id === item.id);
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...record,
                });
                this.setState({ dataSource: newData });
            }else {
                message.error("修改失败:"+result.message);
            }
        }
    }
    coachChange = (text, record)=>{
        return async (value)=>{
            record.coachId = value;
            const result = await editEXTimetable({...record})
            console.log(result)
        }

    }
    handleChange = async (value) => {
        console.log(`selected ${value}`);
        this.setState({selectCourse: value});
        const result = await getEXTimetable({courseId: value,week: this.props.week});
        this.setState({dataSource: result.data.timetableExampleInfos, count:result.data.timetableExampleInfos.length})
    }
    async componentDidMount() {
        this.token = PubSub.subscribe('week',async (_,stateObj)=>{
            this.setState(stateObj)
            const result = await getEXTimetable({courseId: this.state.selectCourse,week: this.props.week});
            this.setState({dataSource: result.data.timetableExampleInfos, count:result.data.timetableExampleInfos.length})

        })
        const re = await getCoach();
        const res = await getCourse();
        const result = await getEXTimetable({courseId: res.data.course[0].id, week: this.props.week});
        console.log(result)
        this.setState({coach: re.data.coachInfo ,selectCourse: res.data.course[0].id,courseList:res.data.course, dataSource: result.data.timetableExampleInfos, count:result.data.timetableExampleInfos.length})
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.token);
    }

    handleDelete = async record => {
        const dataSource = [...this.state.dataSource];
        await deleteEXTimetable({id:record.id});
        this.setState({ dataSource: dataSource.filter(item => item.id !== record.id) });
    };

    handleAdd = async () => {
        const { count, dataSource } = this.state;
        const result = await addEXTimetable({startTime:`00:00`, endTime: `00:00`, toplimit: 0, remark: 'remark', address: 'address', courseId: this.state.selectCourse, week: this.state.week, cost: 1});
        console.log(result)
        const newData = {
            key: count,
            id: result.data.id,
            startTime:`00:00`,
            endTime: `00:00`,
            toplimit: 0,
            remark: 'remark',
            address: 'address',
            courseId: this.state.selectCourse,
            week: this.state.week,
            cost: 1
        };

        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };

    handleSave = async row => {
        console.log(row)
        await editEXTimetable({...row})
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ dataSource: newData });
    };

    render() {
        const { dataSource } = this.state;
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
        const defaultValue = this.state.courseList.length === 0?null:this.state.courseList[0].id;
        return (
            <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16, marginRight: 20}}>
                    Add a row
                </Button>
                {
                    defaultValue === undefined? (
                        <div/>
                    ):(
                        <Select defaultValue={defaultValue} style={{ width: 120 }} onChange={this.handleChange}>
                            {
                                this.state.courseList.map(item => (<Option value={item.id} key={item.id}>{item.name}</Option>))
                            }
                        </Select>
                    )
                }
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    rowKey={record => record.id}
                />
            </div>
        );
    }
}

export default Index;