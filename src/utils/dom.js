import Vue from 'vue'
const isServer = Vue.prototype.$isServer

// 使dom绑定事件 兼容主流浏览器
export const on = (function () {
    if (!isServer && document.addEventListener) {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false)
            }
        }
    } else {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler)
            }
        }
    }
})()
  
  // 使dom删除事件 兼容主流浏览器
  /* istanbul ignore next */
export const off = (function () {
    if (!isServer && document.removeEventListener) {
        return function (element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false)
            }
        }
    } else {
        return function (element, event, handler) {
            if (element && event) {
                element.detachEvent('on' + event, handler)
            }
        }
    }
})()

// 加载图片回调
export const loadImg = function(url) {
    let img = new Image()
    img.src = url
    return new Promise((resolve, reject) => {
        img.onload = () => {
            // console.log(img)
            resolve(img)
        }
        img.onerror = (e) => {
            reject(e)
        }
    })
}