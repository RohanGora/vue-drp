<template>
  <div class="drp-overlay" :class="{ show: isPickerOpen }" @click="closeRangePicker(true)"></div>
  <div class="drp-popup" :class="{ show: isPickerOpen }">
    <div class="drp-navigation">
      <button class="drp-prev" @click="previousMonths()">&lt;</button>
      <button class="drp-next" @click="nextMonths()">&gt;</button>
    </div>
    <div class="drp-close-button" @click="closeRangePicker(false)">&cross;</div>
    <div class="drp-container" :id="'drp-container-' + componentId"></div>
    <div class="drp-mobile-footer">
      <div class="drp-mobile-range">{{ selectedDatesRange.start?.toDateString() }}</div>
      <div class="drp-mobile-range">{{ selectedDatesRange.end?.toDateString() }}</div>
      <button class="drp-apply-button" @click="closeRangePicker(false)">
        Select
      </button>
    </div>
  </div>
</template>

<script src="./DRP.js"></script>
<style src="./DRP.css"></style>