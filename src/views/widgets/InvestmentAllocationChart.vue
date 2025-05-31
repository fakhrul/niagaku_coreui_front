<template>
    <CChartDoughnut
      :datasets="chartData.datasets"
      :labels="chartData.labels"
      :options="chartOptions"
    />
  </template>
  
  <script>
  import { CChartDoughnut } from '@coreui/vue-chartjs'
  
  export default {
    name: 'InvestmentAllocationChart',
    components: { CChartDoughnut },
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
              display: false
            }
          },
          cutout: '70%'
        }
      }
    }
  }
  </script>