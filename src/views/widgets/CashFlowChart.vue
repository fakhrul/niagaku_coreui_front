<template>
    <CChartLine
      :datasets="chartData.datasets"
      :labels="chartData.labels"
      :options="chartOptions"
    />
  </template>
  
  <script>
  import { CChartLine } from '@coreui/vue-chartjs'
  
  export default {
    name: 'CashFlowChart',
    components: { CChartLine },
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