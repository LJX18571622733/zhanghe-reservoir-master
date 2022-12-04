<template>
  <div class="reservoirIndex">
    <el-page-header
      @back="goBack"
      :content="id === null ? '新增' : '编辑'"
    ></el-page-header>
    <el-form
      :inline="true"
      label-width="160px"
      :model="form"
      class="form form-style1"
      ref="form"
    >
      <el-form-item label="水库代码：">
        <el-input v-model="rscd" placeholder="请输入水库代码"></el-input>
      </el-form-item>
      <div class="classify">建设概况</div>
      <el-form-item label="主管单位：">
        <el-input
          v-model="form.sysWrpRsrCnbsin.cmun"
          placeholder="请输入主管单位"
        ></el-input>
      </el-form-item>
      <el-form-item label="运行管理单位：">
        <el-input
          v-model="form.sysWrpRsrBsin.mnun"
          placeholder="请输入运行管理单位"
        ></el-input>
      </el-form-item>
      <el-form-item label="开工日期：">
        <el-date-picker
          v-model="form.sysWrpRsrCnbsin.stdt"
          type="date"
          placeholder="请选择开工日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="竣工日期：">
        <el-date-picker
          v-model="form.sysWrpRsrBsin.cpyr"
          type="date"
          placeholder="请选择竣工日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="首次蓄水：">
        <el-input
          v-model="form.sysWrpRsrCnbsin.firstxushui"
          placeholder="请输入首次蓄水"
        ></el-input>
      </el-form-item>
      <el-form-item label="设计单位：">
        <el-input
          v-model="form.sysWrpRsrCnbsin.dsun"
          placeholder="请输入设计单位"
        ></el-input>
      </el-form-item>
      <el-form-item label="施工单位：">
        <el-input
          v-model="form.sysWrpRsrCnbsin.cnun"
          placeholder="请输入施工单位"
        ></el-input>
      </el-form-item>
      <el-form-item label="设计地震烈度：">
        <el-input
          v-model="form.sysWrpRsrBsin.bsssin"
          placeholder="请输入设计地震烈度"
        ></el-input>
      </el-form-item>
      <div class="classify">水文特征</div>
      <el-form-item label="历史最高水位：">
        <el-input
          v-model="form.sysWrpRsrHych.maxrz"
          placeholder="请输入历史最高水位"
        >
          <template slot="append">m</template></el-input
        >
      </el-form-item>
      <el-form-item label="集雨面积：">
        <el-input
          v-model="form.sysWrpRsrCnbsin.jymj"
          placeholder="请输入集雨面积"
        >
          <template slot="append">亿m³</template></el-input
        >
      </el-form-item>
      <el-form-item label="多年平均降水量：">
        <el-input
          v-model="form.sysWrpRsrHych.avanpram"
          placeholder="请输入多年平均降水量"
        >
          <template slot="append">mm</template></el-input
        >
      </el-form-item>
      <el-form-item label="多年平均径流量：">
        <el-input
          v-model="form.sysWrpRsrHych.avanrnam"
          placeholder="请输入多年平均径流量"
        >
          <template slot="append">m³/s</template></el-input
        >
      </el-form-item>
      <el-form-item label="多年平均输沙量：">
        <el-input
          v-model="form.sysWrpRsrHych.avabsdam"
          placeholder="请输入多年平均输沙量"
        >
          <template slot="append">t</template></el-input
        >
      </el-form-item>
      <el-form-item label="设计水位(重现期)：">
        <el-input
          v-model="form.sysWrpRsrHych.dsrcin"
          placeholder="请输入设计水位(重现期)"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="设计水位(洪水总量)：">
        <el-input
          v-model="form.sysWrpRsrHych.dspkfl"
          placeholder="请输入设计水位（洪水总量)"
        >
          <template slot="append">亿m³</template></el-input
        >
      </el-form-item>
      <el-form-item label="校核水位(重现期)：">
        <el-input
          v-model="form.sysWrpRsrHych.chrcin"
          placeholder="请输入校核水位(重现期)"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="校核水位(洪水总量)：">
        <el-input
          v-model="form.sysWrpRsrHych.chpkfl"
          placeholder="请输入校核水位（洪水总量)"
        >
          <template slot="append">m³/s</template></el-input
        >
      </el-form-item>
      <div class="classify">地理位置</div>
      <el-form-item label="所在县(市、区)：">
        <el-input
          v-model="form.sysWrpRsrBsin.cmun"
          placeholder="请输入所在县(市、区)"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="所在乡(镇、村)：">
        <el-input
          v-model="form.sysWrpRsrBsin.vltw"
          placeholder="请输入所在乡(镇、村)"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="水库所属部门或系统：">
        <el-input
          v-model="form.sysWrpRsrBsin.blsys"
          placeholder="请输入水库所属部门或系统"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="所在河流(水系河流)：">
        <el-input
          v-model="form.sysWrpRsrBsin.rvcd"
          placeholder="请输入所在河流(水系河流)"
        >
        </el-input>
      </el-form-item>
      <div class="classify">除险加固</div>
      <el-form-item label="除险加固时间：">
        <el-input
          v-model="form.sysWrpRsrCnbsin.cxjddate"
          placeholder="请输入除险加固时间"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="除险加固投资：">
        <el-input
          v-model="form.sysWrpRsrCnbsin.cxjdtz"
          placeholder="请输入除险加固投资"
        >
        </el-input>
      </el-form-item>
      <div class="classify">水库特征</div>
      <el-form-item label="高程系统：">
        <el-input
          v-model="form.sysWrpRsrCnbsin.gcxt"
          placeholder="请输入高程系统"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="调节性能：">
        <el-input
          v-model="form.sysWrpRsrHych.rsrrgtpfm"
          placeholder="请输入调节性能"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="总库容：">
        <el-input
          v-model="form.sysWrpRsrHych.ttstcp"
          placeholder="请输入总库容"
        >
          <template slot="append">亿m³</template>
        </el-input>
      </el-form-item>
      <el-form-item label="调洪库容：">
        <el-input
          v-model="form.sysWrpRsrHych.flstcp"
          placeholder="请输入调洪库容"
        >
          <template slot="append">亿m³</template>
        </el-input>
      </el-form-item>
      <el-form-item label="防洪库容：">
        <el-input
          v-model="form.sysWrpRsrHych.flcnstcp"
          placeholder="请输入防洪库容"
        >
          <template slot="append">亿m³</template>
        </el-input>
      </el-form-item>
      <el-form-item label="兴利库容：">
        <el-input
          v-model="form.sysWrpRsrHych.acstcp"
          placeholder="请输入兴利库容"
        >
          <template slot="append">亿m³</template>
        </el-input>
      </el-form-item>
      <el-form-item label="死库容：">
        <el-input
          v-model="form.sysWrpRsrHych.ddstcp"
          placeholder="请输入死库容"
        >
          <template slot="append">亿m³</template>
        </el-input>
      </el-form-item>
      <el-form-item label="校核洪水位：">
        <el-input
          v-model="form.sysWrpRsrHych.chfllv"
          placeholder="请输入校核洪水位"
        >
          <template slot="append">m</template>
        </el-input>
      </el-form-item>
      <el-form-item label="设计洪水位：">
        <el-input
          v-model="form.sysWrpRsrHych.dsfllv"
          placeholder="请输入设计洪水位"
        >
          <template slot="append">m</template>
        </el-input>
      </el-form-item>
      <el-form-item label="防洪高水位：">
        <el-input
          v-model="form.sysWrpRsrHych.flcnhgwl"
          placeholder="请输入防洪高水位"
        >
          <template slot="append">m</template>
        </el-input>
      </el-form-item>
      <el-form-item label="正常蓄水位：">
        <el-input
          v-model="form.sysWrpRsrHych.nrstlv"
          placeholder="请输入正常蓄水位"
        >
          <template slot="append">m</template>
        </el-input>
      </el-form-item>
      <el-form-item label="主汛期限制水位：">
        <el-input
          v-model="form.sysWrpRsrHych.mjflsscnwl"
          placeholder="请输入汛期限制水位"
        >
          <template slot="append">m</template>
        </el-input>
      </el-form-item>
      <el-form-item label="死水位：">
        <el-input v-model="form.sysWrpRsrHych.ddwl" placeholder="请输入死水位">
          <template slot="append">m</template>
        </el-input>
      </el-form-item>
      <el-form-item label="确权土地面积：">
        <el-input
          v-model="form.sysWrpRsrHych.cnctar"
          placeholder="请输入确权土地面积"
        >
          <template slot="append">m²</template>
        </el-input>
      </el-form-item>
      <div class="classify">水库迁淹</div>
      <el-form-item label="淹没田地：">
        <el-input
          v-model="form.sysWrpRsrCnbsin.ymtd"
          placeholder="请输入淹没田地"
        >
          <template slot="append">亩</template>
        </el-input>
      </el-form-item>
      <el-form-item label="拆迁房屋：">
        <el-input
          v-model="form.sysWrpRsrCnbsin.cqfw"
          placeholder="请输入拆迁房屋"
        >
          <template slot="append">间</template>
        </el-input>
      </el-form-item>
      <el-form-item label="迁移人口：">
        <el-input
          v-model="form.sysWrpRsrCnbsin.qyrk"
          placeholder="请输入迁移人口"
        >
          <template slot="append">人</template>
        </el-input>
      </el-form-item>
      <div class="classify">下游影响</div>
      <el-form-item label="人口：">
        <el-input v-model="form.sysWrpRsrDsin.inpp" placeholder="请输入人口">
          <!-- <template slot="append">万</template> -->
        </el-input>
      </el-form-item>
      <el-form-item label="耕地：">
        <el-input v-model="form.sysWrpRsrDsin.infl" placeholder="请输入耕地">
          <!-- <template slot="append">万亩</template> -->
        </el-input>
      </el-form-item>
      <el-form-item label="城镇：">
        <el-input v-model="form.sysWrpRsrDsin.intw" placeholder="请输入城镇">
        </el-input>
      </el-form-item>
      <el-form-item label="铁路：">
        <el-input v-model="form.sysWrpRsrDsin.inrw" placeholder="请输入铁路">
        </el-input>
      </el-form-item>
      <el-form-item label="公路：">
        <el-input v-model="form.sysWrpRsrDsin.inrd" placeholder="请输入公路">
          <!-- <template slot="append">万</template> -->
        </el-input>
      </el-form-item>
      <div class="button">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { changeReservoirInfo, addReservoirInfo } from "@/http/api";
