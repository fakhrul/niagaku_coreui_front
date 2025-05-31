<template>
    <CChartBar
      :datasets="chartData.datasets"
      :labels="chartData.labels"
      :options="chartOptions"
    />
  </template>
  
  <script>
  import { CChartBar } from '@coreui/vue-chartjs'
  
  export default {
    name: 'ProfitLossChart',
    components: { CChartBar },
    props: {
      chartData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        chartOptions: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      }
    }
  }
  </script>