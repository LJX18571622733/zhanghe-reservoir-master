<template>
    <div class="info">
        <el-row class="pr">
            <el-col :span="6" v-for="(item,index) in formData" :key="index" class="pr-box">
                    <div class="img-info">
                        <!-- <img src="@/assets/images/ll.png" alt=""> -->
                    </div>
                    <div>
                        <p class="title-text">{{ item.dutytype }}:{{ item.name }}</p>
                        <p class="title-textp">工作地点：{{ item.workplace }}</p>
                        <p class="title-textp">职位：{{ item.post }}</p>
                        <p class="title-textp">主要职责：</p>
                        <p class="info-border title-textp" v-for="(items,indexs) in js[index]" :key="indexs">{{ items }}
                        </p>

                    </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {threePerson} from "@/http/api";

    export default {
        name: "threePerson",
        props: ["dataList", "color", "com", "index"],
        data() {
            return {
                data: {},
                formData: [],
                js: {
                    2:['(1)对水库防洪调度和抢险技术方案提出建议','(2)协助行政责任人现场抢险','(3)协调解决水库安全度汛工作涉及技术方面的问题等'],
                    3:['(1)安排汛期值班值守','(2)巡坝查险','(3)日常报汛','(4)设备操作','(5)水库现场预警发布等'],
                    0:['(1)协调解决水库防汛重大问题','(2)督促技术责任人','(3)巡查责任人和各项度汛措施的落实','(4)统一指挥水库抢险','(5)群众转移等。'],
                    1:['(1)协助市级行政责任人工作','(2)协调水库泄洪安全管理','(3)水库抢险','(4)群众转移等。'],
                },
                xzForm: [],
                jsForm: [],
                xcForm: [],
                js3:['(1)对水库防洪调度和抢险技术方案提出建议','(2)协助行政责任人现场抢险','(3)协调解决水库安全度汛工作涉及技术方面的问题等'],
                js4:['(1)安排汛期值班值守','(2)巡坝查险','(3)日常报汛','(4)设备操作','(5)水库现场预警发布等'],
                js1:['(1)协调解决水库防汛重大问题','(2)督促技术责任人','(3)巡查责任人和各项度汛措施的落实','(4)统一指挥水库抢险','(5)群众转移等。'],
                js2:['(1)协助市级行政责任人工作','(2)协调水库泄洪安全管理','(3)水库抢险','(4)群众转移等。'],
            }
        },
        mounted() {
            if (this.com == this.index) {
                this.getData()
            }
        },
        methods: {
            getData() {
                let that = this
                let dataF = {rscd: window.cfg['rscd'], day: '', post: ''};
                threePerson(window.cfg['rscd'], dataF).then(function (r) {
                    that.xzForm =[]; that.jsForm =[]; that.xcForm =[]
                    that.formData = r.data.data;
                    for (let i = 0; i < r.data.data.length; i++) {
                        if (r.data.data[i]['DUTYTYPE'] == '行政责任人') {
                            that.xzForm.push(r.data.data[i])
                        } else if (r.data.data[i]['DUTYTYPE'] == '技术责任人') {
                            that.jsForm.push(r.data.data[i])
                        } else if (r.data.data[i]['DUTYTYPE'] == '巡查责任人') {
                            that.xcForm.push(r.data.data[i])
                        }

                    }

                });
            }
        },
        watch: {
            com(newval, oldval) {
                if (newval == this.index) {
                    this.getData()
                }
            },
        },
    }
</script>

<style scoped lang="less">
    .info {
        width: 100%;
        height: 600px;
        color: #fff;
        background: rgba(40, 73, 133, 0.8);

        .pr {
            padding-top: 5px;

            .pr-box{
                width: 290px;
                height: 500px;
                display: block;
                border: 1px solid #02f6f9;
                margin: 10px 0 10px 8px;
            }

        }

        .img-info {

            height: 150px;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .font-text {
            width: 20px;
            line-height: 20px;
            height: 20px;
            font-size: 16px;
            font-weight: 600;
            display: block;
            position: absolute;
            top: 20px;
        }

        .title-text {
            font-size: 22px;
            font-weight: 800;
            margin-top: 5px;
            margin-left: 12px;
        }

        .title-textp {
            font-size: 16px;
            margin: 5px 0 5px 12px;
        }

        .info-border {
            margin-left: 20px;
        }

    }
</style>
