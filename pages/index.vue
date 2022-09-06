<template>
  <div class="PageContainer">
    <p class="deposits">Deposits: {{ deposits }}</p>
    <p class="available">Availabe: {{ available }}</p>
    <svg id="svg"></svg>
  </div>
</template>

<script setup>
import { onMounted, computed, useStore, ref } from '@nuxtjs/composition-api'
import * as d3 from 'd3'

const store = useStore()

const colorDefault = ref('#cce8ff')

const visualization = ref(null)
const simulation = ref(null)

const radius = ref(30)
const bigRadius = ref(75)
const available = ref(10)
const deposits = ref(100)

const initVisualization = () => {
  const svg = d3.select(document.getElementById('svg'))
  svg.on('touchmove', (e) => e.preventDefault()).on('pointermove', pointed)

  simulation.value = d3
    .forceSimulation()
    .alphaTarget(0.3)
    .velocityDecay(0.4)
    .force('x', d3.forceX(window.innerWidth / 2).strength(0.02))
    .force('y', d3.forceY(window.innerHeight).strength(0.1))
    .force('collide', d3.forceCollide((d, i) => (i === 0 ? bigRadius.value : radius.value)).strength(1))
    .force(
      'charge',
      d3.forceManyBody().strength((d, i) => (i ? 0 : -100))
    )
    .on('tick', ticked)

  let node = svg.append('g').selectAll('circle')

  function pointed(event) {
    simulation.value.nodes()[0].x = event.clientX - radius.value
    simulation.value.nodes()[0].y = event.clientY - radius.value
  }

  function ticked() {
    node
      .style('cursor', 'pointer')
      .style('stroke', 'gray')
      .style('stroke-width', '1px')
      .attr('r', (d, i) => (i === 0 ? bigRadius.value : radius.value))
      .attr('cx', (d, i) => (d.x = Math.max(radius.value, Math.min(window.innerWidth - radius.value, d.x))))
      .attr('cy', (d, i) => (d.y = Math.max(radius.value, Math.min(window.innerHeight - radius.value, d.y))))
      .attr('fill', (d, i) => colorDefault.value)
  }

  visualization.value = Object.assign(svg.node(), {
    update(nodes) {
      // Make a shallow copy to protect against mutation, while
      // recycling old nodes to preserve position and velocity.
      const old = new Map(node.data().map((d) => [d.id, d]))
      nodes = nodes.map((d) => Object.assign(old.get(d.id) || {}, d))

      simulation.value.nodes(nodes)
      simulation.value.alpha(1).restart()

      node = node.data(nodes, (d) => d.id).join((enter) => enter.append('circle'))
    },
  })
}

const provider = computed(() => {
  return store.getters['metamask/provider']
})

const startFakeEarnings = () => {
  setInterval(() => {
    available.value++
    visualization.value.update(availableArray.value)
  }, 5000)
}

const login = async () => {
  const addresses = await provider.value.listAccounts()
  if (addresses.length) await store.dispatch('metamask/connectWallet')
}

const availableArray = computed(() => {
  const _array = Array.from(Array(Math.floor(available.value)).keys())
  const _data = _array.map((_n, _i) => {
    return { id: _i + 1 }
  })
  return _data
})

const resizeHandler = () => {
  simulation.value.force('x', d3.forceX(window.innerWidth / 2).strength(0.02))
  simulation.value.force('y', d3.forceY(window.innerHeight).strength(0.1))
}

onMounted(async () => {
  await login()
  initVisualization()

  visualization.value.update(availableArray.value)

  startFakeEarnings()

  window.addEventListener('resize', resizeHandler)
})
</script>
<style lang="scss" scoped>
.PageContainer {
  @extend .max-width-wrapper;
}
#svg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
}
.deposits {
  // position: absolute;
  // top: 5rem;
  // left: 50vw;
  // transform: translateX(-50%);
}

// container
//   .enter()
//   .append('circle')
//   .merge(container)

// container.transition().duration(500)
</style>
