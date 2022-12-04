const menu = {
    namespaced: true,
    state: {
        activeMenu: '', //一级菜单路由
        theme: '',//主题
        warningInfo: '',//预警信息
        warningPtcd: '',//预警确认的某个ptcd
    },
    getters: {
        activeMenu: state => {
            return state.activeMenu || sessionStorage.getItem('activeMenu')
        },
        theme: state => {
            return state.theme || sessionStorage.getItem('theme')
        },
        warningInfo: state => {
            return state.warningInfo || sessionStorage.getItem('warningInfo')
        },
        warningPtcd: state => {
            return state.warningPtcd || sessionStorage.getItem('warningPtcd')
        },
    },
    mutations: {
        setActiveMenu(state, path) {
            state.activeMenu = path
            sessionStorage.setItem('activeMenu', path)
        },
        setTheme(state, theme) {
            state.theme = theme
            sessionStorage.setItem('theme', theme)
        },
        setWarningInfo(state, warningInfo) {
            state.warningInfo = warningInfo
            sessionStorage.setItem('warningInfo', warningInfo)
        },
        setWarningPtcd(state, warningPtcd) {
            state.warningPtcd = warningPtcd
            sessionStorage.setItem('warningPtcd', warningPtcd)
        }
    },
    actions: {
        setActiveMenu(context, path) {
            context.commit("setActiveMenu", path)
        },
        setTheme(context, theme) {
            context.commit("setTheme", theme)
        },
        setWarningInfo(context, warningInfo) {
            context.commit("setWarningInfo", warningInfo)
        },
        setWarningPtcd(context, warningPtcd) {
            context.commit("setWarningPtcd", warningPtcd)
        }
    }
}

export default menu