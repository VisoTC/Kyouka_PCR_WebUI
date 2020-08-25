<template>
  <v-dialog v-model="Popen" persistent max-width="500">
    <v-card>
      <v-card-title class="headline">选择</v-card-title>
      <v-divider></v-divider>

      <v-card-subtitle
        style="padding: 20px 24px; "
      >{{$store.state.nickName}}，你已登录到 PCR Plugin WebUI, 请选择你要访问的内容</v-card-subtitle>

      <v-card-text>
        <v-select
          :items="periods"
          label="期数"
          outlined
          style="margin-right: 16px; width:200px;display: inline-block;"
          v-model="period"
          :error-messages="periodErrMsg"
        ></v-select>
      </v-card-text>
      <v-list  shaped :disabled="$store.state.groups.length == 0" style="padding: 0 8px 20px;">
        <v-subheader>群</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item v-if="$store.state.groups.length == 0">
            <v-list-item-content>
              <v-list-item-title>暂无数据</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="(item, i) in $store.state.groups"
            :key="i"
            @click="select(item)"
            v-else
          >
            <v-list-item-icon> 
              <v-icon>{{item.isAdmin?"mdi-account-tie":'mdi-account'}}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
})
export default class Home extends Vue {
  selectGruop: { name: string; gid: number } | null = null;
  period = "202008";
  periods = ["202008"];
  periodErrMsg = ''
  open!: boolean;
  get Popen() {
    return this.open;
  }
  set Popen(v) {
    this.$emit("update:open", v);
  }
  select(item: { name: string; gid: number }) {
    if (this.periods.indexOf(this.period) < 0) {
      this.periodErrMsg="请选择期数"
      return
    }
    this.$store.commit("current", {
      period: this.period,
      select: item,
    });
    this.$emit("selected");
  }
}
</script>

<style>
</style>