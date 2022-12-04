let cfg = window.cfg = {
    "坝上": '50500301',   //水位
    "坝上id": '45',   //水位
    "降雨量": '50522600',
    "降雨量id": '44',
    "温度":'QW01',
    "温度id":'293',
    hdzs:'50500303',
    rscd: 'BEA17000361',
    ctx:'/rsvrApi',
};
window.dataTimeFormat = function() {
    let now = new Date();
    let TwoDaysAgo = new Date();

    //获取当前时间的毫秒数
    let nowMilliSeconds = now.getTime();
    //用获取毫秒数 减去两天的毫秒数 赋值给TwoDaysAgo对象（一天有86400000毫秒）
    TwoDaysAgo.setTime(nowMilliSeconds - (2 * 86400000));

    //通过赋值后的TwoDaysAgo对象来得到 两天前的 年月日。这里我们将日期格式化为20180301的样子。
    //格式化日，如果小于9，前面补0
    let day = ("0" + TwoDaysAgo.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0
    let month = ("0" + (TwoDaysAgo.getMonth() + 1)).slice(-2);
    //拼装完整日期格式
    let getOldToday = TwoDaysAgo.getFullYear() + '-' + (month) + '-' + (day) + ' 00:00:00';

    let nowDay = ("0" + now.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0
    let nowMonth = ("0" + (now.getMonth() + 1)).slice(-2);
    //拼装完整日期格式
    let getToday = now.getFullYear() + '-' + (nowMonth) + '-' + (nowDay) + ' 00:00:00';

    return {old:getOldToday,now:getToday}
};
