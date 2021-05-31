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
//管理员获取滑动条内容
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
//管理员获取滑动条内容
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
//管理员获取滑动条内容
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
//管理员获取滑动条内容
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
//管理员获取滑动条内容
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
//管理员获取滑动条内容
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
//管理员获取滑动条内容
export const getVenue = async ()=>{
  return await Request({
    url:'/getVenue',
    method: 'GET'
  })
}
/*========================================================*/





