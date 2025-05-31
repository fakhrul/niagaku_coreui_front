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
    name: 'InvoiceTrendChart',
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
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(context.parsed.y);
                  }
                  return label;
                }
              }
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
  