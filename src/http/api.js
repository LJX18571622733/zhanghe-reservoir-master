import axios from "axios";
import qs from 'qs'
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    let token = localStorage.getItem("accessToken")
    if (token) {
        // config.headers.token = token;    //将token放到请求头发送给服务器
        config.headers['token'] = token;


        //这里经常搭配token使用，将token值配置到tokenkey中，将tokenkey放在请求头中
        // config.headers['accessToken'] = Token;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
/**     * 首页     * **/
//获取综合应用树的接口
export const getTree = () => {
    return axios.get(window.cfg['ctx'] + "/pub/comApp/gettree")
}

//获取视频的测点
export const getVideo = (params) => {
    return axios.post(window.cfg['ctx'] + "/map/point/video", params)
}

//右侧工情信息
export const getRightInfo = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/pub/list", params)
}

//获取报警点列表
export const warning = () => {
    return axios.get(window.cfg['ctx'] + "/map/point/warn")
}

//根据typeid获取弹窗信息
export const getTabsListByType = (sttp) => {
    return axios.get(window.cfg['ctx'] + "/pub/getTabsListByType/" + sttp)
}

//获取右侧水雨情信息
export const getRightRain = () => {
    return axios.get(window.cfg['ctx'] + "/st/RsvrR/wr/list")
}
//获取右侧水雨情信息 - 新
export const getRightWRInfo = () => {
    return axios.get(window.cfg['ctx'] + "/st/RsvrR/wr/rightWRInfo")
}

//根据type获取测点
export const getPointListByType = (type) => {
    return axios.get(window.cfg['ctx'] + "/pub/getPointListByType/" + type)
}
export const getNewPointListByType = (type) => {
    return axios.get(window.cfg['ctx'] + "/pub/point/pointBySttp/" + type)
}

/**     防洪安全   */


//实时水情
export const realWaterInfo = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/st/rsvrr/getRealVal/" + stcd)
}
export const realWaterInfoEight = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/st/rsvrr/getT8Val/" + stcd)
}
export const realWaterInfoYesterDay = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/st/rsvrr/getYesterdayT8Val/" + stcd)
}
//获取今日面雨量
export const getTodayAreaVal = () => {
    return axios.post(window.cfg['ctx'] + "/st/pptnr/getTodayAreaVal")
}
//获取昨日面雨量
export const getYesterdayAreaVal = () => {
    return axios.post(window.cfg['ctx'] + "/st/pptnr/getYesterdayAreaVal")
}

//防洪指标
export const getrsvrfcch = () => {
    return axios.get(window.cfg['ctx'] + "/st/RsvrR/getrsvrfcch")
}

//未来降雨
export const futureRainfall = () => {
    return axios.get(window.cfg['ctx'] + "/st/pptnr/futureRainfall")
}

//来水
export const futureInq = () => {
    return axios.get(window.cfg['ctx'] + "/st/pptnr/futureInq")
}

//调度和水位
export const futureOtq = () => {
    return axios.get(window.cfg['ctx'] + "/st/pptnr/futureOtq")
}

//获取水位过程线
export const realWaterLine = (stcd, params) => {
    return axios.post(window.cfg['ctx'] + "/st/RsvrR/realbystcd/" + stcd, qs.stringify(params))
}

//防洪水位库容指标
export const realWaterVol = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/st/rsvrfcchb/getWBystcd/" + stcd)
}
export const realWaterVols = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/st/RsvrR/realfcch/" + stcd)
}

//获取降雨量
export const getDayPP = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/pptnr/getValList", qs.stringify(params))
}

//预报方案
export const forecastInqPL = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/st/pptnr/forecastInqPL/" + stcd)
}

//调度方案
export const forecastOtqPL = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/st/pptnr/forecastOtqPL/" + stcd)
}

//下游影响数据
export const undexrDsins = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/wrp/rsr/dsins/" + stcd)
    // return axios.get("http://10.7.224.168:8099/rsvrApi/wrp/rsr/dsins/" + stcd)
}
//下游影响gis数据接口
export const undexrGis = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/wrp/rsr/dsinkml/" + stcd)
}

