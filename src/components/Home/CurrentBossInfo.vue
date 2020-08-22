<template>
  <v-card color="#385F73" dark>
    <v-skeleton-loader v-if="loading" type="heading" style="padding: 16px 16px 16px 16px;"></v-skeleton-loader>
    <v-card-title v-else class="headline">当前 BOSS 信息</v-card-title>
    <v-skeleton-loader v-if="loading" type="text" style="padding: 16px 16px 16px 16px;"></v-skeleton-loader>
    <v-card-text v-else>当前阶段：第{{bossinfo.stage}}周目{{bossinfo.step}}王</v-card-text>
    <v-progress-linear
      :indeterminate="loading"
      :value="bossinfo.hp/bossinfo.fullHP*100"
      color="white"
    ></v-progress-linear>
    <v-skeleton-loader v-if="loading" type="text" style="padding: 16px 16px 16px 16px;"></v-skeleton-loader>
    <v-card-text v-else>血量：{{bossinfo.hp.toLocaleString()}}/{{bossinfo.fullHP.toLocaleString()}}</v-card-text>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  props: {
    bossinfo: {
      type: Object,
      required: true,
    }
  },
})
export default class CurrentBossInfo extends Vue {
  bossinfo!: BossInfo;
  get loading() {
    return this.bossinfo.fullHP == 0;
  }
}

export interface BossInfo {
  stage: number;
  step: number;
  fullHP: number;
  hp: number;
}
</script>