<template>
  <button @click="isRangePicker = !isRangePicker">{{ isRangePicker ? 'Range Picker' : 'Date Picker' }}</button>
  <input type="text" id="drp-input-start" readonly @click="openPicker = !openPicker"
    :value="selectedDates.start?.toDateString()" />
  <input type="text" id="drp-input-end" readonly @click="openPicker = !openPicker"
    :value="selectedDates.end?.toDateString()" />
  <DRP :isRangePicker="isRangePicker" :openPicker="openPicker" @closePicker="openPicker = false"
    @selectedDates="showDates" />
</template>

<script>
import DRP from './components/drp/DRP.vue'

export default {
  name: 'App',
  components: {
    DRP
  },
  data() {
    return {
      openPicker: false,
      isRangePicker: true,
      selectedDates: { start: null, end: null },
    }
  },
  methods: {
    showDates(dates) {
      this.selectedDates.start = dates.start;
      this.selectedDates.end = dates.end;
    },
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 10px;
  padding: 10px;
  background: #f9f9f9;
}
</style>
