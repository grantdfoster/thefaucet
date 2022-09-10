<template>
  <div class="PageContainer">
    <div class="DepositContainer">
      <img class="dripLogo" :src="dripLogo" alt="" />
      <p class="deposits">{{ deposits.toLocaleString('en-US') }} drip</p>
    </div>
    <div class="background" :style="backgroundStyle"></div>
    <svg id="svg">
      <defs>
        <linearGradient id="gradient" gradientTransform="rotate(90)">
          <stop offset="0%" style="stop-color: #5997ac; stop-opacity: 0" />
          <stop offset="50%" style="stop-color: #5997ac; stop-opacity: 0.35" />
          <stop offset="100%" style="stop-color: #5997ac; stop-opacity: 1" />
        </linearGradient>
      </defs>
    </svg>
    <img class="spout" :src="faucetSpout" alt="" />
  </div>
</template>

<script setup>
import { onMounted, computed, useStore, ref, watch } from '@nuxtjs/composition-api'
import * as d3 from 'd3'

import background from '@/assets/background.png'
import faucetSpout from '@/assets/faucet-spout.png'
import dripLogo from '@/assets/drip-logo.png'

const store = useStore()
const visualization = ref(null)
const simulation = ref(null)
const interval = ref(null)
const waterSpeed = ref(250)

const dotRadius = computed(() => {
  return store.getters['window/isMobile'] ? 25 : 35
})
const pointerRadius = computed(() => {
  return store.getters['window/isMobile'] ? 100 : 160
})
const available = computed(() => {
  return store.getters['metamask/dripAvailable']
})
const deposits = computed(() => {
  return store.getters['metamask/dripDeposited']
})

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
    .force('y', d3.forceY((d) => (d.id === 'pointer' ? null : window.innerHeight)).strength(0.03))
    .force('collide', d3.forceCollide(getRadius).iterations(5))
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
    return dot.id === 'pointer' ? 'transparent' : 'url(#gradient)'
  }

  function getStroke(dot) {
    return dot.id === 'pointer' ? 'none' : '#5997AC'
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
const walletAddress = computed(() => {
  return store.getters['metamask/walletAddress']
})

const startAvailableListener = () => {
  interval.value = setInterval(() => {
    store.dispatch('metamask/getDripAvailable')
  }, 3000)
}

watch(available, async (_new, _old) => {
  if (visualization.value) {
    if (!_old) {
      // faucet is loading from empty state, so stream water!
      const dots = availableArray.value.filter((d) => !['pointer', 'remainder'].includes(d.id))
      const others = availableArray.value.filter((d) => ['pointer', 'remainder'].includes(d.id))

      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
      }

      async function loadDrip() {
        const payload = []
        for (const dot of dots) {
          payload.push(dot)
          visualization.value.update(payload)
          await sleep(waterSpeed.value)

          if (dots.indexOf(dot) === dots.length - 1) {
            payload.push(...others)
            visualization.value.update(payload)
          }
        }
      }

      await loadDrip()
    }
  } else {
    visualization.value.update(availableArray.value)
  }
})

const login = async () => {
  if (provider.value) {
    const addresses = await provider.value.listAccounts()
    if (addresses.length) await store.dispatch('metamask/connectMetamask')
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

watch(walletAddress, (_new, _old) => {
  if (!_new && interval.value) {
    clearInterval(interval.value)
  }
})

onMounted(async () => {
  initVisualization()
  await login()
  startAvailableListener()
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
.deposits {
  font-size: 1.5rem;
  font-family: $title-font;
  white-space: nowrap;
}
.dripLogo {
  height: 1.5rem;
}
.DepositContainer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: black;
  z-index: 1;
  background: #ececec;
  padding: 0.25rem 1rem;
  border-radius: 2.5rem;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: 1px solid #c8c8c8;
  position: absolute;
  left: 50%;
  top: 9.5rem;
  transform: translateX(-50%);
  // width: 100%;
}
</style>
