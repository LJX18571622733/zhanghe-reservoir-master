import Vue from 'vue'
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '登录',
    meta: {
      login: false
    },
    component: () => import('../views/login.vue')
  },
  {
    path: '/map',
    name: '',
    meta: {
      login: true
    },
    component: () => import('../views/layout.vue'),
    children: [
      {
        path: '/map',
        name: '一张图',
        meta: {
          login: true
        },
        component: () => import('../views/homenew.vue')
      },
      {
        path: '/prjInfo',
        redirect: '/prjInfo/rsvrInfo/rsvrProfile',
        name: '工程信息',
        meta: {
          login: true
        },
        component: () => import('../views/prjInfo.vue'),
        children: [
          {
            path: 'rsvrInfo',
            name: '水库信息',
            meta: {
              login: true
            },
            component: () => import('../components/layout/template.vue'),
            children: [
              {
                path: 'rsvrMain',
                name: '水库首页',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/rsvrInfo/rsvrMain.vue'),
              }, {
                path: 'rsvrProfile',
                name: '水库概况',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/rsvrInfo/rsvrProfile.vue'),
              }, {
                path: 'rsvrReg',
                name: '注册信息',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/rsvrInfo/rsvrReg.vue'),
              }, {
                path: 'rsvrFeature',
                name: ' 水库特征',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/rsvrInfo/rsvrFeature.vue'),
              }, {
                path: 'rsvrScenery',
                name: '水库风景',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/rsvrInfo/rsvrScenery.vue'),
              }, 
              // {
              //   path: 'rsvrVideo',
              //   name: '水库视频',
              //   meta: {
              //     login: true
              //   },
              //   component: () => import('../views/prjInfo/rsvrInfo/rsvrVideo.vue'),
              // }, 
              {
                path: 'rsvrBuilding',
                name: '建筑物',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/rsvrInfo/rsvrBuilding.vue'),
              }]
          },
          {
            path: 'featureParam',
            name: '特征参数',
            meta: {
              login: true
            },
            component: () => import('../components/layout/template.vue'),
            children: [
              {
                path: 'paramSummary',
                name: '参数汇总',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/featureParam/paramSummary.vue')
              },
              {
                path: 'storageCurve',
                name: '库容曲线',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/featureParam/storageCurve.vue')
              },
              {
                path: 'areaCurve',
                name: '面积曲线',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/featureParam/areaCurve.vue')
              },
              {
                path: 'dischargeCurve',
                name: '下泄流量关系曲线',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/featureParam/dischargeCurve.vue')
              }
            ]
          },
          {
            path: 'rulesAndReg',
            name: '规章制度',
            meta: {
              login: true
            },
            component: () => import('../components/layout/template.vue'),
            children: [
              {
                path: 'laws',
                name: '法律',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/rsvrLaws/laws.vue')
              },
              {
                path: 'regulations',
                name: '行政法规',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/rsvrLaws/regulations.vue')
              },
              {
                path: 'standard',
                name: '技术标准',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/rsvrLaws/standard.vue')
              }
            ]
          },
          {
            path: 'prjInfo1',
            name: '工程概况',
            meta: {
              login: true
            },
            component: () => import('../views/prjInfo/prjInfo1.vue'),
            children: [
              {
                path: 'prjOverview',
                name: '工程简介',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/prjInfo1/prjOverview.vue'),
              }, {
                path: 'prjBlueprint',
                name: '工程图档',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/prjInfo1/prjBlueprint.vue'),
              }]
          },
          // {
          //   path: 'rsvrOrg',
          //   name: '组织机构',
          //   meta: {
          //     login: true
          //   },
          //   // component: () => import('../views/prjInfo/rsvrOrg.vue')
          //   component: () => import('../components/layout/template.vue'),
          //   children: [
          //     {
          //       path: 'departmentFramework',
          //       name: '部门架构',
          //       meta: {
          //         login: true
          //       },
          //       component: () => import('../views/prjInfo/rsvrOrg/departmentFramework.vue')
          //     },
          //     {
          //       path: 'departmentManage',
          //       name: '部门管理',
          //       meta: {
          //         login: true
          //       },
          //       component: () => import('../views/prjInfo/rsvrOrg/departmentManage.vue')
          //     },
          //     {
          //       path: 'staffManage',
          //       name: '部门人员管理',
          //       meta: {
          //         login: true
          //       },
          //       component: () => import('../views/prjInfo/rsvrOrg/staffManage.vue')
          //     },
          //     {
          //       path: 'tempOrg',
          //       name: '临时机构',
          //       meta: {
          //         login: true
          //       },
          //       component: () => import('../views/prjInfo/rsvrOrg/tempOrg.vue')
          //     },
          //     {
          //       path: 'otherOrg',
          //       name: '其他组织',
          //       meta: {
          //         login: true
          //       },
          //       component: () => import('../views/prjInfo/rsvrOrg/otherOrg.vue')
          //     }
          //   ]
          // },
          {
            path: 'rsvrLaws/:id',
            name: '法律法规',
            meta: {
              login: true
            },
            component: () => import('../views/prjInfo/rsvrLaws.vue')
          },
          {
            path: '/test',
            name: '测试页面',
            meta: {
              login: true
            },
            component: () => import('../components/layout/template.vue'),
            children: [
              {
                path: '/test1',
                name: '测点选择组件',
                meta: {
                  login: true
                },
                component: () => import('../views/prjInfo/test/selectPointTest.vue'),
              }
            ]
          }
        ]
      },
      {
        path: '/waterRain',
        redirect: '/waterRain/dataQuery/stationDis',
        name: '水雨情',
        meta: {
          login: true
        }, component: () => import('../views/waterRain.vue'),
        children: [{
          path: 'dataQuery',
          name: '数据查询',
          meta: {
            login: true
          },
          component: () => import('../components/layout/template.vue'),
          children: [
            // {
            //   path: 'stationDis',
            //   name: '测站分布图',
            //   meta: {
            //     login: true
            //   },
            //   component: () => import('../views/waterRain/dataQuery/stationDis.vue')
            // },
            {
              path: 'query',
              name: '测值查询',
              meta: {
                login: true
              },
              component: () => import('../views/waterRain/dataQuery/query.vue')
            },
            {
              path: 'rainfallInfo',
              name: '降雨信息',
              meta: {
                login: true
              },
              component: () => import('../views/waterRain/dataQuery/rainfall.vue')
            },
            {
              path: 'status',
              name: '测站状态',
              meta: {
                login: true
              },
              component: () => import('../views/waterRain/dataQuery/status.vue')
            }
          ]
        },
        {
          path: 'graphicalAnalysis',
          name: '图形分析',
          meta: {
            login: true
          },
          component: () => import('../components/layout/template.vue'),
          children: [
            {
              path: 'rainfall',
              name: '降雨柱状图',
              meta: {
                login: true
              },
              component: () => import('../views/waterRain/graphicalAnalysis/rainfall.vue')
            },
            {
              path: 'hydrograph',
              name: '过程线分析',
              meta: {
                login: true
              },
              component: () => import('../views/waterRain/graphicalAnalysis/hydrograph.vue')
            },
            // {
            //   path: 'rainfallFlood',
            //   name: '雨洪对照图',
            //   meta: {
            //     login: true
            //   },
            //   component: () => import('../views/waterRain/graphicalAnalysis/rainfallFlood.vue')
            // },
          ]
        },
        {
          path: 'reportForms',
          name: '数据报表',
          meta: {
            login: true
          },
          component: () => import('../components/layout/template.vue'),
          children: [
            {
              path: 'rainfallReport',
              name: '人工观察数据录入',
              meta: {
                login: true
              },
              component: () => import('../views/waterRain/reportForms/rainfallReport.vue')
            },
            {
              path: 'waterLevelReport',
              name: '逐日坝上水位年报表',
              meta: {
                login: true
              },
              component: () => import('../views/waterRain/reportForms/waterLevelReport.vue')
            },
            {
              path: 'underWaterLevelReport',
              name: '逐日坝下水位年报表',
              meta: {
                login: true
              },
              component: () => import('../views/waterRain/reportForms/underWaterLevelReport.vue')
            },
          ]
        },
        {
          path: 'laborObservation',
          name: '人工观察',
          meta: {
            login: true
          },
          component: () => import('../components/layout/template.vue'),
          children: [
            {
              path: 'dataEntering',
              name: '人工观察数据录入',
              meta: {
                login: true
              },
              component: () => import('../views/waterRain/laborObservation/dataEntering.vue')
            },
          ]
        },
        ]
      },
      {
        path: '/safetyMonitor',
        redirect: '/safetyMonitor/dataQuery/generalLayout',
        name: '安全监测',
        meta: {
          login: true
        },
        component: () => import('../views/safetyMonitor.vue'),
        children: [{
          path: 'index',
          name: '安全监测首页',
          meta: {
            login: true
          },
          component: () => import('../views/safetyMonitor/index.vue')
        },
        {
          path: 'dataQuery',
          name: '数据查询',
          meta: {
            login: true
          },
          component: () => import('../components/layout/template.vue'),
          // component: () => import('../views/safetyMonitor/dataQuery.vue'),
          children: [
            // {
            //   path: 'generalLayout',
            //   name: '安全监测布置图',
            //   meta: {
            //     login: true
            //   },
            //   component: () => import('../views/safetyMonitor/dataQuery/generalLayout.vue'),
            // },
            {
              path: 'valueQuery',
              name: '测值查询',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/dataQuery/valueQuery.vue'),
            },
            {
              path: 'instrumentForm',
              name: '仪器安装考证表',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/dataQuery/instrumentForm.vue'),
            },
            {
              path: 'warningRecord',
              name: '预警预报记录',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/dataQuery/warningRecord.vue'),
            },
            {
              path: 'featureQuery',
              name: '特征值查询',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/dataQuery/featureQuery.vue'),
            }, {
              path: 'warnQuery',
              name: ' 超限记录',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/dataQuery/warnQuery.vue'),
            }, {
              path: 'limitQuery',
              name: '极限值查询',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/dataQuery/limitQuery.vue'),
            }, {
              path: 'monitorItem',
              name: '监测项目',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/dataQuery/monitorItem.vue'),
            }]
        },
        {
          path: 'dataGather',
          name: '数据采集',
          meta: {
            login: true
          },
          component: () => import('../views/safetyMonitor/dataGather.vue'),
          children: [
            {
              path: 'insStateList',
              name: '数据状态一览表',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/dataGather/insStateList.vue'),
            }, {
              path: 'missingData',
              name: '数据缺项情况表',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/dataGather/missingData.vue'),
            }, {
              path: 'rorgAi',
              name: ' 智能整编',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/dataGather/rorgAi.vue'),
            }]
        },
        {
          path: 'manualObserve',
          name: '人工观测',
          meta: {
            login: true
          },
          // component: () => import('../views/safetyMonitor/manualObserve.vue'),
          component: () => import('../components/layout/template.vue'),
          children: [
            {
              path: 'artificial',
              name: '人工录入',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/manualObserve/artificial.vue'),
            }, {
              path: 'fileIn',
              name: '文件导入',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/manualObserve/fileIn.vue'),
            }, {
              path: 'reorganization',
              name: ' 人工整编',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/manualObserve/reorganization.vue'),
            }]
        },
        {
          path: 'walkaroundInspection',
          name: '巡视检查',
          meta: {
            login: true
          },
          component: () => import('../components/layout/template.vue'),
          children: [
            {
              path: 'entering',
              name: '巡检过程录入',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/walkaroundInspection/entering.vue'),
            },
            {
              path: 'report',
              name: '巡检事件上报',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/walkaroundInspection/report.vue'),
            },
            {
              path: 'reportQuery',
              name: '巡检报告查询',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/walkaroundInspection/reportQuery.vue'),
            }]
        },
        {
          path: 'pictorialStatement',
          name: '图形报表',
          meta: {
            login: true
          },
          component: () => import('../components/layout/template.vue'),
          children: [
            {
              path: 'hydrograph',
              name: '过程线',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/pictorialStatement/hydrograph.vue'),
            },
            {
              path: 'analyse',
              name: '相关分析',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/pictorialStatement/analyse.vue'),
            },
            {
              path: 'linearRegression',
              name: '线性回归',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/pictorialStatement/linearRegression.vue'),
            },
            {
              path: 'stepwiseRegression',
              name: '逐步回归',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/pictorialStatement/stepwiseRegression.vue'),
            },
            {
              path: 'statement',
              name: '报表',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/pictorialStatement/statement.vue'),
            },
            // {
            //   path: 'annualStatement',
            //   name: '年报表',
            //   meta: {
            //     login: true
            //   },
            //   component: () => import('../views/safetyMonitor/pictorialStatement/annualStatement.vue'),
            // },
            // {
            //   path: 'monthlyStatement',
            //   name: '月报表',
            //   meta: {
            //     login: true
            //   },
            //   component: () => import('../views/safetyMonitor/pictorialStatement/monthlyStatement.vue'),
            // },
            {
              path: 'timeReport',
              name: '时段报表',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/pictorialStatement/timeReport.vue'),
            }]
        },
        {
          path: 'dataStore',
          name: '数据整编',
          meta: {
            login: true
          },
          component: () => import('../components/layout/template.vue'),
          children: [
            {
              path: 'manualEntry',
              name: '人工录入',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/dataStore/manualEntry.vue'),
            }, {
              path: 'fileImport',
              name: '文件导入',
              meta: {
                login: true
              },
              component: () => import('../views/safetyMonitor/dataStore/fileImport.vue'),
            }]
        },
        // {
        //   path: 'specialMonitor',
        //   name: '专项监测',
        //   meta: {
        //     login: true
        //   },
        //   component: () => import('../components/layout/template.vue'),
        //   children: [
        //     {
        //       path: 'earthquake',
        //       name: '强震监测',
        //       meta: {
        //         login: true
        //       },
        //       component: () => import('../views/safetyMonitor/specialMonitor/earthquake.vue'),
        //     }
        //   ]
        // }
      ]
      },
      {
        path: '/videoSurveillance',
        name: '视频监控',
        redirect: '/videoSurveillance/camera',
        meta: {
          login: true
        },
        component: () => import('../views/videoSurveillance.vue'),
        children: [{
          path: 'camera',
          name: '摄像头',
          meta: {
            login: true
          },
          component: () => import('../views/videoSurveillance/camera.vue')
        }]
      },
      {
        path: '/analysis',
        name: '分析评估',
        meta: {
          login: true
        },
        component: () => import('../views/analysis.vue'),
        children: [{
          path: 'timeSeries',
          name: '时序分析',
          meta: {
            login: true
          },
          component: () => import('../views/analysis/timeSeries.vue')
        }, {
          path: 'relevant',
          name: '相关分析',
          meta: {
            login: true
          },
          component: () => import('../views/analysis/relevant.vue')
        }, {
          path: 'linear',
          name: '线性回归分析',
          meta: {
            login: true
          },
          component: () => import('../views/analysis/linear.vue')
        }, {
          path: 'stepwise',
          name: '逐步回归分析',
          meta: {
            login: true
          },
          component: () => import('../views/analysis/stepwise.vue')
        }, {
          path: 'yearRep',
          name: '年报表',
          meta: {
            login: true
          },
          component: () => import('../views/analysis/yearRep.vue')
        }, {
          path: 'monthRep',
          name: '月报表',
          meta: {
            login: true
          },
          component: () => import('../views/analysis/monthRep.vue')
        }]
      },
      {
        path: '/inspection',
        name: '巡视检查',
        redirect: '/inspection/repQuery',
        meta: {
          login: true
        }, component: () => import('../views/inspection.vue'),
        children: [
          //   {
          //   path: 'processIn',
          //   name: '巡检过程录入',
          //   meta: {
          //     login: true
          //   },
          //   component: () => import('../views/inspection/processIn.vue')
          // }, {
          //   path: 'eventRep',
          //   name: '巡检事件上报',
          //   meta: {
          //     login: true
          //   },
          //   component: () => import('../views/inspection/eventRep.vue')
          // }, 
          {
            path: 'repQuery',
            name: '巡检报告查询',
            meta: {
              login: true
            },
            component: () => import('../views/inspection/repQuery.vue')
          }]
      },
      {
        path: '/systemManage',
        name: '系统管理',
        redirect: '/systemManage/appManage/accountManage',
        meta: {
          login: true
        },
        component: () => import('../views/systemManage.vue'),
        children: [
          {
            path: 'appManage',
            name: 'APP管理',
            meta: {
              login: true
            },
            component: () => import('../components/layout/template.vue'),
            children: [
              {
                path: 'accountManage',
                name: '登录设置',
                meta: {
                  login: true
                },
                component: () => import('../views/systemManage/appManage/accountManage.vue')
              }
            ]
          },
          {
            path: 'configurationInfo',
            name: '信息查询维护',
            meta: {
              login: true
            },
            component: () => import('../components/layout/template.vue'),
            children: [
              {
                path: 'reservoirManage',
                name: '水库管理',
                meta: {
                  login: true
                },
                component: () => import('../views/systemManage/configurationInfo/reservoirManage.vue')
              }
            ]
          },
          {
            path: 'basicData',
            name: '基础数据维护',
            meta: {
              login: true
            },
            component: () => import('../components/layout/template.vue'),
            children: [
              {
                path: 'instrumentName',
                name: '仪器名称管理',
                meta: {
                  login: true
                },
                component: () => import('../views/systemManage/basicData/instrumentName.vue')
              },
              {
                path: 'instrumentManufacturers',
                name: '仪器厂商管理',
                meta: {
                  login: true
                },
                component: () => import('../views/systemManage/basicData/instrumentManufacturers.vue')
              },
              {
                path: 'instrumentPerformance',
                name: '仪器性能参数',
                meta: {
                  login: true
                },
                component: () => import('../views/systemManage/basicData/instrumentPerformance.vue')
              },
              {
                path: 'monitoringProgram',
                name: '监测项目管理',
                meta: {
                  login: true
                },
                component: () => import('../views/systemManage/basicData/monitoringProgram.vue')
              },
              {
                path: 'monitoringCategory',
                name: '监测类别管理',
                meta: {
                  login: true
                },
                component: () => import('../views/systemManage/basicData/monitoringCategory.vue')
              },
              {
                path: 'safetyMonitoringProgram',
                name: '安全监测监测项目管理',
                meta: {
                  login: true
                },
                component: () => import('../views/systemManage/basicData/safetyMonitoringProgram.vue')
              },
              {
                path: 'measuredPart',
                name: '测点部位管理',
                meta: {
                  login: true
                },
                component: () => import('../views/systemManage/basicData/measuredPart.vue')
              },
              {
                path: 'measuredParameters',
                name: '测点参数',
                meta: {
                  login: true
                },
                component: () => import('../views/systemManage/basicData/measuredParameters.vue')
              },
              {
                path: 'measuredSummarizing',
                name: '测点汇总',
                meta: {
                  login: true
                },
                component: () => import('../views/systemManage/basicData/measuredSummarizing.vue')
              },
              {
                path: 'measuredRelation',
                name: '测点关系',
                meta: {
                  login: true
                },
                component: () => import('../views/systemManage/basicData/measuredRelation.vue')
              },
              {
                path: 'construction',
                name: '建筑物管理',
                meta: {
                  login: true
                },
                component: () => import('../views/systemManage/basicData/construction.vue')
              }
            ]
          }
        ]
      },
    ]
  },
  {
    path: '/reservoirPlatform',
    name: '水库大坝安全综合服务平台',
    meta: {
      login: true
    },
    component: () => import('../views/reservoirPlatform/index.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.login) {
    var userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
    if (userInfo != null && userInfo.userName != null) {
      next()
    } else {
      next({ name: '登录' })

    }
  } else {
    if (to.name != "登录") {
      next({ name: '登录' })
    } else {
      next()
    }
  }

  // next()

})

export default router
