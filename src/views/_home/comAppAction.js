/**     * 预警预报
const pointxyz = {
    "pp": { x: 115.68513777340506, y: 31.541611069562364, z: 90000, rx: 180, ry: -90, rz: 0 },
    "zq": { x: 115.62124916649645, y: 31.600240102978937, z: 60000, rx: 180, ry: -90, rz: 0 },
    "rr": { x: 115.87892916435878, y: 31.668845074957762, z: 1100, rx: 180, ry: -90, rz: 0 },
    "gate": { x: 115.87956587288977, y: 31.669231074388684, z: 507.0464984804921, rx: 360, ry: -82, rz: 0 },
    "spg": { x: 115.87782172031879, y: 31.669606199521727, z: 157.80511395070656, rx: 180, ry: -25, rz: 0 },
    "dfr": { x: 115.87940797024346, y: 31.669796194589157, z: 309.10505477397794, rx: 180, ry: -70, rz: 0 },
    "sst": { x: 115.87841921900788, y: 31.66963847108442, z: 144.73352255903566, rx: 200, ry: -12, rz: 0 },
    "env": { x: 115.87733148823608, y: 31.683336040681038, z: 307.12709004974636, rx: 180, ry: 0, rz: 0 },
    "ptr": { x: 115.878403715078, y: 31.681100260102937, z: 668, rx: 180, ry: -30, rz: 0 },
    "eqk": { x: 115.87986411870038, y: 31.672868390269123, z: 287, rx: 180, ry: -30, rz: 0 },
    "vodie": { x: 115.87724145108372, y: 31.684957675632518, z: 924.0076956264826, rx: 180, ry: -30, rz: 0 }
}
  * **/
const pointxyz = {
    "pp": { x: 115.68513777340506, y: 31.541611069562364, z: 90000, rx: 180, ry: -90, rz: 0 },
    "zq": { x: 115.62124916649645, y: 31.600240102978937, z: 60000, rx: 180, ry: -90, rz: 0 },
    "rr": { x: 115.87892916435878, y: 31.668845074957762, z: 1100, rx: 180, ry: -90, rz: 0 },
    "gate": { x: 115.87956587288977, y: 31.669231074388684, z: 507, rx: 360, ry: -82, rz: 0 },
    "spg": { x: 115.87902421426254, y: 31.67409874384847, z: 377, rx: 180, ry: -25, rz: 0 },
    "dfr": { x: 115.87910544601395, y: 31.6707657707687, z: 600, rx: 180, ry: -70, rz: 0 },
    "sst": { x: 115.87841921900788, y: 31.66963847108442, z: 144.73352255903566, rx: 200, ry: -12, rz: 0 },
    "env": { x: 115.87733148823608, y: 31.683336040681038, z: 307.12709004974636, rx: 180, ry: 0, rz: 0 },
    "ptr": { x: 115.878403715078, y: 31.681100260102937, z: 668, rx: 180, ry: -30, rz: 0 },
    "eqk": { x: 115.87986411870038, y: 31.672868390269123, z: 287, rx: 180, ry: -30, rz: 0 },
    "vodie": { x: 115.87724145108372, y: 31.684957675632518, z: 924.0076956264826, rx: 180, ry: -30, rz: 0 }
}
const warning = function (com) {
    if(!com){
        return false
    }
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/warn/pointlist").then(function (r) {
        com.pointList = r.data.data;
        // console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.pp);
    })
}
/**     * 防洪安全     * **/
const flood = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/33").then(function (r) {
        com.pointList = r.data.data;
        //   console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.pp);

    })
    var item = { sttp: "99998", ptid: "0", ptcd: "防洪安全" }
    com.popupClick(item);
}
/**     * 渗流安全     * **/
const seepage = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/3").then(function (r) {
        com.pointList = r.data.data;
        //     console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.spg);
    })
    var item = { sttp: "99997", ptid: "0", ptcd: "渗流安全" }
    com.popupClick(item);
}
/**     * 结构安全     * **/
const structural = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/14").then(function (r) {
        com.pointList = r.data.data;
        //  console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.dfr);
    })
    var item = { sttp: "99996", ptid: "0", ptcd: "结构安全" }
    com.popupClick(item);
}
/**     * 水雨情     * **/
const waterRain = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/33").then(function (r) {
        com.pointList = r.data.data;
        //  console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.pp);
    })
}
/**     * 安全监测     * **/
const monitor = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/0").then(function (r) {
        com.pointList = r.data.data;
        // console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.ptr);
    })
}
/**     * 预报调度     * **/
const forecast = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/33").then(function (r) {
        com.pointList = r.data.data;
        // console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        var item = { sttp: "99994", ptid: "0", ptcd: "防洪安全" }
        com.$refs.map.flytopoint(pointxyz.pp);
        // com.popupClick(item);




    })
}
/**     * 视频监控     * **/
const video = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/38").then(function (r) {
        com.pointList = r.data.data;
        //   console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.vodie);
    })
}
/**     * 天气预报     * **/
const weather = function (com) {
    var item = { sttp: "99999", ptid: "0", ptcd: "天气预报" }
    com.popupClick(item);
}
/**     * 降雨量     * **/
const pp = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/37").then(function (r) {
        com.pointList = r.data.data;
        //  console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.pp);
    })
}
/**     * 河道站     * **/
const zz = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/34").then(function (r) {
        com.pointList = r.data.data;
        //   console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.zq);
    })
}
/**     * 水库站     * **/
const rr = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/36").then(function (r) {
        com.pointList = r.data.data;
        //  console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.rr);
    })
}
/**     * 闸门     * **/
const dd = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/40").then(function (r) {
        com.pointList = r.data.data;
        //  console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.gate);
    })
}
/**     * 渗流渗压     * **/
const spg = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/3").then(function (r) {
        com.pointList = r.data.data;
        // console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.spg);
    })
}
/**     * 变形监测     * **/
const dfr = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/2").then(function (r) {
        com.pointList = r.data.data;
        // console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.dfr);
    })
}

/**     * 应力应变及温度     * **/
const sst = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/4").then(function (r) {
        com.pointList = r.data.data;
        // console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.sst);
    })
}
/**     * 环境量     * **/
const env = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/33").then(function (r) {
        com.pointList = r.data.data;
        // console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.env);
    })
}
/**     * 巡视检查     * **/
const ptr = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/1").then(function (r) {
        com.pointList = r.data.data;
        //  console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.ptr);
    })
}
/**     * 地震监测     * **/
const eqk = function (com) {
    com.$http.get(window.cfg['ctx'] + "/rsvrApi/pub/getPointListByType/6").then(function (r) {
        com.pointList = r.data.data;
        // console.log(com.pointList);
        com.$refs.map.addpoint(com.pointList);
        com.$refs.map.flytopoint(pointxyz.dz);
        com.$refs.map.flytopoint(pointxyz.eqk);
    })
}

export default function (name, com) {

    eval(name + '(com)');

}
