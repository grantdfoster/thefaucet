<template>
  <div class="PageContainer">
    <svg id="svg"></svg>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed, useStore, ref } from '@nuxtjs/composition-api'
import * as d3 from 'd3'

const store = useStore()

const radius = ref(10)
const colorDefault = ref('#cce8ff')
const colorHovered = ref('#a8d8ff')
const availableDrips = ref(100)

const availableDripsData = computed(() => {
  const _array = Array.from(Array(availableDrips.value).keys())
  return _array.map((_n, _i) => {
    return { id: _i + 1, value: _i + 1 }
  })
})

const createVisualization = () => {
  const viz = d3.forceSimulation(availableDripsData.value, (d) => d.id).on('tick', ticked)
  viz
    .force(
      'collide',
      d3.forceCollide().radius(() => radius.value + radius.value / 2)
    )
    .force(
      'x',
      d3.forceX(() => window.innerWidth / 2)
    )
    .force(
      'y',
      d3.forceY(() => window.innerHeight / 2)
    )
}

const ticked = () => {
  const _svg = document.getElementById('svg')
  const container = d3
    .select(_svg)
    .selectAll('.drip')
    .data(availableDripsData.value, (d) => d.id)

  container
    .enter()
    .append('circle')
    .attr('class', 'drip')
    .merge(container)
    .style('cursor', 'pointer')
    .style('stroke', 'gray')
    .style('stroke-width', '1px')
    .attr('r', () => radius.value)
    .attr('cx', (drip) => drip.x)
    .attr('cy', (drip) => drip.y)
    .attr('fill', () => colorDefault.value)
    .on('mouseover', (event) => {
      d3.select(event.currentTarget)
        .attr('r', radius.value + radius.value / 2)
        .style('fill', colorHovered.value)
    })
    .on('mouseout', (event) => {
      d3.select(event.currentTarget).attr('r', radius.value).style('fill', colorDefault.value)
    })

  container.exit().remove()
}

const provider = computed(() => {
  return store.getters['metamask/provider']
})

const resizeHandler = () => {
  // _viz.value.force.size([window.innerWidth, window.innerHeight]).resume()
}

onMounted(async () => {
  const addresses = await provider.value.listAccounts()
  if (addresses.length) store.dispatch('metamask/connectWallet')
  window.addEventListener('resize', resizeHandler)
  resizeHandler()
  createVisualization()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandler)
})
</script>
<style lang="scss" scoped>
.faucet {
  position: absolute;
  left: 50vw;
  top: 0rem;
  transform: translateX(-50%) scale(1.5);
}
#svg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
}
</style>
