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
const colorHovered = ref('#a8d8ff')
const animationDuration = ref(350)

const visualization = ref(null)
const simulation = ref(null)

const radius = ref(20)
const padding = ref(0)
const available = ref(10)
const deposits = ref(100)

const initVisualization = () => {
  const svg = d3.select(document.getElementById('svg'))

  simulation.value = d3
    .forceSimulation()
    .force('x', d3.forceX(window.innerWidth / 2).strength(0.05))
    .force('y', d3.forceY(window.innerHeight).strength(0.05))
    .force('collide', d3.forceCollide(radius.value).strength(1))
    .on('tick', ticked)

  let node = svg
    .append('g')
    .selectAll('circle')
    .call(d3.drag().on('start', dragStart).on('drag', drag).on('end', dragEnd))

  function dragStart(d) {
    // console.log('drag start');
    simulation.value.alphaTarget(0.5).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function drag(d) {
    const [x, y] = d3.pointer(this)
    d.fx = x
    d.fy = y
  }

  function dragEnd(d) {
    // console.log('drag end');
    simulation.value.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  function ticked() {
    node
      .style('cursor', 'pointer')
      .style('stroke', 'gray')
      .style('stroke-width', '1px')
      .attr('r', () => radius.value)
      .attr('cx', (d) => (d.x = Math.max(radius.value, Math.min(window.innerWidth - radius.value, d.x))))
      .attr('cy', (d) => (d.y = Math.max(radius.value, Math.min(window.innerHeight - radius.value, d.y))))
      .attr('fill', () => colorDefault.value)
      .on('mouseover', (event) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(animationDuration.value)
          .attr('r', radius.value + padding.value)
          .style('fill', colorHovered.value)
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(animationDuration.value)
          .attr('r', radius.value)
          .style('fill', colorDefault.value)
      })
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