//三个责任人
export const threePerson = (stcd, params) => {
    return axios.post(window.cfg['ctx'] + "/pub/duty/userlist/" + stcd, qs.stringify(params))
}


/**     渗流安全    */


//获取多个测点过程线
export const getPointValList = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/getPointValList", params)

}

//获取全部测点
export const getAllTree = () => {
    return axios.get(window.cfg['ctx'] + "/pub/montp/allTree")
}

//测点监测值
export const getPointVal = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/point/pointValByStat", qs.stringify(params))
    // return axios.post(window.cfg['ctx'] + "/pub/point/getWaterReport", qs.stringify(params))
}
//测点监测值
export const getwrRep = (params) => {
    // return axios.post(window.cfg['ctx'] + "/pub/point/pointValByStat", qs.stringify(params))
    return axios.post(window.cfg['ctx'] + "/pub/point/getWaterReport", qs.stringify(params))
}
//获取水位数据
export const getDayRz = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/RsvrR/getDayRz", qs.stringify(params))
}

//获取气温数据
export const getDayTm = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/RsvrR/getDayTm", qs.stringify(params))
}

//相关性计算
export const mathSingle = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/math/single", params)
}

//获取特征值
export const getChaval = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/dfr/srhrds/chaval", params)
}
//新的获取特征值
export const getNewChaval = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/point/pointCharByStat", qs.stringify(params))
}


//根据stcd获取降雨量
export const getPPByStcd = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/pptnr/getValList", { params: params })
}

export const getInfoByStcd = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/rsvrr/getValList", qs.stringify(params))
}

//获取雨量站，河道站，水库站等
export const getStbprpb = (sttp) => {
    return axios.get(window.cfg['ctx'] + "/st/stbprpb/" + sttp)
}

//获取河道水情
export const getRiverInfo = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/riverr/r", qs.stringify(params))
}

//河道站获取水位流量过程线
export const getWaterLine = (params) => {
    return axios.get(window.cfg['ctx'] + "/st/river/getpointval", { params: params })
}


//水雨情测站基本信息
export const getPointBaseIfo = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/st/bprp/info/" + stcd)
}

//新的获取雨量站，河道站，水库站测点接口   ( pp雨量 rr水库 zq河道  all 全部 )
export const getNewStbprpb = (sttp) => {
    return axios.get(window.cfg['ctx'] + "/map/stpoint/" + sttp)
}

export const getDsmEnv = () => {
    return axios.get(window.cfg['ctx'] + "/map/dsm/env")
}

//新的降雨量的接口
export const getNewRainNum = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/pptnr/getValList", qs.stringify(params))
}

//水库基本信息
export const getRsrBsin = (rscd) => {
    return axios.get(window.cfg['ctx'] + "/wrp/rsr/bsin/" + rscd)
    // return axios.get("http://10.7.224.168:8099/rsvrApi/wrp/rsr/bsin/" + rscd)
}
//水文基本特征
export const getRsrHych = (rscd) => {
    return axios.get(window.cfg['ctx'] + "/wrp/rsr/hych/" + rscd)
    // return axios.get("http://10.7.224.168:8099/rsvrApi/wrp/rsr/hych/" + rscd)
}
//建设过程数据
export const getRsrCnpr = (rscd) => {
    return axios.get(window.cfg['ctx'] + "/wrp/rsr/cnpr/" + rscd)
    // return axios.get("http://10.7.224.168:8099/rsvrApi/wrp/rsr/cnpr/" + rscd)
}
//建设基本情况
export const getRsrCnbsin = (rscd) => {
    return axios.get(window.cfg['ctx'] + "/wrp/rsr/cnbsin/" + rscd)
    // return axios.get("http://10.7.224.168:8099/rsvrApi/wrp/rsr/cnbsin/" + rscd)
}

//水位流量关系曲线
export const getRiverZqrl = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/st/zqrlb/line/" + stcd)
}

