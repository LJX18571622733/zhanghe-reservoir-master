export const modelName = {
    flood: { sttp: "99998", ptid: "0", ptcd: "防洪安全", ptnm: "0" },   //防洪安全
    // seepage: {sttp: "99997", ptid: "0", ptcd: "渗流安全",ptnm:"0"},  渗流安全
    // structural: {sttp: "99996", ptid: "0", ptcd: "结构安全",ptnm:"0"}, 结构安全
    forecast: { sttp: "99994", ptid: "0", ptcd: "防洪安全", ptnm: "0" },  //预报调度
    weather: { sttp: "99999", ptid: "0", ptcd: "天气预报", ptnm: "0" },  //天气预报
};

export const cameraRange = {
    "pp": { x: 112.073512, y: 31.0051779, z: 90000, rx: 180, ry: -90, rz: 0 },//水雨情-雨量站
    // "warning": { x: 115.68513777340506, y: 30.9951779, z: 90000, rx: 180, ry: -90, rz: 0 },
    "warning": { x: 112.063512, y: 30.9951779, z: 9000, rx: 0, ry: -90, rz: 0 },
    "flood": { x: 112.073512, y: 31.0051779, z: 90000, rx: 180, ry: -90, rz: 0 },//防洪安全
    "waterRain": { x: 112.073512, y: 31.0051779, z: 90000, rx: 180, ry: -90, rz: 0 },
    "forecast": { x: 112.073512, y: 31.0051779, z: 90000, rx: 180, ry: -90, rz: 0 },
    "zz": { x: 115.62124916649645, y: 31.600240102978937, z: 60000, rx: 180, ry: -90, rz: 0 },//水雨情-河道站
    "rr": { x: 115.87892916435878, y: 31.668845074957762, z: 1100, rx: 180, ry: -90, rz: 0 },//水雨情-水库站
    "gate": { x: 115.87956587288977, y: 31.779231074388684, z: 507, rx: 360, ry: -82, rz: 0 },
    "dd": { x: 115.87956587288977, y: 31.779231074388684, z: 507, rx: 360, ry: -82, rz: 0 },
    "spg": { x: 112.062575, y: 30.9851779, z: 8000, rx: 0, ry: -85, rz: 0 },//安全监测-渗流渗压
    "seepage": { x: 112.062575, y: 30.9851779, z: 8000, rx: 0, ry: -85, rz: 0 },//渗流安全
    "dfr": { x: 112.063512, y: 31.0051779, z: 8000, rx: 180, ry: -70, rz: 0 },//安全监测-变形监测
    "structural": { x: 112.063512, y: 31.0051779, z: 8000, rx: 180, ry: -70, rz: 0 },//结构安全
    "sst": { x: 112.073512, y: 30.9851779, z: 144.73352255903566, rx: 200, ry: -12, rz: 0 },//安全监测-应力应变与温度
    "env": { x: 112.053512, y: 30.9851779, z: 307.12709004974636, rx: 0, ry: 0, rz: 0 },//安全监测-环境量监测
    "ptr": { x: 112.073512, y: 30.9851779, z: 668, rx: 180, ry: -30, rz: 0 },
    "monitor": { x: 112.073512, y: 30.9851779, z: 668, rx: 180, ry: -30, rz: 0 },//安全监测
    "eqk": { x: 112.073512, y: 30.9851779, z: 287, rx: 180, ry: -30, rz: 0 },//安全监测-地震反应
    "vodie": { x: 115.87724145108372, y: 31.684957675632518, z: 924.0076956264826, rx: 180, ry: -30, rz: 0 },
    "video": { x: 115.88149461571648, y: 31.661818489836815, z: 1318, rx: 350.87, ry: -52.87, rz: 359.95 },//视频监控
    "上游": { x: 115.87978228049838, y: 31.66544450134865, z: 228, rx: 353.16, ry: -8.88, rz: 359.98 },//上游
    "下游": { x: 115.87820104032056, y: 31.679306043232458, z: 240, rx: 175.65, ry: -14.31, rz: 0.01 },//下游
    "溢洪道": { x: 115.88158877873452, y: 31.671546928259396, z: 193, rx: 166.68, ry: -12.66, rz: 0 },//溢洪道
    "坝顶": { x: 115.87914479500745, y: 31.670630629170585, z: 430, rx: 177.23, ry: -64.5, rz: 0 },//坝顶
}

