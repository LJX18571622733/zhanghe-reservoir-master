<template>
    <!-- 地图关键字，测点查询 -->
    <div class="searchBox">
        <el-form :inline="true" :model="formFilter" class="form-style1" size="small">
            <el-form-item>
                <el-autocomplete
                    ref="autocomplete"
                    v-model="formFilter.keyword"
                    placeholder="请输入关键字查询"
                    :fetch-suggestions="querySearch"
                    :trigger-on-focus="true"
                    @select="handleSelect"
                    @blur="handleBlur"
                    popper-class="my-autocomplete-popper"
                    clearable>
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <template slot-scope="{ item }">
                        <span class="id">{{ item.ptcd }}</span>
                        <span class="desc">({{ item.prnm }} {{ item.content }}监测)</span>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="allPoint">全部测点</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  getPointListData
} from '@/http/api'
export default {
    name: 'searchBox',
    data() {
        return {
            formFilter: {
                keyword: ''
            }
        }
    },
    computed: {
        ...mapGetters(['allPointInfo']),
        listData() {
            return this.allPointInfo.map((current, index, arr) => {
                return {
                    value: current.ptcd,
                    ...current
                }
            })
        }
    },
    created() {
        this.GetAllPointInfo()
    },
    methods: {
        ...mapActions(['GetAllPointInfo']),
        querySearch(queryString, cb) {
            let listData = this.listData
            let results = queryString ? listData.filter(this.createFilter(queryString)) : listData
            // 调用 callback 返回建议列表的数据
            cb(results)
        },
        createFilter(queryString) {
            return (list) => {
                return list.ptcd.toLowerCase().includes(queryString.toLowerCase()) ||
                    list.prnm.toLowerCase().includes(queryString.toLowerCase()) ||
                    list.content.toLowerCase().includes(queryString.toLowerCase())
            }
        },
        handleSelect(item) {
            // 根据ptid获取测点详细信息
            getPointListData({ptid: item.ptid}).then( (r) => {
                const data = r.data.data
                if (data.length) {
                    this.$emit('searchHandle', data)
                } else {
                    console.log('获取测点信息失败！')
                }
            })
        },
        handleBlur() {
            // 由于z-index原因，失去焦点后需要手动关闭下拉列表
            this.$refs.autocomplete.activated = false
        },
        allPoint() {
            this.$emit('pointHandle')
        }
    }
}
</script>
<style lang="scss">
    .my-autocomplete-popper.el-autocomplete-suggestion {
        background-color: rgba(5, 75, 154, 0.8) !important;
        border-color: #00ffff !important;
    }
    .my-autocomplete-popper.el-autocomplete-suggestion li {
        color: #fff;
        padding: 0 12px;
        &:hover {
            background-color: #132a88 !important;
        }
    }
    .my-autocomplete-popper.el-autocomplete-suggestion.el-popper[x-placement^=bottom] .popper__arrow {
        border-bottom-color: #00ffff !important;
        &:after {
            border-bottom-color: #00ffff !important;
        }
    }
    .my-autocomplete-popper li {
        .id {
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .desc {
            font-size: 12px;
            padding: 0 5px;
            color: rgba($white, 0.8);
        }
    }
</style>
<style lang="scss" scoped>
    .searchBox {                        
        // position: absolute;
        // top: 100px;
        // right: 310px;
        // z-index: 3;
    }
</style>