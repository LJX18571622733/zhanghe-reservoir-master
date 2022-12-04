import axios from 'axios'
import sysApi from '@/http/sysApi'
const sys= {
    namespaced: true,
    state: {
        userInfo: {
            userName: null,
            userCode:null,
            userRole: null,
            pageList: null
        },
        accessToken:null
    },
    mutations: {
        setUserInfo (state, data) {
            if(data){
                state.userInfo = data.userInfo;
                sessionStorage.setItem("userInfo",JSON.stringify( data.userInfo));
                sessionStorage.setItem("accessToken",data.token);
            }else
            {
                state.userInfo=JSON.parse(sessionStorage.getItem("userInfo"))
                state.accessToken=   sessionStorage.getItem("accessToken")
            } 
        
        }
    },
    actions: {
      login(context,loginModal){
      return  axios.post(sysApi.login,loginModal);
      },
      setUserInfo(context,r){
        context.commit("setUserInfo",r.data);
      }
    }
}
export default sys