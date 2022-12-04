export const stcd = {
    "坝上": 'MSSK09',   //水位
    "降雨量": 'MSSK08',
    "温度": 'mstm01',
    rscd: 'BEA17000361',
    aesKey: '6452765859226429'
};

export const hours = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 },
    { label: 7, value: 7 },
    { label: 8, value: 8 },
    { label: 9, value: 9 },
    { label: 10, value: 10 },
    { label: 11, value: 11 },
    { label: 12, value: 12 },
    { label: 13, value: 13 },
    { label: 14, value: 14 },
    { label: 15, value: 15 },
    { label: 16, value: 16 },
    { label: 17, value: 17 },
    { label: 18, value: 18 },
    { label: 19, value: 19 },
    { label: 20, value: 20 },
    { label: 21, value: 21 },
    { label: 22, value: 22 },
    { label: 23, value: 23 },
    { label: 24, value: 24 }
];

export const days = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 },
    { label: 7, value: 7 },
    { label: 8, value: 8 },
    { label: 9, value: 9 },
    { label: 10, value: 10 },
    { label: 11, value: 11 },
    { label: 12, value: 12 },
    { label: 13, value: 13 },
    { label: 14, value: 14 },
    { label: 15, value: 15 },
    { label: 16, value: 16 },
    { label: 17, value: 17 },
    { label: 18, value: 18 },
    { label: 19, value: 19 },
    { label: 20, value: 20 },
    { label: 21, value: 21 },
    { label: 22, value: 22 },
    { label: 23, value: 23 },
    { label: 24, value: 24 },
    { label: 25, value: 25 },
    { label: 26, value: 26 },
    { label: 27, value: 27 },
    { label: 28, value: 28 },
    { label: 29, value: 29 },
    { label: 30, value: 30 },
    { label: 31, value: 31 }
];

//统计粒度
export const optionDay = [
    /*{label: '1时', value: '1时'},
    {label: '3时', value: '3时'},
    {label: '6时', value: '6时'},
    {label: '12时', value: '12时'},*/
    { label: '小时', value: '小时' },
    { label: '日', value: '日' },
    /*  {label: '周', value: '周'},
      {label: '旬', value: '旬'},*/
    { label: '月', value: '月' },
    /* {label: '季', value: '季'},*/
    { label: '年', value: '年' },
];

//统计粒度1
export const optionDays = [
    { label: '小时', value: '小时' },
    { label: '日', value: '日' },
    /* {label: '周', value: '周'},
     {label: '旬', value: '旬'},*/
    { label: '月', value: '月' },
    /*  {label: '季', value: '季'},*/
    { label: '年', value: '年' },
];

//统计粒度2
export const optionDayTime = [
    { label: '日', value: '日' },
    /*    {label: '周', value: '周'},
        {label: '旬', value: '旬'},*/
    { label: '月', value: '月' },
    /*{label: '季', value: '季'},*/
    { label: '年', value: '年' },
];

//统计粒度2
export const optionDayTime2 = [
    { label: '小时', value: '小时' },
    { label: '日', value: '日' },
    /* {label: '旬', value: '旬'},*/
    { label: '月', value: '月' },
    /*{label: '季', value: '季'},*/
    { label: '年', value: '年' },
];

//统计粒度3
export const optionDayTime3 = [
    { label: '小时', value: '小时' },
    { label: '日', value: '日' }
];

//统计方法
export const optionWay = [
    { label: '平均值', value: '平均' },
    { label: '最小值', value: '最小' },
    { label: '最大值', value: '最大' },
    { label: '期初值', value: '期初' },
    { label: '期末值', value: '期末' }
];

//统计方法降雨
export const optionWayRain = [
    { label: '平均值', value: '平均' },
    { label: '最小值', value: '最小' },
    { label: '最大值', value: '最大' },
    { label: '累计值', value: '累计' }
];


//统计规则
export const optionG = [
    { label: '水文时间-8时', value: '水文时间8时' },
    { label: '日历时间-0时', value: '日历时间0时' }
];

//水平位移监测类型
export const optionJg = [
    { label: 'X方向水平位移', value: 'X方向水平位移' },
    { label: 'Y方向水平位移', value: 'Y方向水平位移' }
]

