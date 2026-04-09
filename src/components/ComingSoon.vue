<template>
  <section class="coming-soon">
    <div class="content">
      <div class="wordmark">AVATR</div>
      <div class="divider"></div>
      <h1 class="event-title">Virtual Event 2026</h1>
      <p class="tagline">Something extraordinary is being prepared.</p>
      <p class="status">Website in progress — check back soon.</p>
    </div>
    <footer class="footer">
      <span>© 2026 AVATR Technology Co., Ltd.</span>
    </footer>
  </section>
</template>

<style scoped>
.coming-soon {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #0a0a0a;
  position: relative;
  overflow: hidden;
}

/* Subtle radial glow */
.coming-soon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(200, 169, 110, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
  z-index: 1;
}

.wordmark {
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  letter-spacing: 0.3em;
  color: #f0f0f0;
  font-family: 'Arial', sans-serif;
}

.divider {
  width: 60px;
  height: 1px;
  background-color: #c8a96e;
  opacity: 0.7;
}

.event-title {
  font-size: clamp(0.9rem, 2.5vw, 1.2rem);
  font-weight: 400;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #c8a96e;
}

.tagline {
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-weight: 300;
  color: #a0a0a0;
  letter-spacing: 0.05em;
  max-width: 400px;
}

.status {
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #444444;
}

.footer {
  position: absolute;
  bottom: 32px;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: #333333;
}
</style>
