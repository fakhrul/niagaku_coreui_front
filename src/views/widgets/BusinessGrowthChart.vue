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
    name: 'BusinessGrowthChart',
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
          },
          scales: {
            x: {
              grid: {
                drawOnChartArea: false
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'Rp' + value.toLocaleString('id-ID');
                }
              }
            }
          }
        }
      }
    }
  }
  </script>