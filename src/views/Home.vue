<template>
  <v-container>
    <v-col cols="12">
      <CurrentBossInfo :bossinfo="bossinfo" />
    </v-col>
    <v-col color="#1F7087" cols="12">
      <DataTable
        v-model="tableSelected"
        :originData="tableData"
        :loading="loadtable"
        :date="date"
        @datedialog="datedialog=true"
      />
    </v-col>
    <DatePicker v-model="date" :open.sync="datedialog" />
    <v-snackbar color="error" v-model="snackbarOpen">{{errMsg}}</v-snackbar>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CurrentBossInfo, { BossInfo } from "../components/Home/CurrentBossInfo.vue";
import DataTable, { ApiTable } from "../components/Home/DataTable.vue";
import DatePicker from "../components/Home/DatePicker.vue";
@Component({
  components: {
    CurrentBossInfo,
    DataTable,
    DatePicker,
  },
  watch:{
    date(){
      (this as Home).apiQueryDamageAsMember()
    }
  }
})
export default class Home extends Vue {
  tableSelected = [];
  errMsg = null as null | string;
  loadtable = true;
  date = "";
  datedialog = false;
  tableData = Array<ApiTable>();
  bossinfo = {
    stage: 1,
    step: 1,
    fullHP: 0,
    hp: 0,
  } as BossInfo;
  get snackbarOpen() {
    return this.errMsg != null;
  }
  set snackbarOpen(v) {
    if (!v) {
      this.errMsg = null;
    }
  }
  apiCurrentBossInfo() {
    this.$axios
      .get("/currentBossInfo", {
        params: {
          gid: this.$store.state.select.gid,
          period: this.$store.state.period,
          token: localStorage.getItem("session"),
        },
      })
      .then(
        (resp) => {
          this.bossinfo = resp.data;
          this.loadtable = false;
        },
        (error) => {
          this.errorH(error);
        }
      );
  }
  apiQueryDamageAsMember() {
    this.loadtable = true
    this.$axios
      .get("/queryDamageAsMember", {
        params: {
          gid: this.$store.state.select.gid,
          period: this.$store.state.period,
          date: this.date,
          token: localStorage.getItem("session"),
        },
      })
      .then(
        (resp) => {
          this.tableData = resp.data.list;
          this.loadtable = false;
        },
        (error) => {
          this.errorH(error);
        }
      );
  }
  // eslint-disable-next-line
  errorH(error: any) {
    this.loadtable = false
    if (error.response != undefined) {
      if (error.response.status != undefined) {
        if (error.response.status == 401) {
          localStorage.removeItem("session");
          this.$router.push({ name: "Login" });
        } else {
          this.errMsg =
            error.response.data.errMsg != undefined
              ? error.response.data.errMsg
              : "API 返回了未知错误";
        }
      } else {
        this.errMsg = "访问 API 发生错误";
      }
    } else {
      this.errMsg = "访问 API 发生错误";
    }
  }
  mounted() {
    if (this.$store.state.nickName == "") {
      this.$router.push({ name: "Login" });
    } else {
      this.apiCurrentBossInfo();
    }
  }
}
</script>