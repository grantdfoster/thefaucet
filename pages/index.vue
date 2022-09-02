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

const visualization = ref(null)
const simulation = ref(null)

const available = ref(10)
const deposits = ref(1000)

const colorDefault = ref('#cce8ff')
const padding = ref(2)
const radius = ref(20)
const bigRadius = ref(80)

const initVisualization = () => {
  const svg = d3.select(document.getElementById('svg')).on('pointermove', pointed)

  simulation.value = d3
    .forceSimulation()
    .force(
      'collide',
      d3.forceCollide((_d, i) => (i === 0 ? bigRadius.value + padding.value : radius.value + padding.value))
    )
    .force('x', d3.forceX((_d, i) => (i === 0 ? null : window.innerWidth / 2)).strength(0.05))
    .force('y', d3.forceY((_d, i) => (i === 0 ? null : window.innerHeight / 2)).strength(0.05))
    .on('tick', ticked)

  let node = svg.append('g').selectAll('circle')

  function pointed(event) {
    const [x, y] = d3.pointer(event)
    simulation.value.nodes()[0].x = x
    simulation.value.nodes()[0].y = y
  }

  function ticked() {
    node
      .style('stroke-width', '1px')
      .style('stroke', (_d, i) => (i === 0 ? 'white' : 'gray'))
      .attr('fill', (_d, i) => (i === 0 ? 'white' : colorDefault.value))
      .attr('r', (_d, i) => (i === 0 ? bigRadius.value : radius.value))
      .attr('cx', (d, i) => (i === 0 ? 0 : d.x))
      .attr('cy', (d, i) => (i === 0 ? 0 : d.y))
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
  }, 2000)
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
  simulation.value.force('x', d3.forceX(window.innerWidth / 2))
  simulation.value.force('y', d3.forceY(window.innerHeight / 2))
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