//水位计算流量
export const getZtoQ = (stcd, z) => {
    return axios.get(window.cfg['ctx'] + "/st/zqrlb/ztoq/" + stcd + '/' + z)
}

//流量计算水位
export const getQtoZ = (stcd, q) => {
    return axios.get(window.cfg['ctx'] + "/st/zqrlb/qtoz/" + stcd + '/' + q)
}

//水位库容曲线
export const getRiverZvarlb = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/st/zvarlb/zwline/" + stcd)
}

//水位面积曲线
export const getRiverZvarla = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/st/zvarlb/zaline/" + stcd)
}

//水位计算库容
export const getZtoV = (stcd, z) => {
    return axios.get(window.cfg['ctx'] + "/st/zvarlb/ztow/" + stcd + '/' + z)
}

//库容计算水位
export const getVtoZ = (stcd, w) => {
    return axios.get(window.cfg['ctx'] + "/st/zvarlb/wtoz/" + stcd + '/' + w)
}

//水位计算面积
export const getZtoA = (stcd, z) => {
    return axios.get(window.cfg['ctx'] + "/st/zvarlb/ztoa/" + stcd + '/' + z)
}

//面积计算水位
export const getAtoZ = (stcd, a) => {
    return axios.get(window.cfg['ctx'] + "/st/zvarlb/atoz/" + stcd + '/' + a)
}


//获取水位 流量等     rsvr 对应 rz  blrz  inq  otq
export const getValListRr = (params) => {
    return axios.get(window.cfg['ctx'] + "/st/rsvrr/getValList", { params: params })
}

//获取 q  z
export const getValListRiver = (params) => {
    return axios.get(window.cfg['ctx'] + "/st/riverr/getValList", { params: params })
}

//获取报警阈值
export const getPointWarnInfo = (ptid) => {
    return axios.get(window.cfg['ctx'] + "/pub/warn/limit/getList?ptid=" + ptid)
}

//获取河道水位
export const getHdWaterLine = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/st/riverr/getRealVal/" + stcd)
}
//获取河道水位流量信息
export const getHdWaterQ = (stcd) => {
    return axios.get(window.cfg['ctx'] + "/st/rvfcchb/getfcchBystcd/" + stcd)
}
//根据ptid获取图片
export const getPointPic = (ptid) => {
    return axios.get(window.cfg['ctx'] + "/pub/point/pointImage/" + ptid)
}
//获取测点列表
export const getPointListData = ({ ptcnId, keyword, ptid }) => {
    if (ptcnId) {
        return axios.post(window.cfg['ctx'] + "/pub/point/pointClassification", { "ptcnId": ptcnId })
    } else if (keyword) {
        return axios.post(window.cfg['ctx'] + "/pub/point/pointClassification", { keyword })
    } else if (ptid) {
        return axios.post(window.cfg['ctx'] + "/pub/point/pointClassification", { ptid })
    } else {
        return axios.post(window.cfg['ctx'] + "/pub/point/pointClassification", {})
    }
}

//获取测点分类树形列表
export const getPointListClassTree = () => {
    return axios.post(window.cfg['ctx'] + "/pub/point/pointTree", {})
}

// 获取监测项目类型下拉列表
export const getSttpType = () => {
    return axios.post(window.cfg['ctx'] + "/pub/point/sttpType", {})
}

// 获取监测部位下拉列表
export const getPointPlace = () => {
    return axios.post(window.cfg['ctx'] + "/pub/point/pointPlace", {})
}

// 获取监测内容下拉列表
export const getContentList = () => {
    return axios.post(window.cfg['ctx'] + "/pub/point/contentList", {})
}

// 所有安全监测测点信息
export const getAllPointInfo = () => {
    return axios.post(window.cfg['ctx'] + "/pub/point/allPointInfo", {})
}
// 获取安全监测测点过程线
export const getDsmValLine = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/timeAndVal/valLine", params)
    // return axios.post("http://10.7.224.168:8099/rsvrApi/dsm/timeAndVal/valLine", params)
}