export default {
  props: ["id", "detailData"],
  data() {
    return {
      rscd: "",
      form: {
        sysWrpRsrBsin: {
          rscd: "",
          mnun: "",
          cpyr: "",
          bsssin: "",
          vltw: "",
          blsys: "",
          rvcd: "",
          cmun: "",
        },
        sysWrpRsrCnbsin: {
          cmun: "",
          cnun: "",
          rscd: "",
          stdt: "",
          dsun: "",
          gcxt: "",
          firstxushui: "",
          jymj: "",
          cxjddate: "",
          cxjdtz: "",
          ymtd: "",
          cqfw: "",
          qyrk: "",
        },
        sysWrpRsrDsin: {
          rscd: "",
          inpp: "",
          infl: "",
          intw: "",
          inrw: "",
          inrd: "",
        },
        sysWrpRsrHych: {
          rscd: "",
          avanpram: "",
          avanrnam: "",
          avabsdam: "",
          dsrcin: "",
          dspkfl: "",
          chrcin: "",
          chpkfl: "",
          rsrrgtpfm: "",
          ttstcp: "",
          flstcp: "",
          flcnstcp: "",
          acstcp: "",
          ddstcp: "",
          chfllv: "",
          dsfllv: "",
          flcnhgwl: "",
          nrstlv: "",
          mjflsscnwl: "",
          ddwl: "",
          cnctar: "",
          maxrz: "",
        },
      },
      //   form: {
      //     cmun: "",
      //     mnun: "",
      //     stdt: "",
      //     cpyr: "",
      //     dsun: "",
      //     cnun: "",
      //     bsssin: '',
      //     avanpram: "",
      //     avanrnam: "",
      //     avabsdam: "",
      //     dsrcin: "",
      //     dspkfl: "",
      //     chrcin: "",
      //     chpkfl: "",
      //     vltw: "",
      //     blsys: "",
      //     rvcd: "",
      //     rsrrgtpfm: "",
      //     ttstcp: "",
      //     flstcp: "",
      //     flcnstcp: "",
      //     acstcp: "",
      //     ddstcp: "",
      //     chfllv: "",
      //     dsfllv: "",
      //     flcnhgwl: "",
      //     nrstlv: "",
      //     mjflsscnwl: "",
      //     ddwl: "",
      //     cnctar: "",
      //     inpp: "",
      //     infl: "",
      //     intw: "",
      //     inrw: "",
      //     inrd: "",
      //   },
    };
  },
  mounted() {
    if (this.id === null || JSON.stringify(this.detailData) == "{}") {
      this.form.sysWrpRsrBsin.rscd = "";
      this.form.sysWrpRsrBsin.cmun = "";
      this.form.sysWrpRsrCnbsin.cmun = "";
      this.form.sysWrpRsrBsin.mnun = "";
      this.form.sysWrpRsrBsin.cpyr = "";
      this.form.sysWrpRsrCnbsin.cnun = "";
      this.form.sysWrpRsrBsin.bsssin = "";
      this.form.sysWrpRsrBsin.vltw = "";
      this.form.sysWrpRsrBsin.blsys = "";
      this.form.sysWrpRsrBsin.rvcd = "";
      this.form.sysWrpRsrCnbsin.firstxushui = "";
      this.form.sysWrpRsrCnbsin.cxjddate = "";
      this.form.sysWrpRsrCnbsin.cxjdtz = "";
      this.form.sysWrpRsrCnbsin.ymtd = "";
      this.form.sysWrpRsrCnbsin.cqfw = "";
      this.form.sysWrpRsrCnbsin.qyrk = "";
      this.form.sysWrpRsrCnbsin.jymj = "";
      this.form.sysWrpRsrCnbsin.rscd = "";
      this.form.sysWrpRsrCnbsin.stdt = "";
      this.form.sysWrpRsrCnbsin.dsun = "";
      this.form.sysWrpRsrCnbsin.gcxt = "";
      this.form.sysWrpRsrDsin.rscd = "";
      this.form.sysWrpRsrDsin.inpp = "";
      this.form.sysWrpRsrDsin.infl = "";
      this.form.sysWrpRsrDsin.intw = "";
      this.form.sysWrpRsrDsin.inrw = "";
      this.form.sysWrpRsrDsin.inrd = "";
      this.form.sysWrpRsrHych.rscd = "";
      this.form.sysWrpRsrHych.avanpram = "";
      this.form.sysWrpRsrHych.avanrnam = "";
      this.form.sysWrpRsrHych.avabsdam = "";
      this.form.sysWrpRsrHych.dsrcin = "";
      this.form.sysWrpRsrHych.dspkfl = "";
      this.form.sysWrpRsrHych.chrcin = "";
      this.form.sysWrpRsrHych.chpkfl = "";
      this.form.sysWrpRsrHych.rsrrgtpfm = "";
      this.form.sysWrpRsrHych.ttstcp = "";
      this.form.sysWrpRsrHych.flstcp = "";
      this.form.sysWrpRsrHych.flcnstcp = "";
      this.form.sysWrpRsrHych.acstcp = "";
      this.form.sysWrpRsrHych.ddstcp = "";
      this.form.sysWrpRsrHych.chfllv = "";
      this.form.sysWrpRsrHych.dsfllv = "";
      this.form.sysWrpRsrHych.flcnhgwl = "";
      this.form.sysWrpRsrHych.nrstlv = "";
      this.form.sysWrpRsrHych.mjflsscnwl = "";
      this.form.sysWrpRsrHych.ddwl = "";
      this.form.sysWrpRsrHych.cnctar = "";
      this.form.sysWrpRsrHych.maxrz = "";
      this.$refs.form.clearValidate();
    } else {
      this.rscd = this.detailData.sysWrpRsrBsin.rscd;
      this.form.sysWrpRsrBsin.rscd = this.detailData.sysWrpRsrBsin.rscd;
      this.form.sysWrpRsrBsin.cmun = this.detailData.sysWrpRsrBsin.cmun;
      this.form.sysWrpRsrCnbsin.cmun = this.detailData.sysWrpRsrCnbsin.cmun;
      this.form.sysWrpRsrBsin.mnun = this.detailData.sysWrpRsrBsin.mnun;
      this.form.sysWrpRsrBsin.cpyr = this.detailData.sysWrpRsrBsin.cpyr;
      this.form.sysWrpRsrCnbsin.cnun = this.detailData.sysWrpRsrCnbsin.cnun;
      this.form.sysWrpRsrBsin.bsssin = this.detailData.sysWrpRsrBsin.bsssin;
      this.form.sysWrpRsrBsin.vltw = this.detailData.sysWrpRsrBsin.vltw;
      this.form.sysWrpRsrBsin.blsys = this.detailData.sysWrpRsrBsin.blsys;
      this.form.sysWrpRsrBsin.rvcd = this.detailData.sysWrpRsrBsin.rvcd;
      this.form.sysWrpRsrCnbsin.firstxushui =
        this.detailData.sysWrpRsrCnbsin.firstxushui;
      this.form.sysWrpRsrCnbsin.cxjddate =
        this.detailData.sysWrpRsrCnbsin.cxjddate;
      this.form.sysWrpRsrCnbsin.cxjdtz = this.detailData.sysWrpRsrCnbsin.cxjdtz;
      this.form.sysWrpRsrCnbsin.ymtd = this.detailData.sysWrpRsrCnbsin.ymtd;
      this.form.sysWrpRsrCnbsin.cqfw = this.detailData.sysWrpRsrCnbsin.cqfw;
      this.form.sysWrpRsrCnbsin.qyrk = this.detailData.sysWrpRsrCnbsin.qyrk;
      this.form.sysWrpRsrCnbsin.jymj = this.detailData.sysWrpRsrCnbsin.jymj;
      this.form.sysWrpRsrCnbsin.rscd = this.detailData.sysWrpRsrCnbsin.rscd;
      this.form.sysWrpRsrCnbsin.stdt = this.detailData.sysWrpRsrCnbsin.stdt;
      this.form.sysWrpRsrCnbsin.dsun = this.detailData.sysWrpRsrCnbsin.dsun;
      this.form.sysWrpRsrCnbsin.gcxt = this.detailData.sysWrpRsrCnbsin.gcxt;
      this.form.sysWrpRsrDsin.rscd = this.detailData.sysWrpRsrDsin.rscd;
      this.form.sysWrpRsrDsin.inpp = this.detailData.sysWrpRsrDsin.inpp;
      this.form.sysWrpRsrDsin.infl = this.detailData.sysWrpRsrDsin.infl;
      this.form.sysWrpRsrDsin.intw = this.detailData.sysWrpRsrDsin.intw;
      this.form.sysWrpRsrDsin.inrw = this.detailData.sysWrpRsrDsin.inrw;
      this.form.sysWrpRsrDsin.inrd = this.detailData.sysWrpRsrDsin.inrd;
      this.form.sysWrpRsrHych.rscd = this.detailData.sysWrpRsrHych.rscd;
      this.form.sysWrpRsrHych.avanpram = this.detailData.sysWrpRsrHych.avanpram;
      this.form.sysWrpRsrHych.avanrnam = this.detailData.sysWrpRsrHych.avanrnam;
      this.form.sysWrpRsrHych.avabsdam = this.detailData.sysWrpRsrHych.avabsdam;
      this.form.sysWrpRsrHych.dsrcin = this.detailData.sysWrpRsrHych.dsrcin;
      this.form.sysWrpRsrHych.dspkfl = this.detailData.sysWrpRsrHych.dspkfl;
      this.form.sysWrpRsrHych.chrcin = this.detailData.sysWrpRsrHych.chrcin;
      this.form.sysWrpRsrHych.chpkfl = this.detailData.sysWrpRsrHych.chpkfl;
      this.form.sysWrpRsrHych.rsrrgtpfm =
        this.detailData.sysWrpRsrHych.rsrrgtpfm;
      this.form.sysWrpRsrHych.ttstcp = this.detailData.sysWrpRsrHych.ttstcp;
      this.form.sysWrpRsrHych.flstcp = this.detailData.sysWrpRsrHych.flstcp;
      this.form.sysWrpRsrHych.flcnstcp = this.detailData.sysWrpRsrHych.flcnstcp;
      this.form.sysWrpRsrHych.acstcp = this.detailData.sysWrpRsrHych.acstcp;
      this.form.sysWrpRsrHych.ddstcp = this.detailData.sysWrpRsrHych.ddstcp;
      this.form.sysWrpRsrHych.chfllv = this.detailData.sysWrpRsrHych.chfllv;
      this.form.sysWrpRsrHych.dsfllv = this.detailData.sysWrpRsrHych.dsfllv;
      this.form.sysWrpRsrHych.flcnhgwl = this.detailData.sysWrpRsrHych.flcnhgwl;
      this.form.sysWrpRsrHych.nrstlv = this.detailData.sysWrpRsrHych.nrstlv;
      this.form.sysWrpRsrHych.mjflsscnwl =
        this.detailData.sysWrpRsrHych.mjflsscnwl;
      this.form.sysWrpRsrHych.ddwl = this.detailData.sysWrpRsrHych.ddwl;
      this.form.sysWrpRsrHych.cnctar = this.detailData.sysWrpRsrHych.cnctar;
      this.form.sysWrpRsrHych.maxrz = this.detailData.sysWrpRsrHych.maxrz;
    }
  },
  methods: {
    submit() {
      if (this.form.sysWrpRsrBsin.bsssin >= 10) {
        this.$message.info("设计地震烈度不能大于9");
        return;
      }
      let that = this;
      this.form.sysWrpRsrBsin.rscd = this.rscd;
      this.form.sysWrpRsrCnbsin.rscd = this.rscd;
      this.form.sysWrpRsrDsin.rscd = this.rscd;
      this.form.sysWrpRsrHych.rscd = this.rscd;
      if (that.id === null) {
        this.form.sysWrpRsrCnbsin.cntp = " ";
        addReservoirInfo(this.form)
          .then(function (r) {
            if (r.data.code == 200) {
              that.$message.success("新增成功");
              setTimeout(() => {
                that.goBack();
              }, 1000);
            } else {
              that.$message.error(r.data.msg);
            }
          })
          .catch((err) => {
            that.$message.error("请联系管理人员");
          });
      } else {
        changeReservoirInfo(this.form)
          .then(function (r) {
            if (r.data.code == 200) {
              that.$message.success("修改成功");
              setTimeout(() => {
                that.goBack();
              }, 1000);
            } else {
              that.$message.error(r.data.msg);
            }
          })
          .catch((err) => {
            that.$message.error("请联系管理人员");
          });
      }
    },
    goBack() {
      this.$emit("goBack", true);
    },
    cancel() {
      this.$emit("goBack");
    },
  },
};
</script>
<style lang="scss" scoped>
.reservoirIndex {
  display: flex;
  flex-direction: column;
  height: calc(100% + 20px);
  width: calc(100% + 40px);
  margin-left: -20px;
  @include styles("background-color", "blockBg");
  .el-page-header {
    padding: 0 20px 20px;
  }
  .form {
    overflow: auto;
    padding: 10px 30px 30px 50px;
    box-sizing: border-box;
    .classify {
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: 600;
      @include styles("color", "titleTextColor");
    }
    /deep/ .el-input-group__append {
      text-align: center;
      width: 33px;
    }
    .button {
      text-align: center;
      margin-top: 30px;
    }
  }
}
</style>