<template>
  <section ref="section" class="brand-story section" id="story">
    <div class="section__inner">
      <SectionHeading
        title="Born from the Future"
        subtitle="A convergence of three industry titans"
      />

      <!-- Connecting lines SVG (desktop) -->
      <div class="brand-story__flow">
        <svg ref="flowSvg" class="brand-story__flow-svg" viewBox="0 0 1000 60" preserveAspectRatio="none">
          <path ref="line1" d="M 167 30 C 300 30, 350 30, 500 30" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3" stroke-dasharray="400" stroke-dashoffset="400"/>
          <path ref="line2" d="M 500 30 C 650 30, 700 30, 833 30" stroke="var(--color-accent)" stroke-width="1" fill="none" opacity="0.3" stroke-dasharray="400" stroke-dashoffset="400"/>
          <path d="M 500 18 L 512 30 L 500 42 L 488 30 Z" fill="none" stroke="var(--color-accent)" stroke-width="1" opacity="0.4"/>
        </svg>
      </div>

      <div class="brand-story__cards">
        <ScrollReveal
          v-for="(card, i) in cards"
          :key="i"
          :delay="i * 0.15"
          class="brand-story__card"
        >
          <div class="brand-story__card-inner" @mouseenter="activateCard(i)" @mouseleave="deactivateCard(i)">
            <!-- Glass shine layer -->
            <div class="brand-story__card-shine"></div>

            <!-- Animated diagram area -->
            <div class="brand-story__diagram" :class="{ 'brand-story__diagram--active': activeCards[i] }">
              <svg :viewBox="card.diagram.viewBox" fill="none" xmlns="http://www.w3.org/2000/svg" class="brand-story__diagram-svg">
                <g v-for="(el, j) in card.diagram.elements" :key="j">
                  <component
                    :is="el.tag"
                    v-bind="el.attrs"
                    :class="el.class"
                    :style="{ animationDelay: (j * 0.1) + 's' }"
                  />
                </g>
              </svg>
            </div>

            <!-- Partner badge -->
            <div class="brand-story__partner-badge">
              <span class="brand-story__partner-name">{{ card.partner }}</span>
            </div>

            <h3 class="brand-story__card-title">{{ card.title }}</h3>
            <p class="brand-story__card-text">{{ card.text }}</p>

            <!-- Hover detail row -->
            <div class="brand-story__card-details">
              <div v-for="(detail, d) in card.details" :key="d" class="brand-story__detail">
                <span class="brand-story__detail-value">{{ detail.value }}</span>
                <span class="brand-story__detail-label">{{ detail.label }}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <!-- Emblem visual anchor -->
      <div class="brand-story__emblem-wrap">
        <img :src="emblemWhite" alt="" class="brand-story__emblem" />
      </div>

      <ScrollReveal class="brand-story__footer-text" :delay="0.4">
        <p>
          AVATR is the result of Changan Automobile's manufacturing expertise, Huawei's
          intelligent technology, and CATL's next-generation battery innovation — united to
          redefine what an electric vehicle can be.
        </p>
      </ScrollReveal>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import SectionHeading from './SectionHeading.vue'
import ScrollReveal from './ScrollReveal.vue'
import emblemWhite from '../assets/avatr-logo-emblem-white.png'

const section = ref(null)
const line1 = ref(null)
const line2 = ref(null)
const activeCards = reactive([false, false, false])
let ctx = null

function activateCard(i) { activeCards[i] = true }
function deactivateCard(i) { activeCards[i] = false }