// 工情信息弹窗-获取方案列表
export const getDsmPgmeList = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/pgmeList", params)
}

// 工情信息弹窗-方案列表排序
export const updatePgme = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/updatePgme", params)
}
// 工情信息弹窗-保存方案
export const savePgme = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/savePgme", params)
}
// 工情信息弹窗-删除方案
export const deletePgme = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/deletePgme", params)
}
//获取观测点列表
export const getPointLine = (params) => {
    return axios.post(window.cfg['ctx'] + "/map/point/line/select", params)
}

// 新增观测点-提交
export const pointLineCreate = (params) => {
    return axios.post(window.cfg['ctx'] + "/map/point/line/create", params)
}
// 删除观测点
export const pointLineDelete = (params) => {
    return axios.delete(window.cfg['ctx'] + "/map/point/line/delete/line/or/point", params)
}

// 安全监测-添加CAD图纸测点
export const addCadPoint = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/point/addCadPoint", params)
}
// 安全监测-获取CAD图上的测点信息
export const getCadPoint = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/point/getCadPoint", params)
    // return axios.post("http://10.6.179.83:8099/rsvrApi/pub/point/getCadPoint", params)
}
// 安全监测-获取CAD图纸
export const getCad = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/point/getCad", params)
}

// 水雨情-测值查询表格
export const getSYQData = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/val/time/list", params)
}

// 水雨情-测值查询的值
export const getSYQValue = () => {
    return axios.get(window.cfg['ctx'] + "/st/val/time/msg")
}

// 水雨情-测值查询表格的最值
export const getSYQTable = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/val/time/list/extreme", params)
}

// 水雨情-测值查询降雨量柱状图
export const getRainfall = (ptid, params) => {
    return axios.post(window.cfg['ctx'] + "/st/val/time/get/" + ptid, params)
}

// 水雨情-测值查询面雨量组合柱状图
export const getArealRainfall = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/val/time/get/mssk12DrpInfo", params)
}

// 水雨情-测值查询面雨量组合柱状图(地方具体值)
export const getArealRainfallDetail = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/val/time/get/mssk12Detail", params)
}

// 水雨情-测值查询测站状态
export const getStationStatus = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/getStPointState", params)
}

// 水雨情-数据报表-逐日降雨年报表
export const getRainfallReport = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/val/time/list/drp", params)
}

// 水雨情-数据报表-逐日坝上水位年报表
export const getWaterLevelReport = (year, params) => {
    return axios.post(window.cfg['ctx'] + "/st/val/time/list/rz/" + year, params)
}

// 水雨情-数据报表-逐日坝下水位年报表
export const getUnderWaterLevelReport = (year, params) => {
    return axios.post(window.cfg['ctx'] + "/st/val/time/list/blrz/" + year, params)
    // return axios.post("http://10.6.179.37:8099/rsvrApi/st/val/time/list/blrz/" + year, params)
}

// 基础信息-组织机构-部门管理
export const getDepartment = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/department/getDepartmentTree", params)
}

// 基础信息-组织机构-部门人员
export const getDepartmentStaff = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/department/getDepartmentWorker", params)
}

// 基础信息-组织机构-部门管理-新增部门
export const newDepartment = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/department/addDepartment", params)
}

// 基础信息-组织机构-部门管理-删除部门
export const deleteDepartment = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/department/deleteDepartment", params)
}

// 基础信息-组织机构-部门人员管理-获取所有员工
export const getAllDepartmentStaff = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/department/getAllWorker", params)
}

// 基础信息-组织机构-部门人员管理-新增员工
export const newStaff = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/department/addWorker", params)
}

// 基础信息-组织机构-部门人员管理-编辑员工
export const editStaff = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/department/updateWorker", params)
}

// 基础信息-组织机构-部门人员管理-删除员工
export const deleteStaff = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/department/deleteWorker", params)
}

// 巡视检查-巡检报告查询
export const getPatrolReport = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsmPtrMp/get/record/" + params)
    // return axios.post("http://220.180.11.124:8081/rsvrApi/dsmPtrMp/get/record/" + params)
}

