<template>
  <v-container>
    <div style="height: 80px"></div>
    <v-card class="mx-auto" max-width="344" outlined>
      <v-skeleton-loader max-width="344" type="list-item-two-line" :loading="code == null">
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1">登录</v-list-item-title>
            <v-divider></v-divider>
            <v-list-item-subtitle>请向 Bot 通过私聊发送以下内容进行登录</v-list-item-subtitle>
            <v-alert type="success" v-if="islogin">已授权</v-alert>
            <div class="logincode" v-else>/pcr login {{code}}</div>
          </v-list-item-content>
        </v-list-item>
        <v-progress-linear :indeterminate="progress" v-show="progress"></v-progress-linear>
      </v-skeleton-loader>
    </v-card>

    <v-dialog v-model="dialog" width="200">
      <v-card>
        <v-card-title class="headline lighten-2">错误</v-card-title>

        <v-card-text>{{dialogMsg}}</v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogClose">重试</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <SelectGruop :open.sync="islogin" @selected="selected" />
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SelectGruop from "../components/login/SelectGruop.vue";
@Component({
  components: {
    SelectGruop,
  },
})
export default class Home extends Vue {
  code: string | null = null;
  get progress() {
    return !this.islogin;
  }
  set progress(v) {
    this.islogin = !v;
  }
  dialog = false;
  dialogMsg = "登录代码已经过期，需要重新获得登录代码";
  timer = -1;
  islogin = false;
  mounted() {
    this.checkSession();
  }
  dialogClose() {
    this.dialog = false;
    location.reload();
  }
  getCode() {
    this.code = null;
    this.$axios.get("/loginCode").then(
      (resp) => {
        if (resp.data.errcode != undefined || resp.data.errcode != 0) {
          this.code = resp.data.code;
          localStorage.setItem("session", resp.data.token);
          this.checkCode();
        } else {
          this.dialogMsg =
            resp.data.errMsg != undefined ? resp.data.errMsg : "API发生错误";
          this.dialog = true;
        }
      },
      () => {
        this.dialogMsg = "API发生错误";
        this.dialog = true;
      }
    );
  }
  checkCode() {
    this.$axios.get(`/login/${this.code}`).then(
      (resp) => {
        if (resp.data.errcode != undefined || resp.data.errcode != 0) {
          switch (resp.data.state) {
            case "WAITTING":
              setTimeout(this.checkCode, 1000);
              break;
            case "EXPIRED":
              this.dialog = true;
              break;
            case "LOGIN":
              this.loginSuccess(resp.data.info);
              break;
            default:
              break;
          }
        } else {
          this.dialogMsg =
            resp.data.errMsg != undefined
              ? resp.data.errMsg
              : "API 返回了未知错误";
          this.dialog = true;
        }
      },
      () => {
        this.dialogMsg = "访问 API 发生错误";
        this.dialog = true;
      }
    );
  }
  checkSession() {
    if (localStorage.getItem("session") == null) {
      return this.getCode();
    }
    this.$axios
      .get(`/info`, {
        params: {
          token: localStorage.getItem("session"),
        },
      })
      .then(
        (resp) => {
          if (resp.data.errcode != undefined || resp.data.errcode != 0) {
            this.code = "IS LOGIN";
            this.loginSuccess(resp.data);
          } else {
            this.dialogMsg =
              resp.data.errMsg != undefined
                ? resp.data.errMsg
                : "API 返回了未知错误";
            this.dialog = true;
          }
        },
        (error) => {
          if (error.response != undefined) {
            if (error.response.status == 401) {
              localStorage.removeItem("session");
              this.getCode();
            } else {
              this.dialogMsg =
                error.response.data.errMsg != undefined
                  ? error.response.data.errMsg
                  : "API 返回了未知错误";
              this.dialog = true;
            }
          } else {
            this.dialogMsg = "访问 API 发生错误";
            this.dialog = true;
          }
        }
      );
  }
  loginSuccess(data: object) {
    this.$store.commit("loadInfo", data);
    this.islogin = true;
  }
  selected() {
    this.$router.push({ name: "Home" });
  }
}
</script>
<style>
.logincode {
  background-color: #80808054;
  padding: 16px;
  height: 56px;
  line-height: 24px !important;
  border-radius: 4px;
  margin-bottom: 16px;
}
</style>