const cards = [
  {
    title: 'Manufacturing',
    text: 'Decades of automotive engineering excellence and world-class production capabilities.',
    partner: 'Changan Automobile',
    details: [
      { value: '160+', label: 'Years Heritage' },
      { value: '14', label: 'Global Plants' },
      { value: '6M+', label: 'Units/Year' },
    ],
    diagram: {
      viewBox: '0 0 200 140',
      elements: [
        { tag: 'rect', attrs: { x: 30, y: 85, width: 140, height: 35, rx: 4, stroke: 'currentColor', 'stroke-width': 1.2, fill: 'none' }, class: 'diagram-line' },
        { tag: 'rect', attrs: { x: 50, y: 55, width: 100, height: 35, rx: 4, stroke: 'currentColor', 'stroke-width': 1.2, fill: 'none' }, class: 'diagram-line' },
        { tag: 'rect', attrs: { x: 70, y: 25, width: 60, height: 35, rx: 4, stroke: 'currentColor', 'stroke-width': 1.2, fill: 'none' }, class: 'diagram-line' },
        { tag: 'line', attrs: { x1: 100, y1: 10, x2: 100, y2: 25, stroke: 'currentColor', 'stroke-width': 1, opacity: 0.5 }, class: 'diagram-line' },
        { tag: 'circle', attrs: { cx: 100, cy: 8, r: 3, stroke: 'currentColor', 'stroke-width': 1, fill: 'none' }, class: 'diagram-pulse' },
        { tag: 'circle', attrs: { cx: 60, cy: 102, r: 8, stroke: 'currentColor', 'stroke-width': 1, fill: 'none' }, class: 'diagram-spin' },
        { tag: 'circle', attrs: { cx: 100, cy: 102, r: 8, stroke: 'currentColor', 'stroke-width': 1, fill: 'none' }, class: 'diagram-spin' },
        { tag: 'circle', attrs: { cx: 140, cy: 102, r: 8, stroke: 'currentColor', 'stroke-width': 1, fill: 'none' }, class: 'diagram-spin' },
        { tag: 'path', attrs: { d: 'M60 102 H140', stroke: 'currentColor', 'stroke-width': 0.6, opacity: 0.3, 'stroke-dasharray': '3 3' }, class: 'diagram-dash' },
        { tag: 'circle', attrs: { cx: 60, cy: 102, r: 3, fill: 'currentColor', opacity: 0.4 }, class: 'diagram-pulse' },
        { tag: 'circle', attrs: { cx: 100, cy: 102, r: 3, fill: 'currentColor', opacity: 0.4 }, class: 'diagram-pulse' },
        { tag: 'circle', attrs: { cx: 140, cy: 102, r: 3, fill: 'currentColor', opacity: 0.4 }, class: 'diagram-pulse' },
      ],
    },
  },
  {
    title: 'Intelligence',
    text: 'HarmonyOS smart cockpit and ADS 2.0 autonomous driving — technology that thinks ahead.',
    partner: 'Huawei',
    details: [
      { value: 'ADS 2.0', label: 'Autonomous' },
      { value: '26', label: 'Sensors' },
      { value: '400T', label: 'FLOPS' },
    ],
    diagram: {
      viewBox: '0 0 200 140',
      elements: [
        { tag: 'circle', attrs: { cx: 100, cy: 70, r: 30, stroke: 'currentColor', 'stroke-width': 1.2, fill: 'none' }, class: 'diagram-line' },
        { tag: 'circle', attrs: { cx: 100, cy: 70, r: 18, stroke: 'currentColor', 'stroke-width': 1, fill: 'none', opacity: 0.5 }, class: 'diagram-spin' },
        { tag: 'circle', attrs: { cx: 100, cy: 70, r: 6, fill: 'currentColor', opacity: 0.6 }, class: 'diagram-pulse' },
        { tag: 'line', attrs: { x1: 100, y1: 40, x2: 100, y2: 20, stroke: 'currentColor', 'stroke-width': 1 }, class: 'diagram-line' },
        { tag: 'line', attrs: { x1: 130, y1: 70, x2: 160, y2: 70, stroke: 'currentColor', 'stroke-width': 1 }, class: 'diagram-line' },
        { tag: 'line', attrs: { x1: 70, y1: 70, x2: 40, y2: 70, stroke: 'currentColor', 'stroke-width': 1 }, class: 'diagram-line' },
        { tag: 'line', attrs: { x1: 100, y1: 100, x2: 100, y2: 120, stroke: 'currentColor', 'stroke-width': 1 }, class: 'diagram-line' },
        { tag: 'line', attrs: { x1: 121, y1: 49, x2: 140, y2: 30, stroke: 'currentColor', 'stroke-width': 1 }, class: 'diagram-line' },
        { tag: 'line', attrs: { x1: 79, y1: 49, x2: 60, y2: 30, stroke: 'currentColor', 'stroke-width': 1 }, class: 'diagram-line' },
        { tag: 'circle', attrs: { cx: 100, cy: 16, r: 4, stroke: 'currentColor', 'stroke-width': 1, fill: 'none' }, class: 'diagram-pulse' },
        { tag: 'circle', attrs: { cx: 164, cy: 70, r: 4, stroke: 'currentColor', 'stroke-width': 1, fill: 'none' }, class: 'diagram-pulse' },
        { tag: 'circle', attrs: { cx: 36, cy: 70, r: 4, stroke: 'currentColor', 'stroke-width': 1, fill: 'none' }, class: 'diagram-pulse' },
        { tag: 'circle', attrs: { cx: 100, cy: 124, r: 4, stroke: 'currentColor', 'stroke-width': 1, fill: 'none' }, class: 'diagram-pulse' },
        { tag: 'circle', attrs: { cx: 144, cy: 27, r: 3, stroke: 'currentColor', 'stroke-width': 1, fill: 'none' }, class: 'diagram-pulse' },
        { tag: 'circle', attrs: { cx: 56, cy: 27, r: 3, stroke: 'currentColor', 'stroke-width': 1, fill: 'none' }, class: 'diagram-pulse' },
        { tag: 'path', attrs: { d: 'M 80 70 A 20 20 0 0 1 120 70', stroke: 'currentColor', 'stroke-width': 0.8, fill: 'none', 'stroke-dasharray': '4 3' }, class: 'diagram-dash' },
      ],
    },
  },
  {
    title: 'Power',
    text: 'CTP battery technology delivering class-leading range, safety, and charging speed.',
    partner: 'CATL',
    details: [
      { value: '700', label: 'km Range' },
      { value: '240', label: 'kW Charging' },
      { value: '99.8%', label: 'Efficiency' },
    ],
    diagram: {
      viewBox: '0 0 200 140',
      elements: [
        { tag: 'rect', attrs: { x: 35, y: 40, width: 120, height: 60, rx: 8, stroke: 'currentColor', 'stroke-width': 1.2, fill: 'none' }, class: 'diagram-line' },
        { tag: 'rect', attrs: { x: 155, y: 55, width: 15, height: 30, rx: 3, stroke: 'currentColor', 'stroke-width': 1.2, fill: 'none' }, class: 'diagram-line' },
        { tag: 'rect', attrs: { x: 45, y: 50, width: 25, height: 40, rx: 2, stroke: 'currentColor', 'stroke-width': 0.8, fill: 'none', opacity: 0.5 }, class: 'diagram-line' },
        { tag: 'rect', attrs: { x: 80, y: 50, width: 25, height: 40, rx: 2, stroke: 'currentColor', 'stroke-width': 0.8, fill: 'none', opacity: 0.5 }, class: 'diagram-line' },
        { tag: 'rect', attrs: { x: 115, y: 50, width: 25, height: 40, rx: 2, stroke: 'currentColor', 'stroke-width': 0.8, fill: 'none', opacity: 0.5 }, class: 'diagram-line' },
        { tag: 'path', attrs: { d: 'M55 62 L51 70 H59 L55 78', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, class: 'diagram-pulse' },
        { tag: 'path', attrs: { d: 'M90 62 L86 70 H94 L90 78', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, class: 'diagram-pulse' },
        { tag: 'path', attrs: { d: 'M125 62 L121 70 H129 L125 78', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, class: 'diagram-pulse' },
        { tag: 'line', attrs: { x1: 95, y1: 110, x2: 95, y2: 125, stroke: 'currentColor', 'stroke-width': 0.8, opacity: 0.4 }, class: 'diagram-line' },
        { tag: 'path', attrs: { d: 'M80 125 H110', stroke: 'currentColor', 'stroke-width': 0.8, opacity: 0.4 }, class: 'diagram-line' },
        { tag: 'path', attrs: { d: 'M45 35 H145', stroke: 'currentColor', 'stroke-width': 0.6, opacity: 0.2, 'stroke-dasharray': '3 3' }, class: 'diagram-dash' },
        { tag: 'circle', attrs: { cx: 95, cy: 30, r: 4, stroke: 'currentColor', 'stroke-width': 1, fill: 'none' }, class: 'diagram-pulse' },
        { tag: 'line', attrs: { x1: 95, y1: 34, x2: 95, y2: 40, stroke: 'currentColor', 'stroke-width': 0.8, opacity: 0.5 }, class: 'diagram-line' },
      ],
    },
  },
]

onMounted(() => {
  if (!section.value) return

  ctx = gsap.context(() => {
    if (line1.value && line2.value) {
      gsap.to([line1.value, line2.value], {
        strokeDashoffset: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power2.inOut',
        delay: 0.3,
      })
    }
  }, section.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
.brand-story {
  background-color: var(--color-surface);
}

.brand-story__flow {
  margin-bottom: -20px;
  padding: 0 2rem;
}

.brand-story__flow-svg {
  width: 100%;
  height: 60px;
}

@media (max-width: 768px) {
  .brand-story__flow {
    display: none;
  }
}

.brand-story__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gap-md);
}

@media (max-width: 768px) {
  .brand-story__cards {
    grid-template-columns: 1fr;
    gap: var(--gap-md);
  }
}

.brand-story__card-inner {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--glass-radius);
  min-height: 420px;
  transition: all var(--duration-normal) ease;
  position: relative;
  overflow: hidden;
  box-shadow: var(--glass-shadow);
}

.brand-story__card-shine {
  position: absolute;
  inset: 0;
  background: var(--glass-shine);
  pointer-events: none;
  border-radius: inherit;
  z-index: 0;
}

.brand-story__card-inner:hover {
  border-color: var(--glass-border-hover);
  background: var(--glass-bg-hover);
  box-shadow: var(--glass-shadow-hover);
  transform: translateY(-6px);
}

/* ── Animated Diagram ── */
.brand-story__diagram {
  width: 100%;
  height: 140px;
  color: var(--color-accent);
  position: relative;
  z-index: 1;
  transition: transform 0.4s ease;
}

.brand-story__card-inner:hover .brand-story__diagram {
  transform: scale(1.05);
}

.brand-story__diagram-svg {
  width: 100%;
  height: 100%;
}

/* Diagram animation classes */
.brand-story__diagram :deep(.diagram-line) {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: diagramDraw 1.5s ease-out forwards;
}

.brand-story__diagram :deep(.diagram-pulse) {
  animation: diagramPulse 2s ease-in-out infinite;
}

.brand-story__diagram :deep(.diagram-spin) {
  transform-origin: center;
  animation: diagramSpin 8s linear infinite;
}

.brand-story__diagram :deep(.diagram-dash) {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: diagramDraw 2s ease-out 0.5s forwards;
}

/* Hover intensifies animations */
.brand-story__diagram--active :deep(.diagram-pulse) {
  animation: diagramPulseActive 1s ease-in-out infinite;
}

.brand-story__diagram--active :deep(.diagram-spin) {
  animation: diagramSpin 3s linear infinite;
}

@keyframes diagramDraw {
  to { stroke-dashoffset: 0; }
}

@keyframes diagramPulse {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

@keyframes diagramPulseActive {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.25); }
}

@keyframes diagramSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Partner Badge ── */
.brand-story__partner-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 6px 14px;
  background: rgba(200, 169, 110, 0.08);
  border: 1px solid rgba(200, 169, 110, 0.15);
  border-radius: 20px;
  position: relative;
  z-index: 1;
}

.brand-story__partner-name {
  font-size: var(--text-small);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
  font-weight: 500;
}

.brand-story__card-title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-text);
  position: relative;
  z-index: 1;
}

.brand-story__card-text {
  font-size: var(--text-body);
  color: var(--color-muted);
  line-height: 1.7;
  position: relative;
  z-index: 1;
}

/* ── Detail Stats Row ── */
.brand-story__card-details {
  display: flex;
  gap: 16px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease;
}

.brand-story__card-inner:hover .brand-story__card-details {
  opacity: 1;
  transform: translateY(0);
}

.brand-story__detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  text-align: center;
}

.brand-story__detail-value {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-accent);
}

.brand-story__detail-label {
  font-size: var(--text-small);
  color: var(--color-muted);
  letter-spacing: 0.05em;
}

.brand-story__emblem-wrap {
  display: flex;
  justify-content: center;
  margin-top: var(--gap-lg);
}

.brand-story__emblem {
  width: 48px;
  height: auto;
  opacity: 0.08;
  filter: brightness(2);
}

.brand-story__footer-text {
  margin-top: var(--gap-md);
  text-align: center;
}

.brand-story__footer-text p {
  font-size: var(--text-body);
  color: var(--color-muted);
  line-height: 1.8;
  max-width: 700px;
  margin: 0 auto;
}
</style>
