<template>
    <div class="info">
        <el-row>
            <el-col :span="8" class="tableFormR">
                <el-row>
                    <el-col :span="12">
                        <el-row class="info-border"><span>影响面积</span></el-row>
                        <el-row class="info-border"><span>影响人口</span></el-row>
                        <el-row class="info-border"><span>影响县以上城镇</span></el-row>
                        <el-row class="info-border"><span>影响乡镇</span></el-row>
                        <el-row class="info-border"><span>影响耕地</span></el-row>
                        <el-row class="info-border"><span>影响铁路</span></el-row>
                        <el-row class="info-border"><span>影响公路</span></el-row>
                        <el-row class="info-border"><span>影响经济总量</span></el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row class="info-border"><span>{{data.INAR}}</span></el-row>
                        <el-row class="info-border"><span>{{data.INPP}}</span></el-row>
                        <el-row class="info-border"><span>{{data.INCN}}</span></el-row>
                        <el-row class="info-border"><span>{{data.INTW}}</span></el-row>
                        <el-row class="info-border"><span>{{data.INFL}}</span></el-row>
                        <el-row class="info-border"><span>{{data.INRW}}</span></el-row>
                        <el-row class="info-border"><span>{{data.INRD}}</span></el-row>
                        <el-row class="info-border"><span>{{data.INECAG}}</span></el-row>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16">
                <el-row style="margin: 10px">
                    <!--<img src="@/assets/images/ll.png" alt="" style="width: 100%;height: 100%">-->
                    <div id="map" v-if="false">

                    </div>
                    <iframe src="/pdf/xxyx.pdf" style="height: 550px;width: 780px;"></iframe>

                </el-row>

            </el-col>
        </el-row>

    </div>
</template>

<script>
    import 'ol/ol.css';
    import Map from 'ol/Map';
    import OSM from 'ol/source/OSM';
    import TileLayer from 'ol/layer/Tile';
    import View from 'ol/View';
    import {fromLonLat} from 'ol/proj';
    import {undexrDsins,undexrGis} from "@/http/api";

    export default {
        name: "underYx",
        props: ["dataList", "color", "com", "index"],
        data() {
            return {
                data: {},
                formData:{},
                map:''
            }
        },
        mounted() {
            if (this.com == this.index) {
                this.getData()
                this.initMap()
            }
        },
        methods: {
            getData(){
                let that = this
                //影响数据接口
                undexrDsins(window.cfg['坝上']).then(function (r) {
                    that.data = r.data.data[0]
                });
                //影像范围gis数据
                undexrGis(window.cfg['坝上']).then(function (r) {
                    that.formData = r.data.data;
                });
            },
            initMap(){
                if(!this.map){
                    this.map = new Map({
                        layers: [
                            new TileLayer({
                                source: new OSM(),
                            }) ],
                        target: 'map',
                        view: new View({
                            center: fromLonLat([115.878611, 31.675833]),
                            zoom: 12,
                        }),
                    });
                }


            }
        },
        watch: {
            com(newval, oldval) {
                if (newval == this.index) {
                    this.getData()
                    this.initMap()
                }
            },
        },
    }
</script>

<style scoped lang="less">
    .info {
        height: 550px;
        .info-header {
            font-size: 18px;
            margin: 10px;
            display: block;
            font-weight: 800;
            color: #00ffff;

        }

        .info-border {
            border: 1px solid #4989dc;
            background: #27548f;
            text-align: center;
            height: 30px;
            line-height: 30px;

        }


        /deep/ .el-col {
            color: #fff;

            .text-title {
                text-align: center;

                .titlep {
                    font-size: 20px;
                    font-weight: 800;
                    color: #00f8fe;
                    margin: 10px;

                    .titles {
                        font-size: 14px;
                        font-weight: normal;
                    }
                }

                .title-bottom {
                    float: left;
                    margin: 5px;
                }

            }

        }


        width: 100%;
        //background: rgba(40, 73, 133, 0.8);

        .tableFormR {
            height: 100%;
            padding: 10px;
        }

        /deep/ .el-form-item__label {
            color: #fff;
        }

        /deep/ .el-table th, /deep/ .el-table tr {
            color: #fff;
            background: rgba(40, 73, 133, 0.8);
        }

        /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
            background: rgba(40, 73, 133, 0.8);
        }

        .borderBox {
            border-right: 1px solid;
            border-image: -webkit-linear-gradient(transparent, #2071a9, transparent) 1 10 1;
            border-image: -moz-linear-gradient(transparent, #2071a9, transparent) 1 10 1;
            border-image: linear-gradient(transparent, #2071a9, transparent) 1 10 1;
        }

        #map{
            width: 780px;
            height: 550px;
        }


    }
</style>
