import { mapGetters } from 'vuex'
import {
    getNewStbprpb,
    realWaterInfo
} from '@/http/api'
export default {
    data() {
        return {
            userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
        }
    },
    computed: {
        ...mapGetters({
            _theme: 'menu/theme',
        }),
        sysTheme() {
            let path = this.$route.path
            return path == '/map' ? 'dark' : this._theme //map页面是深色风格，不受影响，其他页面有两种主题切换
        }
    },
    methods: {
        //水库站
        async getRR() {
            await getNewStbprpb('rr').then(res => {
                if (res.data.code == '200') {
                    this.$store.commit('SET_RR', res.data.data)
                }
            })
        },
        //实时水位线
        async getWaterLine() {
            await realWaterInfo(window.cfg['坝上']).then(res => {
                if (res.data.code == '200') {
                    this.$store.commit('SET_WATERLINE', res.data.data.rz)
                }
            })
        },
        
    }
}