import React, {Component} from 'react';
import { Table, Input, Button, Popconfirm, Form ,message} from 'antd';
import './index.css'
import {getTimetableByDateAndCourseId, addTimetable, deleteTimetable, editTimetable, getCourse, getCoach} from "../../utils/api";
import { TimePicker } from 'antd';
import moment from 'moment';
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
                        <Select defaultValue={text==null?null:parseInt(text)} style={{ width: 120 }} onChange={this.coachChange(text, record)}>
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
            selectCourse: this.props.match.params.courseId,
            date: this.props.match.params.date,
            courseList:[{}]
        };
    }
    timeChange = (record, type)=>{
        return async (_,timeString)=>{
            if(type === "startTime"){
                record.startTime = timeString;
            }else if(type === "endTime"){
                record.endTime = timeString;
            }
            const result = await editTimetable({...record})
            if(result.code === "00000"){
                const newData = [...this.state.dataSource];
                const index = newData.findIndex(item => record.timetableId === item.timetableId);
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
            await editTimetable({...record})
        }

    }
    handleChange = async (value) => {
        this.setState({selectCourse: value});
        const result = await getTimetableByDateAndCourseId({courseId: value,date: this.props.match.params.date});
        this.setState({dataSource: result.data.timetableInfos, count:result.data.timetableInfos?.length})
    }
    async componentDidMount() {
        const re = await getCoach();
        const res = await getCourse();
        const result = await getTimetableByDateAndCourseId({courseId: this.props.match.params.courseId ,date: this.props.match.params.date});
        this.setState({coach: re.data.coachInfo ,selectCourse: this.props.match.params.courseId,courseList:res.data.course, dataSource: result.data.timetableInfos, count:result.data.timetableInfos?.length})
    }

    componentWillUnmount() {
    }

    handleDelete = async record => {
        const dataSource = [...this.state.dataSource];
        await deleteTimetable({id:record.timetableId});
        this.setState({ dataSource: dataSource.filter(item => item.timetableId !== record.timetableId) });
    };

    handleAdd = async () => {
        const { count, dataSource } = this.state;
        const result = await addTimetable({startTime:`00:00`, endTime: `00:00`, toplimit: 0, remark: 'remark', address: 'address', courseId: this.state.selectCourse, date: this.props.match.params.date, cost:1});
        const newData = {
            key: count,
            timetableId: result.data.id,
            startTime:`00:00`,
            endTime: `00:00`,
            toplimit: 0,
            remark: 'remark',
            address: 'address',
            courseId: this.state.selectCourse,
            date: this.props.match.params.date,
            cost: 1
        };

        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };

    handleSave = async row => {
        await editTimetable({...row})
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.timetableId === item.timetableId);
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
        // const defaultValue = this.state.courseList.length === 0?null:this.state.courseList[0].id;
        const defaultValue = parseInt(this.props.match.params.courseId)
        return (
            <div>
                <div className="top">
                    <div className="top-left">
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
                    </div>
                    <div className="top-right">
                        <Button onClick={()=>{
                            this.props.history.goBack();
                        }} style={{ marginBottom: 16, marginRight: 20}} className="right">
                            back
                        </Button>
                    </div>
                </div>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    rowKey={record => record.timetableId}
                />
            </div>
        );
    }
}

export default Index;