import {
    warning,
    getAllTree,
    getNewStbprpb,
    getPointListByType,
    getDsmEnv,
    realWaterInfo,
    getNewPointListByType,
    getAllPointInfo,
    getVideo
} from '@/http/api'

const river = {
    state: {
        pp: [], //雨量站
        zz: [], //河道站
        rr: [], //水库站
        dd: [], //闸门
        warning: [], //报警点
        flood: [], //防洪安全测点
        seepage: [], //渗流安全测点
        allList: [], //全部测点
        structural: [], //结构安全测点
        waterRain: [], //水雨情全部测点
        monitor: [], //安全监测测点
        forecast: [], //预报调度
        video: [], //视频监控
        spg: [], //渗流渗压
        dfr: [], //变形监测
        sst: [], //应力应变及温度
        env: [], //环境量
        ptr: [], //巡视检查
        eqk: [], //地震监测
        waterLine: 0, //实时水位线
        allPointInfo: [], //所有测点信息

    },
    getters: {
        allPointInfo: state => {
            return state.allPointInfo
        }
    },
    mutations: {
        SET_PP: (state, pp) => {
            state.pp = pp;
        },
        SET_ZZ: (state, zz) => {
            state.zz = zz;
        },
        SET_DD: (state, dd) => {
            state.dd = dd;
        },
        SET_RR: (state, rr) => {
            state.rr = rr;
        },
        SET_WARNING: (state, list) => {
            state.warning = list;
        },
        SET_FLOOD: (state, list) => {
            state.flood = list;
        },
        SET_SEEPAGE: (state, list) => {
            state.seepage = list;
        },
        SET_ALLLIST: (state, list) => {
            state.allList = list;
        },
        SET_STRUCTURAL: (state, list) => {
            state.structural = list;
        },
        SET_WATERRAIN: (state, list) => {
            state.waterRain = list;
        },
        SET_MONITOR: (state, list) => {
            state.monitor = list;
        },
        SET_FORECAST: (state, list) => {
            state.forecast = list;
        },
        SET_VIDEO: (state, list) => {
            state.video = list;
        },
        SET_SPG: (state, list) => {
            state.spg = list;
        },
        SET_DFR: (state, list) => {
            state.dfr = list;
        },
        SET_SST: (state, list) => {
            state.sst = list;
        },
        SET_ENV: (state, list) => {
            state.env = list;
        },
        SET_PTR: (state, list) => {
            state.ptr = list;
        },
        SET_EQK: (state, list) => {
            state.eqk = list;
        },
        SET_WATERLINE: (state, list) => {
            state.waterLine = list;
        },
        SET_ALLPOINTINFO: (state, list) => {
            state.allPointInfo = list
        },

    },

    actions: {
        // 获取信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getNewStbprpb('pp').then(res => {
                    if (res.data.code == '200') {
                        commit("SET_PP", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                getNewStbprpb('zq').then(res => {
                    if (res.data.code == '200') {
                        commit("SET_ZZ", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                /*getNewStbprpb('dd').then(res => {
                    if (res.data.code == '200') {
                        commit("SET_DD", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });*/

                getNewStbprpb('rr').then(res => {
                    if (res.data.code == '200') {
                        commit("SET_RR", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                getVideo({sttp: 38}).then(res => {
                    if (res.data.code == '200') {
                        commit("SET_VIDEO", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                warning().then(res => {
                    if (res.data.code == '200') {
                        commit("SET_WARNING", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                //flood getPointListByType(33)
                // getNewStbprpb('all').then(res => {
                //     if (res.data.code == '200') {
                //         commit("SET_FLOOD", res.data.data);
                //     }
                //     resolve(res)
                // }).catch(error => {
                //     console.log(error)
                // });

                //seepage
                getNewPointListByType(3).then(res => {
                    if (res.data.code == '200') {
                        commit("SET_SEEPAGE", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                //structural
                getNewPointListByType(14).then(res => {
                    if (res.data.code == '200') {
                        commit("SET_STRUCTURAL", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                getAllTree().then(res => {
                    if (res.data.code == '200') {
                        let dict = []
                        for (let key in res.data.data) {
                            let data = res.data.data[key].children
                            for (var i = 0, len = data.length; i < len; i++) {
                                if (data[i].children && data[i].children.length > 0) {
                                    for (let keys in data[i].children) {
                                        if (data[i].children[keys].children && data[i].children[keys].children instanceof Array && data[i].children[keys].children.length > 0) {
                                            for (let n in data[i].children[keys].children) {
                                                dict.push(data[i].children[keys].children[n])
                                            }
                                        } else {
                                            dict.push(data[i].children[keys])
                                        }

                                    }
                                }
                            }
                        }
                        commit("SET_ALLLIST", dict);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                getNewStbprpb('all').then(res => {
                    if (res.data.code == '200') {
                        commit("SET_WATERRAIN", res.data.data);
                        commit("SET_FLOOD", res.data.data);
                        commit("SET_FORECAST", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                //monitor
                getNewPointListByType(0).then(res => {
                    if (res.data.code == '200') {
                        commit("SET_MONITOR", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                //forecast   getPointListByType(33)
                // getNewStbprpb('all').then(res => {
                //     if (res.data.code == '200') {
                //         commit("SET_FORECAST", res.data.data);
                //     }
                //     resolve(res)
                // }).catch(error => {
                //     console.log(error)
                // });

                //video
                // getNewPointListByType(38).then(res => {
                //     if (res.data.code == '200') {
                //         commit("SET_VIDEO", res.data.data);
                //     }
                //     resolve(res)
                // }).catch(error => {
                //     console.log(error)
                // });

                //spg
                getNewPointListByType(3).then(res => {
                    if (res.data.code == '200') {
                        commit("SET_SPG", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                //dfr
                getNewPointListByType(2).then(res => {
                    if (res.data.code == '200') {
                        commit("SET_DFR", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                //sst
                getNewPointListByType(4).then(res => {
                    if (res.data.code == '200') {
                        commit("SET_SST", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                //env getPointListByType(33)
                getDsmEnv().then(res => {
                    // getNewStbprpb('all').then(res => {
                    if (res.data.code == '200') {
                        commit("SET_ENV", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                //ptr
                getNewPointListByType(1).then(res => {
                    if (res.data.code == '200') {
                        commit("SET_PTR", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                //eqk
                getNewPointListByType(6).then(res => {
                    if (res.data.code == '200') {
                        commit("SET_EQK", res.data.data);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

                realWaterInfo(window.cfg['坝上']).then(res => {
                    if (res.data.code == '200') {
                        commit("SET_WATERLINE", res.data.data.rz);
                    }
                    resolve(res)
                }).catch(error => {
                    console.log(error)
                });

            });
        },
        // 获取所有测点信息
        GetAllPointInfo({ commit, state }) {
            getAllPointInfo().then(res => {
                if (res.data.code == '200') {
                    commit("SET_ALLPOINTINFO", res.data.data)
                }
                resolve(res)
            }).catch(error => {
                console.log(error)
            })
        }

    }
};

export default river




