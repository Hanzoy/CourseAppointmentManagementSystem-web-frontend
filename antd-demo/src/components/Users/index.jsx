import React,{Component} from 'react';
import './index.css'
import { Table, Input, InputNumber, Popconfirm, Form, Avatar, Button } from 'antd';
import {changeUserInformation, getAllUsers, getAllUsersByKey} from "../../utils/api";
import {NavLink} from "react-router-dom";

const { Search } = Input;
const data = [];

const EditableContext = React.createContext();

class EditableCell extends Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item style={{ margin: 0 }}>
                        {getFieldDecorator(dataIndex, {
                            rules: [
                                {
                                    required: true,
                                    message: `Please Input ${title}!`,
                                },
                            ],
                            initialValue: record[dataIndex],
                        })(this.getInput())}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data, editingKey: '' };
        this.columns = [
            {
                title: '头像',
                dataIndex: 'avatarUrl',
                key: 'avatarUrl',
                width: '25px',
                editable: false,
                render: text => <Avatar src={text} size={"large"}/>
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                editable: true,
            },
            {
                title: '微信昵称',
                dataIndex: 'nickName',
                key: 'nickName',
                editable: false,
            },
            {
                title: '电话',
                dataIndex: 'phone',
                key: 'phone',
                editable: true,
            },
            {
                title: 'remark',
                dataIndex: 'remark',
                key: 'remark',
                editable: true,
            },
            {
                title: '设置',
                dataIndex: 'operation',
                render: (text, record) => {
                    const { editingKey } = this.state;
                    const editable = this.isEditing(record);
                    return editable ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <Button
                                        onClick={() => this.save(form, record.openid)}
                                        style={{ marginRight: 8 }}
                                    >
                                        保存
                                    </Button>
                                )}
                            </EditableContext.Consumer>
                            <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.openid)}>
                                <Button>取消</Button>
                            </Popconfirm>
                        </span>
                    ) : (
                        <div>
                            <NavLink to={`/home/users/info/${record.openid}`}>
                                <Button disabled={editingKey !== ''} onClick={() => this.look(record.openid)}>
                                    查看
                                </Button>
                            </NavLink>
                            &nbsp;
                            <Button disabled={editingKey !== ''} onClick={() => this.edit(record.openid)}>
                                修改
                            </Button>
                        </div>
                    );
                },
            },
        ];
    }

    async componentDidMount() {
        const result = await getAllUsers();
        console.log(result);
        this.setState({loading:false,data:result.data.users});
    }

    isEditing = record => record.openid === this.state.editingKey;

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    save(form, openid) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            console.log("row",row)
            changeUserInformation({...row, openid:openid}).then();
            const newData = [...this.state.data];
            const index = newData.findIndex(item => openid === item.openid);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({ data: newData, editingKey: '' });
            } else {
                newData.push(row);
                this.setState({ data: newData, editingKey: '' });
            }
        });
    }

    edit(openid) {
        this.setState({ editingKey: openid });
    }

    look(openid){
        console.log(openid)
    }

    onSearch = async (value) => {
        const result = await getAllUsersByKey({key:value});
        console.log(result);
        this.setState({loading:false,data:result.data.users});
    };

    render() {
        const components = {
            body: {
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
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        return (
            <EditableContext.Provider value={this.props.form}>
                <div className="search-box">
                    <Search
                        placeholder="input search text"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={this.onSearch}
                        className="search-in"
                    />
                </div>
                <Table
                    components={components}
                    bordered
                    dataSource={this.state.data}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: this.cancel,
                    }}
                    rowKey={(record, index) => index}
                />
            </EditableContext.Provider>
        );
    }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;