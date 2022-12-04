<template>
    <div class="info"
         v-loading="!loading"
         element-loading-text="加载中..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0)">
        <el-row>
            <el-col :span="11.5" style="height: 660px;overflow: auto">
                <span class="info-title">测站基本属性</span>
                <el-form label-width="110px" :model="form" class="form-bk">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="测站编码">
                                <label>{{ form.stcd }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="站类">
                                <label>{{ form.sttp }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="one">
                        <el-col :span="12">
                            <el-form-item label="测站名称">
                                <label>{{ form.stnm }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="报汛等级">
                                <label>{{ form.frgrd }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="河流名称">
                                <label>{{ form.rvnm }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="one">
                        <el-col :span="24">
                            <el-form-item label="水系名称">
                                <label>{{ form.hnnm }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="流域名称">
                                <label>{{ form.bsnm }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="行政区划码">
                                <label>{{ form.addvcd }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="one">
                        <el-col :span="12">
                            <el-form-item label="经度">
                                <label>{{ form.lgtd }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="纬度">
                                <label>{{ form.lttd }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="站址">
                                <label>{{ form.stlc }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="one">
                        <el-col :span="24">
                            <el-form-item label="基面名称">
                                <label>{{ form.dtmnm }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="基面高程">
                                <label>{{ form.dtmel }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="基面修正值">
                                <label>{{ form.dtpr }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="one">
                        <el-col :span="12">
                            <el-form-item label="建站年月">
                                <label>{{ form.esstym }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="始报年月">
                                <label>{{ form.bgfrym }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="隶属行业单位">
                                <label>{{ form.atcunit }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="one">
                        <el-col :span="24">
                            <el-form-item label="信息管理单位">
                                <label>{{ form.admauth }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="交换管理单位">
                                <label>{{ form.locality }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="one">
                        <el-col :span="12">
                            <el-form-item label="测站岸别">
                                <label>{{ form.stbk }}</label>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="测站方位">
                                <label>{{ form.stazt }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>


                </el-form>
            </el-col>

            <el-col :span="12.5">
                <div style="width:615px;height:330px;margin: 10px 0px 0px 10px">
                    <img :src="imgUrl" alt="" width="615" height="330">
                </div>
                <div style="margin: 0 0px 10px 10px" class="tableFormR">
                    <span class="info-title">报警指标</span>
                    <el-table :data="tableData" border height="270"
                              style="width: 100%;background: rgba(40, 73, 133, 0.8);">
                        <el-table-column prop="wmtp" label="报警类别"></el-table-column>
                        <el-table-column prop="wmsu" label="指标来源">
                        </el-table-column>
                        <el-table-column prop="wmmax" label="上限值">
                        </el-table-column>
                        <el-table-column prop="wmmin" label="下限值"></el-table-column>
                        <el-table-column prop="wmlv" label="报警级别">
                        </el-table-column>
                        <el-table-column prop="wlcr" label="报警颜色">
                        </el-table-column>
                    </el-table>
                </div>

            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {getPointBaseIfo,getPointWarnInfo,getPointPic} from "@/http/api";

    export default {
        props: ["dataList", "color", "com", "index", "pointid"],
        data() {
            return {
                tableData: [{}],
                form: {
                    name: '',
                    region: '',
                    type: ''
                },
                flieds: {},
                ptid: '',
                forms: {},
                img: '',
                formWarn: {},
                loading:false,
                imgUrl:''
            }
        },
        mounted() {
            if (this.com == this.index) {
                this.getPtid()
            }

        },
        methods: {
            getPtid() {
                let that = this
                let river = this.$store.state.river['waterRain'];
                for (let i = 0, len = river.length; i < len; i++) {
                    if (river[i].ptid == that.pointid) {
                        that.ptid = river[i].ptcd
                        that.getData();
                    }
                }
            },
            getData() {
                this.loading = false
                let that = this
                getPointBaseIfo(this.ptid).then(r => {
                    that.form = r.data.data
                })
                getPointWarnInfo(this.pointid).then(r => {
                    that.tableData = r.data.data
                    that.loading = true
                })
                getPointPic(this.pointid).then(r => {
                    that.imgUrl = r.data.data.imgUrl
                })

            },

        },
        watch: {
            com(newval, oldval) {
                if (newval == this.index) {
                    this.loading = false
                    this.getPtid()
                }
            },
        },

    }
</script>

<style scoped lang="less">
    .info {
        /*background: #fff;*/

        .form-bk {
            width: 548px;
            height: 610px;
            margin: 0 0 10px 10px;
            background: url("../../assets/images/bg_tk1.png") 100% 100% no-repeat;

            .one {
                background-color: #254f89;
            }
        }

        .el-form-item {
            margin-bottom: 0px;
            color: #fff;
            /*border: 1px solid #ccc;*/

            label {
                margin-left: 20px;
            }
        }

        /deep/ .el-form-item__label {
            padding: 0 5px 0 0;
            color: #13c7f9;
        }

        .el-col-18 {
            padding: 0 0 0 5px;
        }

        .info-title {
            padding: 5px 0;
            color: #46f0ff;
            font-size: 18px;
            font-weight: 700;
            margin: 0 0px 5px 10px;
            display: block;
        }

        /*表格样式*/

        .tableFormR {

            /deep/ .el-table--border td, /deep/ .el-table--border th, /deep/ .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
                border: 1px solid #4077c3;
            }


            /deep/ .el-table td, /deep/ .el-table th.is-leaf {
                border: 1px solid #4077c3;
            }

            .el-table--border, .el-table--group {
                border: 1px solid #4077c3;
            }

        }

        /deep/ .el-table th {
            color: #fff;
            background: rgba(51, 102, 159, 0.8);

            .gutter {
                display: table-cell !important;
            }
        }

        /deep/ .el-table tr {
            color: #fff;
            background: rgba(40, 73, 133, 0.8);
        }

        /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
            background: rgba(40, 73, 133, 0.8);
        }


    }
</style>
