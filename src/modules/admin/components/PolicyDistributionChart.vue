<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { computed } from 'vue'
import { useColorMode } from '@/composables/useColorMode'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  data: {
    type: string
    count: number
  }[]
}>()

const { colorMode } = useColorMode()

const chartData = computed(() => ({
  labels: props.data.map(item => item.type),
  datasets: [
    {
      data: props.data.map(item => item.count),
      backgroundColor: [
        'rgba(60, 122, 137, 0.8)',   // Azul
        'rgba(16, 185, 129, 0.8)',   // Verde
        'rgba(139, 92, 246, 0.8)',   // Morado
        'rgba(245, 158, 11, 0.8)',   // Amarillo
        'rgba(239, 68, 68, 0.8)'     // Rojo
      ],
      borderColor: [
        'rgba(60, 122, 137, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 1
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: colorMode.value === 'dark' ? '#e5e7eb' : '#374151',
        font: {
          size: 12,
          family: "'Inter', sans-serif"
        },
        padding: 16
      }
    },
    tooltip: {
      backgroundColor: colorMode.value === 'dark' ? '#1f2937' : '#ffffff',
      titleColor: colorMode.value === 'dark' ? '#e5e7eb' : '#374151',
      bodyColor: colorMode.value === 'dark' ? '#e5e7eb' : '#374151',
      borderColor: colorMode.value === 'dark' ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      padding: 12,
      bodyFont: {
        family: "'Inter', sans-serif"
      },
      titleFont: {
        family: "'Inter', sans-serif",
        weight: 600 // Cambiado de '600' a 600 para cumplir con el tipo
      }
    }
  }
}))
</script>

<template>
  <div class="h-[300px]">
    <Doughnut
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>
