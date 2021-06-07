import React, {Component} from 'react';
import { Upload, Icon, message } from 'antd';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import './index.css'
import {getCourse, addCourse, deleteCourse, editCourse} from "../../utils/api";
import {baseUrl} from "../../utils/request";

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

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //     message.error('Image must smaller than 2MB!');
    // }
    return isJpgOrPng;
}

class Avatar extends React.Component {
    state = {
        loading: false,
    };
    constructor(props) {
        super(props);
        if (props.record.backgroundUrl !== null) {
            this.state.imageUrl = props.record.backgroundUrl;
        }
    }
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    render() {

        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;
        return (
            <Upload
                name="file"
                method="POST"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={`${baseUrl}/course/uploadFile?id=${this.props.record.id}`}
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
            >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
        );
    }
}

class Index extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '课程名',
                dataIndex: 'name',
                width: '30%',
                editable: true,
            },
            {
                title: 'picture',
                dataIndex: 'picture',
                render: (text, record)=>{
                  return <Avatar record={record}/>
                }
            },
            {
                title: '课时单价',
                dataIndex: 'money',
                editable: true,
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
            dataSource: [],
            count: 2,
        };
    }

    async componentDidMount() {
        const result = await getCourse();
        console.log(result);
        this.setState({dataSource: result.data.course, count:result.data.course.length})
    }

    handleDelete = async record => {
        const dataSource = [...this.state.dataSource];
        await deleteCourse({id:record.id});
        this.setState({ dataSource: dataSource.filter(item => item.id !== record.id) });
    };

    handleAdd = async () => {
        const { count, dataSource } = this.state;

        const result = await addCourse({name:`name ${count}`, money:0});
        const newData = {
            key: count,
            id: result.data.id,
            name: `name ${count}`,
            money: 0
        };

        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };

    handleSave = async row => {
        await editCourse({...row})
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
        return (
            <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    Add a row
                </Button>
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