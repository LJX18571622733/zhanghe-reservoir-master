<template>
  <div>
    <el-card class="box-card el-card">
      <el-form label-width="70px" class="demo-form-inline" :model="loginModal">
        <div class="logo">
          <img src="/img/loginlogo.png" />
        </div>

        <el-form-item label="用户">
          <el-input
            placeholder="请输入用户测"
            v-model="loginModal.userCode"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            placeholder="请输入密码"
            type="password"
            v-model="loginModal.userPwd"
            @keyup.enter="loginClick"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <div class="identify">
            <el-input
              placeholder="请输入验证码"
              v-model="loginModal.identify"
              @keyup.enter="loginClick"
            ></el-input>
            <div style="border: none" @click="refreshCode">
              <identify :identifyCode="identifyCode"></identify>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            style="width: 100%"
            type="primary"
            @click="loginClick"
            @keyup.enter="loginClick"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <img src="/img/bg.jpg" class="bg" alt="" />
    <!-- <video id="loginVideo" class="loginvideo" autoplay loop muted>
      <source src="/video/skzb.mp4" type="video/mp4" />
    </video> -->
    <!--
    <el-carousel
      height="100%"
      style="width:100%;height:100%;"
      direction="vertical"
    >
      <el-carousel-item
        v-for="(item,index) in imglist"
        :key="index"
      >
        <img
          :src="item.url"
          style="height:100%;width:100%;"
        />
      </el-carousel-item>
    </el-carousel>-->
    <Footer></Footer>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { encryptDes } from "@/des";
import Footer from "@/views/map/Footer";
import identify from "@/views/map/identify";
import { stcd } from "@/config/config";
export default {
  data() {
    const validateCode = (rule, value, callback) => {
      if (this.identifyCode !== value) {
        this.loginForm.code = "";
        this.refreshCode();
        callback(new Error("请输入正确的验证码"));
      } else {
        callback();
      }
    };
    return {
      loginModal: {
        userCode: null,
        password: null,
        userPwd: null,
        identify: "",
        // userCode: 'msskadmin', password: 'mssk@2021', userPwd: 'mssk@2021'
      },
      identifyCode: "", //找回密码图形验证码
      identifyCodes: "1234567890",
      imglist: [
        { url: "./mssg/01.jpg" },
        { url: "./mssg/02.jpg" },
        { url: "./mssg/03.jpg" },
        { url: "./mssg/04.jpg" },
        { url: "./mssg/05.jpg" },
        { url: "./mssg/06.jpg" },
        { url: "./mssg/07.jpg" },
        { url: "./mssg/08.jpg" },
      ],
    };
  },

  components: {
    Footer,
    identify,
  },
  created() {
    // 默认设置为亮色主题
    if (!this.sysTheme) {
      this["menu/setTheme"]("light");
    }
    this.refreshCode();
  },
  watch: {
    identifyCode(v) {
      this.isDebugLogin && (this.loginForm.code = v);
    },
  },
  methods: {
    ...mapActions([
      "sys/login",
      "sys/setUserInfo",
      "menu/setActiveMenu",
      "menu/setTheme",
    ]),
    loginClick() {
      if (this.loginModal.userCode == "" || this.loginModal.userCode == null) {
        this.$message.warning("请输入用户名");
        return;
      }
      if (this.loginModal.userPwd == "" || this.loginModal.userPwd == null) {
        this.$message.warning("请输入密码");
        return;
      }
      if (this.loginModal.identify == "" || this.loginModal.identify == null) {
        this.$message.warning("请输入验证码");
        return;
      }
      if (this.identifyCode !== this.loginModal.identify) {
        this.$message.warning("验证码不一致,请重新输入");
        return;
      }
      var that = this;
      that.loginModal.password = encryptDes("mssk@2021", stcd.aesKey);
      let userCode = encryptDes(that.loginModal.userCode, stcd.aesKey);
      let params = {
        userCode,
        password: that.loginModal.password,
      };
      that["sys/login"](params).then(function (r) {
        if (r.data.code == "200") {
          that["sys/setUserInfo"](r.data);
          // localStorage.setItem("accessToken","token")
          that.$router.push("/map");
          that["menu/setActiveMenu"]("/map");
          // that.$router.push("/reservoirPlatform");
        } else {
          that.$message({
            message: r.data.msg,
            type: "warning",
          });
        }
      });
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode +=
          this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
      }
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
  },
};
</script>
<style lang="scss" scoped>
.box-card {
  position: absolute;
  z-index: 9;
  top: calc(50% - 180px);
  left: calc(50% - 225px);
  width: 450px;
  height: 360px;
  .identify {
    display: flex;
    .s-canvas {
      margin-left: 20px;
    }
  }
}
.el-card,
.box-card {
  background-color: rgba(255, 255, 255, 0.5);
}
.loginvideo {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
.logo {
  width: 100%;
  text-align: center;
  margin-bottom: 15px;
}
.bg {
  width: 100%;
  height: 100%;
}
</style>
