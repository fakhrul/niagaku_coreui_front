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
    name: 'InvoiceStatusChart',
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
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          cutout: '70%'
        }
      }
    }
  }
  </script>
  