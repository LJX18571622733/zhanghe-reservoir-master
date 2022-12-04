import Vue from 'vue'

Vue.filter("numtoFixed", function (val, num) {
  return val == null ? "--" : val.toFixed(num);
})


Vue.filter("formatTime", function (val, step) {
  if (val && step == '小时') {
    return (/\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}/g.exec(val))[0]
  } else if (val && step == '日') {
    return (/\d{4}-\d{1,2}-\d{1,2}/g.exec(val))[0]
  } else if (val && step == '月') {
    return (/\d{4}-\d{1,2}/g.exec(val))[0]
  } else if (val && step == '年') {
    return (/\d{4}/g.exec(val))[0]
  } else {
    return null
  }
})
