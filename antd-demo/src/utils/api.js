import Request from './request'

const localStorage = window.localStorage;

const returnLogin = ()=>{
  window.localStorage.removeItem("token");
  window.location.href = '/login';
}
/*========================================================*/
//检查token


export const checkToken = async ()=>{
  return await Request({
    url:'/user/checkToken',
    method: 'POST',
    data: {
      token: localStorage.getItem("token")

    }
  })
}
/*========================================================*/

/*========================================================*/
//登陆
export const login = async (param)=>{
  return await Request({
    url:'/manage/login',
    method: 'POST',
    data: {
      token: localStorage.getItem("token"),
      ...param
    }
  })
}

/*========================================================*/

/*========================================================*/
//查询所有用户

export const getAllUsers = async ()=>{
  const result = await Request({
    url: '/manage/getAllUsers',
    method: 'POST',
    data:{
      token: localStorage.getItem("token")
    }
  })
  if(result.code === "A0220"){
    returnLogin();
  }else{
    return result;
  }
}

/*========================================================*/

/*========================================================*/
//查询所有用户

export const getAllUsersByKey = async (param)=>{
  const result = await Request({
    url: '/manage/getAllUsersByKey',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
  if(result.code === "A0220"){
    returnLogin();
  }else{
    return result;
  }
}

/*========================================================*/

/*========================================================*/
//修改用户信息
export const changeUserInformation = async (param)=>
    await Request({
      url: '/manage/changeUserInformation',
      method: 'POST',
      data:{
        token: localStorage.getItem("token"),
        ...param
      }
    })

/*========================================================*/

/*========================================================*/
//查看用户详情
export const getUserInfo = async (param)=>{
  return await Request({
    url:'/manage/getUserInfo',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}

/*========================================================*/

/*========================================================*/
//管理员获取滑动条内容
export const manageGetSwiper = async ()=>{
  return await Request({
    url:'/manageGetSwiper',
    method: 'POST',
    data:{
      token: localStorage.getItem("token")
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员添加滑动条内容
export const addSwiper = async (param)=>{
  return await Request({
    url:'/addSwiper',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员添加课程模版
export const addEXTimetable = async (param)=>{
  return await Request({
    url:'/manage/addEXTimetable',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员添加场馆
export const addVenue = async (param)=>{
  return await Request({
    url:'/addVenue',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员添加场馆
export const addCoach = async (param)=>{
  return await Request({
    url:'/addCoach',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//添加课程
export const addCourse = async (param)=>{
  return await Request({
    url:'/course/addCourse',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员删除滑动条内容
export const deleteSwiper = async (param)=>{
  return await Request({
    url:'/deleteSwiper',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员删除滑动条内容
export const deleteEXTimetable = async (param)=>{
  return await Request({
    url:'/manage/deleteEXTimetable',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员删除场馆
export const deleteVenue = async (param)=>{
  return await Request({
    url:'/deleteVenue',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员删除场馆
export const deleteCoach = async (param)=>{
  return await Request({
    url:'/deleteCoach',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员修改滑动条内容
export const editSwiper = async (param)=>{
  return await Request({
    url:'/editSwiper',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员修改课程模版
export const editEXTimetable = async (param)=>{
  return await Request({
    url:'/manage/editEXTimetable',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员修改课程
export const editCourse = async (param)=>{
  return await Request({
    url:'/course/editCourse',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员修改课程
export const deleteCourse = async (param)=>{
  return await Request({
    url:'/course/deleteCourse',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员修改场馆
export const editVenue = async (param)=>{
  return await Request({
    url:'/editVenue',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员修改场馆
export const editCoach = async (param)=>{
  return await Request({
    url:'/editCoach',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//管理员获取场馆信息
export const getVenue = async ()=>{
  return await Request({
    url:'/getVenue',
    method: 'GET'
  })
}
/*========================================================*/

/*========================================================*/
//管理员获取教练信息
export const getCoach = async ()=>{
  return await Request({
    url:'/getCoach',
    method: 'GET'
  })
}
/*========================================================*/

/*========================================================*/
//管理员获取课程信息
export const getCourse = async ()=>{
  return await Request({
    url:'/course/getCourse',
    method: 'POST',
    data:{
      token: localStorage.getItem("token")
    }
  })
}
/*========================================================*/

/*========================================================*/
//查看课程表模版
export const getEXTimetable = async (param)=>{
  return await Request({
    url:'/manage/getEXTimetable',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//查看课程表模版
export const addCourseTime = async (param)=>{
  return await Request({
    url:'/user/addCourseTime',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//查看课程表模版
export const updateCourseTime = async (param)=>{
  return await Request({
    url:'/user/updateCourseTime',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//查看课程表模版
export const getTimetableByYearAndMonth = async (param)=>{
  return await Request({
    url:'/course/getTimetableByYearAndMonth',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//查看课程表模版
export const getTimetableByDateAndCourseId = async (param)=>{
  return await Request({
    url:'/course/getTimetableByDateAndCourseId',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//新增课程表
export const addTimetable = async (param)=>{
  return await Request({
    url:'/course/addTimetable',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//删除课程表
export const deleteTimetable = async (param)=>{
  return await Request({
    url:'/course/deleteTimetable',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/


/*========================================================*/
//删除课程表
export const editTimetable = async (param)=>{
  return await Request({
    url:'/course/editTimetable',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//删除课程表
export const auto30Create = async (param)=>{
  return await Request({
    url:'/auto30Create',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//删除课程表
export const changePassword = async (param)=>{
  return await Request({
    url:'/manage/changePassword',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/

/*========================================================*/
//删除课程表
export const deleteCourseTime = async (param)=>{
  return await Request({
    url:'/user/deleteCourseTime',
    method: 'POST',
    data:{
      token: localStorage.getItem("token"),
      ...param
    }
  })
}
/*========================================================*/