// 巡视检查-巡检报告列表
export const getPatrolReportList = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsmPtrMp/list/record", params)
    // return axios.post("http://220.180.11.124:8081/rsvrApi/dsmPtrMp/list/record", params)
}

// 巡视检查-巡检报告
export const getReport = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsmPtrMp/list/mp/0", params)
}

// 系统管理-登录设置-新建
export const createAPPUser = (params) => {
    return axios.post(window.cfg['ctx'] + "/web/login/create/user", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/web/login/create/user", params)
}

// 系统管理-登录设置-删除
export const deleteAPPUser = (params) => {
    return axios.post(window.cfg['ctx'] + "/web/login/delete/user/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/web/login/delete/user/" + params)
}

// 系统管理-登录设置-编辑
export const editAPPUser = (params) => {
    return axios.post(window.cfg['ctx'] + "/web/login/modify/user", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/web/login/modify/user", params)
}

// 系统管理-登录设置-列表
export const getAPPUserList = (params) => {
    return axios.post(window.cfg['ctx'] + "/web/login/list/user", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/web/login/list/user", params)
}

// 安全监测-巡视检查-巡检人
export const getInspectionPersonnel = (params) => {
    return axios.post(window.cfg['ctx'] + "/web/login/list/user", params)
}

// 安全监测-巡视检查-库水位
export const getWaterLevel = (params) => {
    return axios.post(window.cfg['ctx'] + "/st/val/time/get/rz", params)
}

// 安全监测-巡视检查-检查部位
export const getCheckPoint = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsmPtrMp/list/mp/0", params)
}

// 安全监测-巡视检查-上传图片
export const uploadImage = (params, config) => {
    return axios.post(window.cfg['ctx'] + "/dsmPtrMp/upload/img", params, config)
}

// 安全监测-巡视检查-保存巡检
export const saveInspection = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsmPtrMp/add/record", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/dsmPtrMp/add/record", params)
}

// 安全监测-巡视检查-巡检列表
export const inspectionList = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsmPtrMp/list/record", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/dsmPtrMp/list/record", params)
}

// 安全监测-巡视检查-删除巡检记录
export const inspectionDelete = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsmPtrMp/delete/record/" + params)
}

// 安全监测-巡视检查-巡检详情
export const inspectionDetail = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsmPtrMp/get/record/" + params)
}

// 安全监测-图形报表-相关分析-查询
export const getAnalyse = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsmAnalyse/correlation", params)
    // return axios.post("http://10.6.179.37:8099/rsvrApi/dsmAnalyse/correlation", params)
}
// 安全监测-图形报表-相关分析-筛选
export const getAnalyseSelece = () => {
    return axios.get(window.cfg['ctx'] + "/dsmAnalyse/getValFieldTree")
    // return axios.get("http://10.6.179.37:8099/rsvrApi/dsmAnalyse/getValFieldTree")
}

// 安全监测-图形报表-报表
export const getStatement = (params) => {
    return axios.get(window.cfg['ctx'] + "/pub/monitorType/tree", params)
    // return axios.get("http://10.6.179.11:8099/rsvrApi/pub/monitorType/tree", params)
}

// 安全监测-图形报表-报表-测点
export const getMeasurePoint = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/timeAndVal/monitorTypePoint", params)
    // return axios.post("http://10.6.179.11:8099/rsvrApi/dsm/timeAndVal/monitorTypePoint", params)
}

// 安全监测-图形报表-报表-查询
export const getMeasurePointReport = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/timeAndVal/statement", params)
    // return axios.post("http://10.6.179.11:8099/rsvrApi/dsm/timeAndVal/statement", params)
}

// 安全监测-图形报表-报表-编辑
export const editMeasurePointReport = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/timeAndVal/saveData", params)
    // return axios.post("http://10.6.179.11:8099/rsvrApi/dsm/timeAndVal/saveData", params)
}

