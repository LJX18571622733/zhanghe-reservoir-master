const axios = require('axios');                       // 生成一个axios实例
axios.defaults.baseURL = 'http://220.180.11.124:8099';     // 设置请求后端的URL地址
axios.defaults.timeout = 120000;                       // axios请求超时时间
axios.defaults.withCredentials = true;


axios.defaults.headers['Content-Type'] = 'application/json';       // axios发送数 据时使用json格式
axios.defaults.transformRequest = data => JSON.stringify(data);    // 发送数据前进 行json格式化

// 第二：设置拦截器
/**
 ** 请求拦截器(当前端发送请求给后端前进行拦截)
 *例1：请求拦截器获取token设置到axios请求头中，所有请求接口都具有这个功能
 *例2：到用户访问某一个页面，但是用户没有登录，前端页面自动跳转 /login/ 页面
 */
axios.interceptors.request.use(config => {
    // 从localStorage中获取token
    // let token = localStorage.getItem('token');
    // 如果有token, 就把token设置到请求头中Authorization字段中
    // token && (config.headers.Authorization = token);
    return config;
}, error => {
    return Promise.reject(error);
});
/**
 * 响应拦截器（当后端返回数据的时候进行拦截）
 * 例1：当后端返回状态码是401/403时，跳转到 /login/ 页面
 */

axios.interceptors.response.use(response => {
    // 当响应码是 2xx 的情况, 进入这里
    // debugger
    return response.data;
}, error => {
    // 当响应码不是 2xx 的情况, 进入这里
    // debugger
    return error
});

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * */


export function get(url, params, headers) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params, headers }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

// 第三：根据上面分装好的axios对象，封装 get、post、put、delete请求
/**
 * post方法，对应post请求
 * * @param {String} url [请求的url地址]
 * * @param {Object} params [请求时携带的参数]
 **/


export function post(url, params, headers) {
    return new Promise((resolve, reject) => {
        axios.post(url, params, headers).then((res) => {
            resolve(res)
        }).catch((err) => {
            // debugger
            reject(err)
        })
    })
}

export function put(url, params, headers) {
    return new Promise((resolve, reject) => {
        axios.put(url, params, headers).then((res) => {
            resolve(res)
        }).catch((err) => {
            // debugger
            reject(err)
        })
    })
}



export function del(url, params, headers) {
    return new Promise((resolve, reject) => {
        axios.delete(url, { data: params, headers }).then((res) => {
            resolve(res)
        }).catch((err) => {
            // debugger
            reject(err)
        })
    })
}


export default axios;
