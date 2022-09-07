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

const blue = ref('#cce8ff')

const visualization = ref(null)
const simulation = ref(null)

const radius = ref(20)
const bigRadius = ref(100)

const available = ref(25)
const deposits = ref(100)

const initVisualization = () => {
  const svg = d3.select(document.getElementById('svg'))
  svg.on('touchmove', touchmove).on('mousemove', mousemove)

  simulation.value = d3
    .forceSimulation()
    .alphaTarget(0.3)
    .velocityDecay(0.4)
    .force('x', d3.forceX((d) => (d.root ? null : window.innerWidth / 2)).strength(0.01))
    .force('y', d3.forceY((d) => (d.root ? null : window.innerHeight)).strength(0.02))
    .force('collide', d3.forceCollide(getRadius).iterations(3))
    .on('tick', ticked)

  let node = svg.append('g').selectAll('circle')

  function mousemove(event) {
    const _node = simulation.value.nodes()[0]
    _node.fx = event.clientX
    _node.fy = event.clientY
  }

  function touchmove(event) {
    const touch = event.touches[0]
    const _node = simulation.value.nodes()[0]
    _node.fx = touch.clientX
    _node.fy = touch.clientY
  }

  function ticked() {
    node
      .style('stroke-width', '1px')
      .style('stroke', getStroke)
      .attr('fill', getFill)
      .attr('r', getRadius)
      // position to fit inside of the screen!
      .attr('cx', (d) => (d.x = d.root ? d.x : Math.max(getRadius(d), Math.min(window.innerWidth - getRadius(d), d.x))))
      .attr(
        'cy',
        (d) => (d.y = d.root ? d.y : Math.max(getRadius(d), Math.min(window.innerHeight - getRadius(d), d.y)))
      )
  }

  function getRadius(dot) {
    return dot.root ? bigRadius.value : radius.value
  }

  function getFill(dot) {
    return dot.root ? 'transparent' : blue.value
  }

  function getStroke(dot) {
    return dot.root ? 'none' : 'gray'
  }

  visualization.value = Object.assign(svg.node(), {
    update(nodes) {
      // Make a shallow copy to protect against mutation, while
      // recycling old nodes to preserve position and velocity.
      const old = new Map(node.data().map((d) => [d.id, d]))
      nodes = nodes.map((d) => Object.assign(old.get(d.id) || {}, d))

      nodes[0].root = true

      simulation.value.nodes(nodes)

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
  background: none;
}
#svg {
  position: absolute;
  top: 0;
  left: 0;
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