// 安全监测-数据入库-文件导入-获取监测类型
export const getManualEntryType = () => {
    return axios.get(window.cfg['ctx'] + "/dsm/timeAndVal/getManualMType")
    // return axios.get("http://10.7.224.168:8099/rsvrApi/dsm/timeAndVal/getManualMType")
    // return axios.get("http://220.180.11.124:8099/rsvrApi/dsm/timeAndVal/getManualMType")
}

// 安全监测-数据入库-文件导入-上传文件
export const uploadFile = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/timeAndVal/uploadManData", params)
    // return axios.post("http://10.6.179.37:8099/rsvrApi/dsm/timeAndVal/uploadManData", params)
}

// // 安全监测-数据入库-文件导入-获取模板
// export const getTemplate = (params) => {
//     return axios.get(window.cfg['ctx'] + "/dsm/timeAndVal/exportExcel?mtype=" + params)
//     // return axios.get("http://10.6.179.37:8099/rsvrApi/dsm/timeAndVal/exportExcel?mtype=" + params)
// }

// 安全监测-数据入库-人工录入-新增
export const addManualEntry = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/timeAndVal/addManVal", params)
    // return axios.post("http://10.6.179.37:8099/rsvrApi/dsm/timeAndVal/addManVal", params)
}

// 安全监测-数据入库-人工录入-历史
export const getManualEntry = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/timeAndVal/getImportRecord", params)
    // return axios.post("http://10.6.179.37:8099/rsvrApi/dsm/timeAndVal/getImportRecord", params)
    // return axios.post("http://220.180.11.124:8099/rsvrApi/dsm/timeAndVal/getImportRecord", params)
}

// 安全监测-数据入库-文件导入-echarts
export const getEchartsData = (params) => {
    return axios.post(window.cfg['ctx'] + "/dsm/timeAndVal/manualValLine", params)
    // return axios.post("http://10.6.179.37:8099/rsvrApi/dsm/timeAndVal/manualValLine", params)
}

// 系统管理-基础数据维护-仪器厂商-新增
export const addManufacturer = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysManufacturer/add", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysManufacturer/add", params)
}
// 系统管理-基础数据维护-仪器厂商-查询
export const getManufacturer = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysManufacturer/list", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysManufacturer/list", params)
}
// 系统管理-基础数据维护-仪器厂商-删除
export const deleteManufacturer = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysManufacturer/delete/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysManufacturer/delete/" + params)
}
// 系统管理-基础数据维护-仪器厂商-修改
export const changeManufacturer = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysManufacturer/update", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysManufacturer/update", params)
}
// 系统管理-基础数据维护-仪器厂商-查询厂商具体信息
export const getManufacturerDetail = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysManufacturer/get/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysManufacturer/get/" + params)
}

// 系统管理-基础数据维护-监测类别-新增
export const addCategory = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmType/add", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmType/add", params)
}
// 系统管理-基础数据维护-监测类别-查询
export const getCategory = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmType/list", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmType/list", params)
}
// 系统管理-基础数据维护-监测类别-查询监测类别具体信息
export const getCategoryDetail = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmType/get/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmType/get/" + params)
}
// 系统管理-基础数据维护-监测类别-修改
export const changeCategory = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmType/update", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmType/update", params)
}
// 系统管理-基础数据维护-监测类别-删除
export const deleteCategory = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmType/delete/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmType/delete/" + params)
}

// 系统管理-基础数据维护-监测项目-新增
export const addProgram = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmItem/add", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmItem/add", params)
}
// 系统管理-基础数据维护-监测项目-查询
export const getProgram = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmItem/list", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmItem/list", params)
}
// 系统管理-基础数据维护-监测项目-查询监测项目具体信息
export const getProgramDetail = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmItem/get/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmItem/get/" + params)
}
// 系统管理-基础数据维护-监测项目-修改
export const changeProgram = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmItem/update", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmItem/update", params)
}
// 系统管理-基础数据维护-监测项目-删除
export const deleteProgram = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmItem/delete/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmItem/delete/" + params)
}

