<template>
  <div class="PageContainer">
    <!-- <p class="deposits">Deposits: {{ deposits }}</p> -->
    <!-- <p class="available">Availabe: {{ available }}</p> -->
    <svg id="svg"></svg>
    <img class="spout" :src="faucetSpout" alt="" />
  </div>
</template>

<script setup>
import { onMounted, computed, useStore, ref } from '@nuxtjs/composition-api'
import * as d3 from 'd3'

import faucetSpout from '@/assets/faucet-spout.png'

const store = useStore()

const blue = ref('#cce8ff')

const visualization = ref(null)
const simulation = ref(null)

const dotRadius = ref(20)
const pointerRadius = ref(100)

const available = ref(25)
const deposits = ref(100)

const initVisualization = () => {
  const svg = d3.select(document.getElementById('svg'))
  svg.on('mousemove', mousemove).on('touchmove', touchmove)

  simulation.value = d3
    .forceSimulation()
    .alphaTarget(0.3)
    .velocityDecay(0.4)
    .force('x', d3.forceX((d) => (d.pointer ? null : window.innerWidth / 2)).strength(0.01))
    .force('y', d3.forceY((d) => (d.pointer ? null : window.innerHeight)).strength(0.04))
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
      .attr('cx', (d) => (d.x = d.pointer ? d.x : getPositionX(d)))
      .attr('cy', (d) => (d.y = d.pointer ? d.y : getPositionY(d)))
  }

  function getPositionX(dot) {
    return Math.max(dotRadius.value, Math.min(window.innerWidth - dotRadius.value, dot.x))
  }

  function getPositionY(dot) {
    return Math.max(dotRadius.value, Math.min(window.innerHeight - dotRadius.value, dot.y))
  }

  function getRadius(dot) {
    return dot.pointer ? pointerRadius.value : dotRadius.value
  }

  function getFill(dot) {
    return dot.pointer ? 'transparent' : blue.value
  }

  function getStroke(dot) {
    return dot.pointer ? 'none' : 'gray'
  }

  visualization.value = Object.assign(svg.node(), {
    update(nodes) {
      // Make a shallow copy to protect against mutation, while
      // recycling old nodes to preserve position and velocity.
      const old = new Map(node.data().map((d) => [d.id, d]))
      nodes = nodes.map((d) => Object.assign(old.get(d.id) || {}, d))

      nodes[0].pointer = true

      simulation.value.nodes(nodes)

      node = node
        .data(nodes, (d) => d.id)
        .join((enter) =>
          enter
            .append('circle')
            .attr('cx', (d) => (d.x = d.pointer ? d.x : window.innerWidth / 2))
            .attr('cy', (d) => (d.y = d.pointer ? d.y : window.innerHeight / 2))
        )
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
  }, 1000)
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
  simulation.value.force('x', d3.forceX((d) => (d.pointer ? null : window.innerWidth / 2)).strength(0.01))
  simulation.value.force('y', d3.forceY((d) => (d.pointer ? null : window.innerHeight)).strength(0.04))
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
  width: 100%;
  height: 100%;
}
.spout {
  width: 7rem;
  position: absolute;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%, -50%);
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