export const cameraRange2d = {
    "pp": { x: 115.76574856511911, y: 31.5392268011139, z: 90000, rx: 180, ry: -90, rz: 0 },//水雨情-雨量站
    "warning": { x: 115.88091162154849, y: 31.669059346092446, z: 5000, rx: 166.68, ry: -12.66, rz: 0 },//预警预报
    "flood": { x: 115.68513777340506, y: 31.541611069562364, z: 130000, rx: 180, ry: -90, rz: 0 },//防洪安全
    "waterRain": { x: 115.68513777340506, y: 31.541611069562364, z: 90000, rx: 180, ry: -90, rz: 0 },
    "forecast": { x: 115.68513777340506, y: 31.541611069562364, z: 90000, rx: 180, ry: -90, rz: 0 },
    "zz": { x: 115.80022401666763, y: 31.56729390968013, z: 90000, rx: 180, ry: -90, rz: 0 },//水雨情-河道站
    "rr": { x: 115.88030764916725, y: 31.66886920820991, z: 4000, rx: 180, ry: -90, rz: 0 },//水雨情-水库站
    "gate": { x: 115.87956587288977, y: 31.669231074388684, z: 507, rx: 360, ry: -82, rz: 0 },
    "dd": { x: 115.87956587288977, y: 31.669231074388684, z: 507, rx: 360, ry: -82, rz: 0 },
    "spg": { x: 115.87950364432628, y: 31.66947334181641, z: 1000, rx: 180, ry: -25, rz: 0 },//安全监测-渗流渗压
    "seepage": { x: 115.88056942381584, y: 31.66941649315457, z: 1500, rx: 180, ry: -25, rz: 0 },//渗流安全
    "dfr": { x: 115.87972602535975, y: 31.66964726434741, z: 800, rx: 180, ry: -70, rz: 0 },//安全监测-变形监测
    "structural": { x: 115.87953130648712, y: 31.6694982940013, z: 600, rx: 180, ry: -70, rz: 0 },//结构安全
    "sst": { x: 115.8802791995983, y: 31.669338661159408, z: 800, rx: 200, ry: -12, rz: 0 },//安全监测-应力应变与温度
    "env": { x: 115.88052136870417, y: 31.66889108609584, z: 2000, rx: 180, ry: 0, rz: 0 },//安全监测-环境量监测
    "ptr": { x: 115.878403715078, y: 31.681100260102937, z: 668, rx: 180, ry: -30, rz: 0 },
    "monitor": { x: 115.88006170793385, y: 31.668847235258465, z: 3500, rx: 180, ry: -30, rz: 0 },//安全监测
    "eqk": { x: 115.88146069796221, y: 31.669599836904844, z: 1287, rx: 180, ry: -30, rz: 0 },//安全监测-地震反应
    "vodie": { x: 115.87724145108372, y: 31.684957675632518, z: 924.0076956264826, rx: 180, ry: -30, rz: 0 },
    "video": { x:  115.87950364432628, y: 31.66947334181641, z: 2000, rx: 180, ry: -25, rz: 0 },//视频监控
    "上游": { x: 115.87978228049838, y: 31.66544450134865, z: 228, rx: 353.16, ry: -8.88, rz: 359.98 },//上游
    "下游": { x: 115.87820104032056, y: 31.679306043232458, z: 240, rx: 175.65, ry: -14.31, rz: 0.01 },//下游
    "溢洪道": { x: 115.88158877873452, y: 31.671546928259396, z: 193, rx: 166.68, ry: -12.66, rz: 0 },//溢洪道
    "坝顶": { x: 115.87914479500745, y: 31.670630629170585, z: 430, rx: 177.23, ry: -64.5, rz: 0 },//坝顶
}

export const montp = {
    '渗流': [20, 21, 22, 23, 24, 25],
    '变形': [14, 15, 16, 17, 18, 19],
    '巡视检查': [8, 9, 10, 11, 12, 13],
    '钢筋应力计': [41],
    '坝体温度计': [42],
    '渗流量': [20],
    '绕坝渗流': [23],
    '渗流压力': [21, 22],
    "界面及接（裂）缝变形17": [17],
    "坝体表面变形": [14],
}
