<template>
    <div class="lawsAndRegulations">
        <el-form :inline="true" :model="formInline" class="form-style1 mt-10" size="small">
            <el-form-item label="文件名称：">
                <el-input v-model="formInline.fileName" placeholder="文件名称" style="width:250px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
                label="序号"
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                prop="no"
                label="编号">
            </el-table-column>
            <el-table-column
                prop="fileType"
                label="文件类型">
                <template slot-scope="scope">
                    <i class="file-icon iconfont iconword"></i>
                </template>
            </el-table-column>
            <el-table-column
                prop="time"
                label="发布时间"
                width="120">
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <div class="form-style1">
                        <el-button @click="handleClick(scope.row)" icon="el-icon-download" type="primary" size="mini">下载</el-button>
                        <el-button icon="el-icon-view" type="primary" size="mini">预览</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="mt-10"
            background
            layout="prev, pager, next"
            :total="100">
        </el-pagination>
    </div>
</template>

<script>
export default {
    name: 'rsvrScenery',
    data() {
        return {
            formInline: {
                fileName: ''
            },
            tableData: [
                {  name: '中华人民共和国防汛条例', no: '国务院令第86号', fileType: 'word', time: '2011-01-08'},
                {  name: '中华人民共和国防汛条例', no: '国务院令第86号', fileType: 'word', time: '2011-01-08'},
                {  name: '中华人民共和国防汛条例', no: '国务院令第86号', fileType: 'word', time: '2011-01-08'},
                {  name: '中华人民共和国防汛条例', no: '国务院令第86号', fileType: 'word', time: '2011-01-08'},
                {  name: '中华人民共和国防汛条例', no: '国务院令第86号', fileType: 'word', time: '2011-01-08'},
                {  name: '中华人民共和国防汛条例', no: '国务院令第86号', fileType: 'word', time: '2011-01-08'},
                {  name: '中华人民共和国防汛条例', no: '国务院令第86号', fileType: 'word', time: '2011-01-08'},
                {  name: '中华人民共和国防汛条例', no: '国务院令第86号', fileType: 'word', time: '2011-01-08'},
                {  name: '中华人民共和国防汛条例', no: '国务院令第86号', fileType: 'word', time: '2011-01-08'},
                {  name: '中华人民共和国防汛条例', no: '国务院令第86号', fileType: 'word', time: '2011-01-08'}
            ]
        }
    },
    methods: {
        onSubmit() {}
    }
}
</script>
<style lang="scss" scoped>
    .lawsAndRegulations {
        padding: 10px;
        text-align: left;
        overflow: auto;
        @include styles('background-color', 'blockBg');
        .file-icon {
            @include styles('color', '--color-primary');
            font-size: 20px;
        }
    }
</style>