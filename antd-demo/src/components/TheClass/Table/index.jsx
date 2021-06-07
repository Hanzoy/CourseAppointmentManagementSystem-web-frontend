import React, {Component} from 'react';
import './index.css'
import {Calendar, Select, Badge, Button, Spin} from 'antd'
import {getCourse, getTimetableByYearAndMonth,auto30Create} from '../../../utils/api'

const { Option } = Select;
class Index extends Component {

    state ={
        year:0,
        month:0,
        timetables:[],
        selectCourse:-1,
        courseList:[],
        loading: false,
    }

    constructor(props) {
        super(props);
        const date = new Date();
        this.state = {
            year: date.getFullYear(),
            month: date.getMonth()+1,
        }
    }
    async componentDidMount() {
        const result = await getTimetableByYearAndMonth({year: this.state.year, month:this.state.month})
        const res = await getCourse();
        console.log(result)
        this.setState({timetables: result.data.timetableInfos,selectCourse: res.data.course[0].id,courseList:res.data.course,loading:false})
    }

    getListData = (value)=> {
        const dateString = value._d.getFullYear()+"-"+((value._d.getMonth()+1)<10?'0'+(value._d.getMonth()+1):(value._d.getMonth()+1))+"-"+(value._d.getDate()<10?'0'+value._d.getDate():value._d.getDate())
        const list = this.state.timetables?.filter((item)=>{
          return item.date === dateString && item.courseId === this.state.selectCourse
        })
        return list||[];
    }
    dateCellRender = (value)=> {
        const listData = this.getListData(value);
        return (
            <ul className="events">
                {listData.map((item, index) => {
                    const type = index%2===0?"success":"warning"
                    return (
                        <li key={item.timetableId}>
                            {/*<Card style={{ width: "100%" , height: 80}} className="card">*/}
                            {/*    <div className="card-init">*/}
                            {/*        <div>课程时间:</div>*/}
                            {/*        <div>{item.startTime}-{item.endTime}</div>*/}
                            {/*    </div>*/}
                            {/*    <div className="card-init">*/}
                            {/*        <div>当前预约人数:</div>*/}
                            {/*        <div>{item.count}/{item.toplimit}</div>*/}
                            {/*    </div>*/}
                            {/*</Card>*/}
                            <Badge status={type} text={`课程时间:${item.startTime}-${item.endTime}`} style={{ width: "100%"}}/>
                            {/*<Badge status={type} text={`当前预约人数:${item.count}/${item.toplimit}`} style={{ width: "100%"}}/>*/}
                            <text>{`当前预约人数:${item.count}/${item.toplimit}`}</text>
                        </li>
                    )
                })}
            </ul>
        );
    }
    selectDate = (date)=>{
        const dateString = date._d.getFullYear()+"-"+((date._d.getMonth()+1)<10?'0'+(date._d.getMonth()+1):(date._d.getMonth()+1))+"-"+(date._d.getDate()<10?('0'+date._d.getDate()):date._d.getDate())
        this.props.history.push(`/home/class/table/info/${this.state.selectCourse}/${dateString}`)
    }
    render() {
        return (
            <div className="total">
                <Spin spinning={this.state.loading}>
                    <div className="total-title">
                        <div className="left">
                            {
                                this.state.selectCourse === undefined?(
                                    <div>

                                    </div>
                                ):(
                                    <Select defaultValue={this.state.selectCourse} style={{ width: 120 }} onChange={(text)=>{this.setState({selectCourse: text})}}>
                                        {
                                            this.state.courseList.map((item)=>{
                                                return (<Option value={item.id} key={item.id}>{item.name}</Option>)
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </div>
                        <div className="right">
                            <Button onClick={ async ()=>{
                                this.setState({loading:true})
                                await auto30Create({flag:"1"});
                                this.setState({loading:false})
                                window.location.reload();
                            }} style={{marginLeft: 20}}>模版导入(追加)</Button>
                            <Button onClick={ async ()=>{
                                this.setState({loading:true})
                                await auto30Create({flag:"0"});
                                this.setState({loading:false})
                                window.location.reload();
                            }} style={{marginLeft: 20}}>模版导入(覆盖)</Button>
                        </div>
                    </div>
                    <Calendar dateCellRender={this.dateCellRender} onSelect={this.selectDate} mode={"month"} className="calendar"/>
                </Spin>
            </div>
        );
    }
}

export default Index