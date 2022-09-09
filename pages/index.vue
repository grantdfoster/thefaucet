<template>
  <div class="PageContainer">
    <!-- <p class="deposits">Deposits: {{ deposits }}</p> -->
    <p class="available">Availabe: {{ available.toFixed(3) }}</p>
    <div class="background" :style="backgroundStyle"></div>
    <svg id="svg"></svg>
    <img class="spout" :src="faucetSpout" alt="" />
  </div>
</template>

<script setup>
import { onMounted, computed, useStore, ref } from '@nuxtjs/composition-api'
import * as d3 from 'd3'

import background from '@/assets/background.png'
import faucetSpout from '@/assets/faucet-spout.png'

const store = useStore()

const blue = ref('#cce8ff')

const visualization = ref(null)
const simulation = ref(null)

const dotRadius = computed(() => {
  return store.getters['window/isMobile'] ? 25 : 35
})
const pointerRadius = computed(() => {
  return store.getters['window/isMobile'] ? 100 : 160
})

const available = ref(3)
const deposits = ref(100)

const backgroundStyle = computed(() => {
  return {
    'background-size': 'cover',
    'background-image': `url("${background}")`,
    'background-position': '50% 50%',
    'background-repeat': 'no-repeat',
  }
})

const initVisualization = () => {
  const svg = d3.select(document.getElementById('svg'))
  svg.on('mousemove', mousemove).on('touchmove', touchmove)

  simulation.value = d3
    .forceSimulation()
    .alphaTarget(0.3)
    .velocityDecay(0.4)
    .force('x', d3.forceX((d) => (d.id === 'pointer' ? null : window.innerWidth / 2)).strength(0.01))
    .force('y', d3.forceY((d) => (d.id === 'pointer' ? null : window.innerHeight)).strength(0.04))
    .force('collide', d3.forceCollide(getRadius).iterations(3))
    .on('tick', ticked)

  let node = svg.append('g').selectAll('circle')

  function mousemove(event) {
    const _node = simulation.value.nodes().find((n) => n.id === 'pointer')
    _node.fx = event.clientX
    _node.fy = event.clientY
  }

  function touchmove(event) {
    const touch = event.touches[0]
    const _node = simulation.value.nodes().find((n) => n.id === 'pointer')
    _node.fx = touch.clientX
    _node.fy = touch.clientY
  }

  function ticked() {
    node
      .style('stroke-width', '1px')
      .style('stroke', getStroke)
      .attr('fill', getFill)
      .attr('r', getRadius)
      .attr('cx', (d) => (d.x = getPositionX(d)))
      .attr('cy', (d) => (d.y = getPositionY(d)))
  }

  function getPositionX(dot) {
    switch (dot.id) {
      case 'pointer':
        return dot.x
      case 'remainder':
        return window.innerWidth / 2
      default:
        // respond to force with d.x or stay inside window
        return Math.max(dotRadius.value, Math.min(window.innerWidth - dotRadius.value, dot.x))
    }
  }

  function getPositionY(dot) {
    switch (dot.id) {
      case 'pointer':
        return dot.y
      case 'remainder':
        return window.innerHeight / 2
      default:
        // respond to force with d.y or stay inside window
        return Math.max(dotRadius.value, Math.min(window.innerHeight - dotRadius.value, dot.y))
    }
  }

  function getRadius(dot) {
    if (dot.id === 'pointer') {
      return pointerRadius.value
    } else if (dot.id === 'remainder') {
      return dotRadius.value * dot.value
    } else {
      return dotRadius.value
    }
  }

  function getFill(dot) {
    return dot.id === 'pointer' ? 'transparent' : blue.value
  }

  function getStroke(dot) {
    return dot.id === 'pointer' ? 'none' : 'gray'
  }

  visualization.value = Object.assign(svg.node(), {
    update(nodes) {
      // Make a shallow copy to protect against mutation, while
      // recycling old nodes to preserve position and velocity.
      const old = new Map(node.data().map((d) => [d.id, d]))
      nodes = nodes.map((d) => Object.assign(old.get(d.id) || {}, d))

      simulation.value.nodes(nodes)

      node = node
        .data(nodes, (d) => d.id)
        .join((enter) =>
          enter
            .append('circle')
            .attr('cx', (d) => (d.x = d.id === 'pointer' ? d.x : window.innerWidth / 2))
            .attr('cy', (d) => (d.y = d.id === 'pointer' ? d.y : window.innerHeight / 2))
        )
    },
  })
}

const provider = computed(() => {
  return store.getters['metamask/provider']
})

const startAvailableListener = () => {
  setInterval(() => {
    store.dispatch('metamask/getDripAvailable')
  }, 5000)
}

const startFakeEarnings = () => {
  setInterval(() => {
    available.value += 0.1
    visualization.value.update(availableArray.value)
  }, 100)
}

const login = async () => {
  if (provider.value) {
    const addresses = await provider.value.listAccounts()
    if (addresses.length) await store.dispatch('metamask/connectWallet')
  }
}

const availableArray = computed(() => {
  // create an array from available drip
  const _array = Array.from(Array(Math.floor(available.value)).keys())
  const remainder = available.value % 1
  const _data = _array.map((_n, _i) => {
    // value is insignificant here but just for consistency...
    return { id: _i + 1, value: 1 }
  })

  // add the pointer and the remainder into it!
  _data.unshift({ id: 'remainder', value: remainder })
  _data.unshift({ id: 'pointer', value: null })
  return _data
})

const resizeHandler = () => {
  simulation.value.force('x', d3.forceX((d) => (d.id === 'pointer' ? null : window.innerWidth / 2)).strength(0.01))
  simulation.value.force('y', d3.forceY((d) => (d.id === 'pointer' ? null : window.innerHeight)).strength(0.04))
}

onMounted(async () => {
  await login()
  initVisualization()
  visualization.value.update(availableArray.value)
  startFakeEarnings()
  // startAvailableListener()
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
  width: 100%;
  height: 100%;
}
.spout {
  width: 7rem;
  position: absolute;
  left: 50vw;
  top: 50%;
  transform: translate(-50%, -100%);
  filter: drop-shadow(12px 4px 16px rgb(93, 93, 93));
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.available {
  position: absolute;
  left: 1.5rem;
  top: 5.5rem;
  color: black;
  z-index: 1;
}
</style>