// 系统管理-基础数据维护-建筑物-新增
export const addConstruction = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysBuildings/add", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysBuildings/add", params)
}
// 系统管理-基础数据维护-建筑物-查询
export const getConstruction = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysBuildings/list", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysBuildings/list", params)
}
// 系统管理-基础数据维护-建筑物-查询建筑物具体信息
export const getConstructionDetail = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysBuildings/get/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysBuildings/get/" + params)
}
// 系统管理-基础数据维护-建筑物-修改
export const changeConstruction = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysBuildings/update", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysBuildings/update", params)
}
// 系统管理-基础数据维护-建筑物-删除
export const deleteConstruction = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysBuildings/delete/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysBuildings/delete/" + params)
}

// 系统管理-基础数据维护-仪器名称-新增
export const addInstrumentName = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysInstrument/add", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysInstrument/add", params)
}
// 系统管理-基础数据维护-仪器名称-查询
export const getInstrumentName = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysInstrument/list", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysInstrument/list", params)
}
// 系统管理-基础数据维护-仪器名称-查询仪器名称具体信息
export const getInstrumentNameDetail = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysInstrument/get/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysInstrument/get/" + params)
}
// 系统管理-基础数据维护-仪器名称-修改
export const changeInstrumentName = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysInstrument/update", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysInstrument/update", params)
}
// 系统管理-基础数据维护-仪器名称-删除
export const deleteInstrumentName = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysInstrument/delete/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysInstrument/delete/" + params)
}

// 系统管理-基础数据维护-仪器性能-新增
export const addPerformance = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPoint/add", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPoint/add", params)
}
// 系统管理-基础数据维护-仪器性能-查询
export const getPerformance = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPoint/list", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPoint/list", params)
}
// 系统管理-基础数据维护-仪器性能-查询仪器性能具体信息
export const getPerformanceDetail = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPoint/get/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPoint/get/" + params)
}
// 系统管理-基础数据维护-仪器性能-修改
export const changePerformance = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPoint/update", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPoint/update", params)
}
// 系统管理-基础数据维护-仪器性能-删除
export const deletePerformance = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPoint/delete/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPoint/delete/" + params)
}

// 系统管理-基础数据维护-测点参数-新增
export const addParameters = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPointParameters/add", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPointParameters/add", params)
}
// 系统管理-基础数据维护-测点参数-查询
export const getParameters = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPointParameters/list", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPointParameters/list", params)
}
// 系统管理-基础数据维护-测点参数-查询测点参数具体信息
export const getParametersDetail = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPointParameters/get/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPointParameters/get/" + params)
}
// 系统管理-基础数据维护-测点参数-修改
export const changeParameters = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPointParameters/update", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPointParameters/update", params)
}
// 系统管理-基础数据维护-测点参数-删除
export const deleteParameters = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPointParameters/delete/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPointParameters/delete/" + params)
}

// 系统管理-基础数据维护-测点汇总-新增
export const addSummary = (params) => {
    return axios.post(window.cfg['ctx'] + "/pubPointAll/add", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/pubPointAll/add", params)
}
// 系统管理-基础数据维护-测点汇总-查询
export const getSummary = (params) => {
    return axios.post(window.cfg['ctx'] + "/pubPointAll/list", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/pubPointAll/list", params)
}
// 系统管理-基础数据维护-测点汇总-查询测点汇总具体信息
export const getSummaryDetail = (params) => {
    return axios.post(window.cfg['ctx'] + "/pubPointAll/get/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/pubPointAll/get/" + params)
}
// 系统管理-基础数据维护-测点汇总-修改
export const changeSummary = (params) => {
    return axios.post(window.cfg['ctx'] + "/pubPointAll/update", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/pubPointAll/update", params)
}
// 系统管理-基础数据维护-测点汇总-删除
export const deleteSummary = (params) => {
    return axios.post(window.cfg['ctx'] + "/pubPointAll/delete/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/pubPointAll/delete/" + params)
}

// 系统管理-基础数据维护-测点部位-新增
export const addPart = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmPointPart/add", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmPointPart/add", params)
}
// 系统管理-基础数据维护-测点部位-查询
export const getPart = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmPointPart/list", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmPointPart/list", params)
}
// 系统管理-基础数据维护-测点部位-查询测点部位具体信息
export const getPartDetail = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmPointPart/get/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmPointPart/get/" + params)
}
// 系统管理-基础数据维护-测点部位-修改
export const changePart = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmPointPart/update", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmPointPart/update", params)
}
// 系统管理-基础数据维护-测点部位-删除
export const deletePart = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysDsmPointPart/delete/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysDsmPointPart/delete/" + params)
}

