<template>
  <v-dialog v-model="Popen" width="290">
    <v-card>
      <v-date-picker
        v-model="Pdate"
        full-width
        :day-format="v=>parseInt(v.split('-')[2]).toString()"
      ></v-date-picker>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color text @click="close()">取消</v-btn>
        <v-btn color="primary" text @click="set(true)">所有日期</v-btn>
        <v-btn color="primary" text @click="set()">选定日期</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  model: {
    prop: "date",
    event: "change",
  },
  props: {
    date: String,
    open: Boolean,
  },
  watch: {
    open(v) {
      if (v) {
        if (
          !((this as DataTable).date == "all" || (this as DataTable).date == "")
        ) {
          (this as DataTable).Pdate = `${(this as DataTable).date.slice(
            0,
            4
          )}-${(this as DataTable).date.slice(
            4,
            6
          )}-${(this as DataTable).date.slice(6, 8)}`;
        } else {
          const t = new Date();
          (this as DataTable).Pdate = `${t.getFullYear()}-${
            t.getMonth() + 1 < 10 ? "0" + (t.getMonth() + 1) : t.getMonth()
          }-${t.getDate()}`;
        }
      }
    },
  },
})
export default class DataTable extends Vue {
  open!: boolean;
  date!: string;
  get Popen() {
    return this.open;
  }
  set Popen(v) {
    this.$emit("update:open", v);
  }
  Pdate = "";
  close() {
    this.Popen = false;
  }
  set(all = false) {
    if (all) {
      this.$emit("change", "all");
    } else {
      this.$emit("change", this.Pdate.replace(/-/g, ""));
    }
    this.close();
  }
}
</script>