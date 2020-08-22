<template>
  <v-card>
    <v-card-title>
      伤害详情
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        text
        style="margin: 16px 4px 0 4px;letter-spacing: normal;"
        :disabled="tableData.length ==0"
        @click="export2CSV()"
      >
        <v-icon left>mdi-download</v-icon>导出为 CSV
      </v-btn>
      <v-btn
        color="primary"
        text
        style="margin: 16px 4px 0 4px;letter-spacing: normal;"
        :disabled="loading"
        @click="$emit('datedialog')"
      >
        <v-icon left>mdi-calendar</v-icon>
        {{dateText}}
      </v-btn>

      <v-text-field v-model="search" append-icon="mdi-magnify" label="搜索" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table
      v-model="PtableSelected"
      :headers="headers"
      :items="tableData"
      single-select
      item-key="id"
      show-select
      sort-desc
      :search="search"
      :loading="loading"
      loading-text="载入中"
      locale="zh-Hans"
    ></v-data-table>
    <v-dialog v-model="export2CSVDiglog" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          导出中……
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  model: {
    prop: "tableSelected",
    event: "select",
  },
  props: {
    originData: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    tableSelected: Array,
  },
})
export default class DataTable extends Vue {
  tableSelected!: [];
  search = "";
  date!: string;
  export2CSVDiglog = false;
  get PtableSelected() {
    return this.tableSelected;
  }
  set PtableSelected(value) {
    this.$emit("select", value);
  }
  get dateText() {
    switch (this.date) {
      case "":
        return "未设置";
      case "all":
        return "所有时间";
      default:
        return `${this.date.slice(0, 4)}年${parseInt(
          this.date.slice(4, 6)
        ).toString()}月${this.date.slice(6, 8)}日`;
    }
  }
  headers = [
    {
      text: "报告时间",
      value: "time",
    },
    { text: "昵称", value: "nickName" },
    { text: "周目", value: "stage", filterable: false },
    { text: "位置", value: "step", filterable: false },
    { text: "造成伤害", sortable: true, value: "damage" },
    { text: "击败", value: "kill" },
  ];
  originData!: Array<ApiTable>;
  get tableData() {
    return this.originData.map((item) => {
      const t = new Date(item.time);
      return {
        id: item.id,
        time: `${t.getFullYear()}年${t.getMonth()}月${t.getDate()}日 ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`,
        member: item.member,
        nickName: item.nickName,
        stage: item.stage,
        step: item.step,
        damage: item.damage.toLocaleString(),
        kill: item.kill ? "击败" : "",
      };
    });
  }
  get skeletonLoader() {
    return this.originData == null;
  }
  export2CSV() {
    if (this.tableData.length == 0) {
      return;
    }
    let csv = "";
    for (const h of this.headers) {
      csv += h.text + ",";
    }
    csv += "\n";
    for (const i of this.tableData) {
      for (const h of this.headers) {
        // eslint-disable-next-line
        if ((i as any)[h.value] != undefined) {
          // eslint-disable-next-line
          csv += (i as any)[h.value];
        }
        csv += ",";
      }
      csv += "\n";
    }
    const csvBlob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], {
      type: "text/csv",
    });
    const blobLink = URL.createObjectURL(csvBlob);
    const link = document.createElement("a");
    link.href = blobLink;
    const d = new Date();
    let dtext = "";
    dtext += d.getFullYear().toString();
    dtext += d.getMonth().toString();
    dtext += d.getDate().toString();
    dtext += d.getHours().toString();
    dtext += d.getMinutes().toString();
    dtext += d.getSeconds().toString();
    link.download = `会战${this.$store.state.period}期${
      this.$store.state.select.name
    }报刀数据${
      this.dateText == "所有时间" ? "" : "(" + this.dateText + ")"
    }_${dtext}.csv`;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(blobLink);
    document.removeChild(link);
  }
}
export interface Table {
  id: number;
  time: string;
  member: number;
  nickName: string;
  stage: number;
  step: number;
  damage: number;
  kill: string;
}
export interface ApiTable {
  id: number;
  time: number;
  member: number;
  nickName: string;
  stage: number;
  step: number;
  damage: number;
  kill: boolean;
}
</script>