// 系统管理-基础数据维护-测点关系-新增
export const addRelation = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPointRelation/add", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPointRelation/add", params)
}
// 系统管理-基础数据维护-测点关系-查询
export const getRelation = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPointRelation/list", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPointRelation/list", params)
}
// 系统管理-基础数据维护-测点关系-查询测点关系具体信息
export const getRelationDetail = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPointRelation/get/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPointRelation/get/" + params)
}
// 系统管理-基础数据维护-测点关系-修改
export const changeRelation = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPointRelation/update", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPointRelation/update", params)
}
// 系统管理-基础数据维护-测点关系-删除
export const deleteRelation = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysPointRelation/delete/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysPointRelation/delete/" + params)
}
// 系统管理-基础数据维护-测点关系-新增
export const getRelationPoint = (params) => {
    return axios.post(window.cfg['ctx'] + "/pub/point/all", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/pub/point/all", params)
}

// 系统管理-信息查询维护-水库管理-新增
export const addReservoirInfo = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysRsr/add", params)
    // return axios.post("http://10.7.224.168:8099/rsvrApi/sysRsr/add", params)
}
// 系统管理-信息查询维护-水库管理-查询
export const getReservoirInfo = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysRsr/list", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysRsr/list", params)
}
// 系统管理-信息查询维护-水库管理-查询测点关系具体信息
export const getReservoirInfoDetail = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysRsr/get/" + params)
    // return axios.post("http://10.7.224.168:8099/rsvrApi/sysRsr/get/" + params)
}
// 系统管理-信息查询维护-水库管理-修改
export const changeReservoirInfo = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysRsr/update", params)
    // return axios.post("http://10.7.224.168:8099/rsvrApi/sysRsr/update", params)
}
// 系统管理-信息查询维护-水库管理-删除
export const deleteReservoirInfo = (params) => {
    return axios.post(window.cfg['ctx'] + "/sysRsr/delete/" + params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysRsr/delete/" + params)
}

// 视频监控-摄像头-修改位置
export const uploadCamera = (params) => {
    return axios.post(window.cfg['ctx'] + "/pubVideo/update", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysRsr/delete/" + params)
}

// 视频监控-摄像头-获取点数据
export const getCameraData = (params) => {
    return axios.post(window.cfg['ctx'] + "/pubVideo/list", params)
    // return axios.post("http://10.6.179.71:8099/rsvrApi/sysRsr/delete/" + params)
}

// 预警websocket地址
export const getWarningInfo = (params) => {
    return axios.get(window.cfg['ctx'] + "/websocket/endPoint", params)
    // return axios.get("http://10.7.224.168:8099/rsvrApi/websocket/endPoint", params)
}
// 预警-获得总条数
export const getWarningCount = (params) => {
    return axios.get(window.cfg['ctx'] + "/map/point/warn/count", params)
    // return axios.get("http://10.7.224.168:8099/rsvrApi/map/point/warn/count", params)
}
// 预警-解除预警
export const affirmWarning = (params) => {
    return axios.post(window.cfg['ctx'] + "/map/point/updateWrst", params)
    // return axios.post("http://10.7.224.168:8099/rsvrApi/map/point/updateWrst", params)
}
// 预警-历史预警列表
export const getWarning = (params) => {
    return axios.get(window.cfg['ctx'] + "/map/point/warnList?" + params)
    // return axios.get("http://10.7.224.168:8099/rsvrApi/map/point/warnList?" + params)
}