// 日期时间区间选择器 快捷选项配置
// 注： 时间顺序由近及远排列，方便查找，添加新的之前看下是否已有该快捷选项
export const datetimerangeOpt = {
    // 当前小时: 当前小时0分0秒至当前时间
    'hour': picker => {
        let current = new Date()
        let start = new Date()
        start.setMinutes(0, 0, 0)//取0分0秒
        picker.$emit('pick', [start, current])
    },
    // 近三小时：当前后退三小时至当前时间
    'recent_three_hours': picker => {
        let current = new Date()
        let start = new Date()
        start.setTime(current.getTime() - 3600 * 1000 * 3)
        picker.$emit('pick', [start, current])
    },
    //今日： 今日八时至当前时间，如果当前时间为八时之前取昨日八时至当前时间
    'today': picker => {
        let current = new Date()
        let eightClock = new Date()
        eightClock.setHours(8, 0, 0) //取当天八点
        if (eightClock.getTime() > current.getTime()) {
            let start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            start.setHours(8, 0, 0) //取昨天八点
            picker.$emit('pick', [start, current])
        } else {
            picker.$emit('pick', [eightClock, current])
        }
    },
    //昨日：昨日八时至今日八时，如果当前时间为八时之前取前天八时至昨日八时
    'yesterday': picker => {
        let current = new Date()
        let yes_eight = new Date()
        let eightClock = new Date()
        //取当天八点
        eightClock.setHours(8, 0, 0)
        //取昨天八点
        yes_eight.setTime(yes_eight.getTime() - 3600 * 1000 * 24 * 1)
        yes_eight.setHours(8, 0, 0)
        if (eightClock.getTime() > current.getTime()) {
            let start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
            start.setHours(8, 0, 0) //取前天八点
            picker.$emit('pick', [start, yes_eight])
        } else {
            picker.$emit('pick', [yes_eight, eightClock])
        }
    },
    //近三天：取三日前的一天八时至当前时间，如果当前时间为八时之前取四天前的一天八时至当前
    'recent_three_days': picker => {
        let current = new Date()
        let start = new Date()
        let eightClock = new Date()
        //取当天八点
        eightClock.setHours(8, 0, 0)
        if (eightClock.getTime() > current.getTime()) {
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 4) //4天前
        } else {
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3) //3天前
        }
        start.setHours(8, 0, 0) //取八点
        picker.$emit('pick', [start, current])
    },
    //近七天：取七日前的一天八时至当前时间，如果当前时间为八时之前取四天前的一天八时至当前
    'recent_seven_days': picker => {
        let current = new Date()
        let start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7) //7天前
        picker.$emit('pick', [start, current])
    },
    //本周：取本周周一八时至当前时间，如果当前是周一八时前，取上一周周一八时至当前时间。
    'week': picker => {
        let current = new Date()
        let start = new Date()
        let day = start.getDay()
        let eightClock = new Date()
        //取当天八点
        eightClock.setHours(8, 0, 0)
        if (day == 0) day = 7
        if (day == 1 && eightClock.getTime() > current.getTime()) {
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7) // 取上一周周一
        } else {
            start.setTime(start.getTime() - 3600 * 1000 * 24 * (day - 1)) // 取本周周一
        }
        start.setHours(8, 0, 0) //取八点
        picker.$emit('pick', [start, current])
    },
    //近十天：取十日前的一天八时至当前时间，如果当前时间为八时之前取十一天前的一天八时至当前
    'recent_ten_days': picker => {
        let current = new Date()
        let start = new Date()
        let eightClock = new Date()
        //取当天八点
        eightClock.setHours(8, 0, 0)
        if (eightClock.getTime() > current.getTime()) {
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 11) //取十一天前
        } else {
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 10) //取十天前
        }
        start.setHours(8, 0, 0) //取八点
        picker.$emit('pick', [start, current])
    },
    //本月：取本月一日八时至当前时间，如果当前时间是本月一日八时前，取上一月一日八时至当前时间。
    'month': picker => {
        let current = new Date()
        let start = new Date()
        start.setTime(new Date(start.getFullYear(), start.getMonth(), 1)) //取本月一日
        start.setHours(8,0,0) //取八点
        if (start.getTime() > current.getTime()) {
            // 取上一月一日
            let month = start.getMonth()
            if (month == 0) { //如果是一月，上月是上一年的十二月
                start.setTime(new Date(start.getFullYear() - 1, 11, 1)) 
            } else {
                start.setTime(new Date(start.getFullYear(), start.getMonth() - 1, 1)) 
            }
            start.setHours(8,0,0) //取八点
        }
        picker.$emit('pick', [start, current])
    },
    //近三十天：取三十日前的一天八时至当前时间，如果当前时间为八时之前取四天前的一天八时至当前
    'recent_thirty_days': picker => {
        let current = new Date()
        let start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30) //30天前
        picker.$emit('pick', [start, current])
    },
    //上月：取上月一日八时至当前时间
    'last_month': picker => {
        let current = new Date()
        let start = new Date()
        if (start.getHours() < 8 && start.getDate() == 1) {
            start.setTime(new Date(start.getFullYear(), start.getMonth() - 2, 1)) //取上上月一日
            current.setTime(new Date(current.getFullYear(), current.getMonth() - 1, 1)) //取上月一日
        } else {
            start.setTime(new Date(start.getFullYear(), start.getMonth() - 1, 1)) //取上月一日
            current.setTime(new Date(current.getFullYear(), current.getMonth(), 1)) //取上月一日
        }
        start.setHours(8, 0, 0) //取八点
        current.setHours(8, 0, 0) //取八点
        picker.$emit('pick', [start, current])
    },
    //本年：取本年一月一日八时至当前时间，如果当前时间是本年一月一日早八时前，取上一年一月一日早
    'year': picker => {
        let current = new Date()
        let start = new Date()
        start.setTime(new Date(start.getFullYear(), 0, 1)) //取本年一月一日
        start.setHours(8,0,0) //取八点
        if (start.getTime() > current.getTime()) {
            // 取上一年一月一日
            start.setTime(new Date(start.getFullYear() - 1, 0, 1))
            start.setHours(8,0,0) //取八点
        }
        picker.$emit('pick', [start, current])
    },
    // 近十二小时
    'recent_twelve_hour': picker => {
        let current = new Date()
        let start = new Date()
        start.setTime(current.getTime() - 3600 * 1000 * 12)
        picker.$emit('pick', [start, current])
    },
    // 今日零时
    'recent_zero_hour': picker => {
        let current = new Date()
        let start = new Date()
        start.setHours(0, 0, 0) //取八点
        picker.$emit('pick', [start, current])
    },
    // 昨日零时
    'yesterday_zero_hour': picker => {
        let current = new Date()
        let start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
        start.setHours(0, 0, 0) //取八点
        current.setHours(0, 0, 0) //取八点
        picker.$emit('pick', [start, current])
    },
    //去年：取去年一月一日八时至当前时间
    'last_year': picker => {
        let current = new Date()
        let start = new Date()
        if (start.getHours() < 8 && start.getMonth() + 1 == 1 && start.getDate() == 1) {
            start.setTime(new Date(start.getFullYear() - 2, 0, 1)) //取前年一月一日
            current.setTime(new Date(new Date().getFullYear() - 1, 0, 1)) //取前年一月一日
        } else {
            start.setTime(new Date(start.getFullYear() - 1, 0, 1)) //取去年一月一日
            current.setTime(new Date(new Date().getFullYear(), 0, 1)) //取本年一月一日
        }
        start.setHours(8, 0, 0) //取八点
        current.setHours(8, 0, 0) //取八点
        picker.$emit('pick', [start, current])
    },
    //近十二个月：取近十二个月一日早八点
    'recent_twelve_month': picker => {
        let current = new Date()
        let start = new Date()
        if (start.getHours() < 8 && start.getMonth() + 1 == 1 && start.getDate() == 1) {
            start.setTime(new Date(start.getFullYear() - 1, start.getMonth() - 1, 1)) //取近十三个月一日
        } else {
            start.setTime(new Date(start.getFullYear() - 1, start.getMonth(), 1)) //取近十二个月一日
        }
        start.setHours(8, 0, 0) //取八点
        picker.$emit('pick', [start, current])
    },
    //近三年：取三年一月一日八时至当前时间
    'recent_twree_year': picker => {
        let current = new Date()
        let start = new Date()
        if (start.getHours() < 8 && start.getMonth() + 1 == 1 && start.getDate() == 1) {
            start.setTime(new Date(start.getFullYear() - 4, 0, 1)) //取四年前一月一日
        } else {
            start.setTime(new Date(start.getFullYear() - 3, 0, 1)) //取三年前一月一日
        }
        start.setHours(8, 0, 0) //取八点
        picker.$emit('pick', [start, current])
    },
    //近五年：取五年前一月一日八时至当前时间
    'recent_five_year': picker => {
        let current = new Date()
        let start = new Date()
        if (start.getHours() < 8 && start.getMonth() + 1 == 1 && start.getDate() == 1) {
            start.setTime(new Date(start.getFullYear() - 6, 0, 1)) //取六年前一月一日
        } else {
            start.setTime(new Date(start.getFullYear() - 5, 0, 1)) //取五年前一月一日
        }
        start.setHours(8, 0, 0) //取八点
        picker.$emit('pick', [start, current])
    },
    //近十年：取十年前一月一日八时至当前时间
    'recent_ten_year': picker => {
        let current = new Date()
        let start = new Date()
        if (start.getHours() < 8 && start.getMonth() + 1 == 1 && start.getDate() == 1) {
            start.setTime(new Date(start.getFullYear() - 11, 0, 1)) //取十一年前一月一日
        } else {
            start.setTime(new Date(start.getFullYear() - 10, 0, 1)) //取十年前一月一日
        }
        start.setHours(8, 0, 0) //取八点
        picker.$emit('pick', [start, current])
    },
    //近二十年：取十年前一月一日八时至当前时间
    'recent_twenty_year': picker => {
        let current = new Date()
        let start = new Date()
        if (start.getHours() < 8 && start.getMonth() + 1 == 1 && start.getDate() == 1) {
            start.setTime(new Date(start.getFullYear() - 21, 0, 1)) //取二十一年前一月一日
        } else {
            start.setTime(new Date(start.getFullYear() - 20, 0, 1)) //取二十年前一月一日
        }
        start.setHours(8, 0, 0) //取八点
        picker.$emit('pick', [start, current])
    },
}

export const datetimerangeShortcuts = function (types) {
    let options = []
    types.forEach(type => {
        options.push({
            text: type.label,
            onClick: datetimerangeOpt[type.value]
        })
    })
    return options
}
