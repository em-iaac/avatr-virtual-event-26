<template>
  <footer class="footer section">
    <div class="section__inner">
      <div class="footer__top">
        <div class="footer__brand">
          <span class="footer__wordmark">AVATR</span>
          <span class="footer__tagline">Intelligence Defines the Drive</span>
        </div>
        <div class="footer__links">
          <a
            v-for="(url, platform) in BRAND.social"
            :key="platform"
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="footer__social-link"
          >
            {{ platform }}
          </a>
        </div>
      </div>
      <div class="footer__divider"></div>
      <div class="footer__bottom">
        <span class="footer__copyright">
          &copy; {{ BRAND.year }} {{ BRAND.company }} &middot; {{ BRAND.region }}
        </span>
        <span class="footer__legal">
          All specifications are approximate and subject to change.
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { BRAND } from '../config.js'
</script>

<style scoped>
.footer {
  background-color: var(--color-surface);
  padding-top: clamp(3rem, 6vh, 5rem);
  padding-bottom: clamp(2rem, 4vh, 3rem);
}

.footer__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--gap-md);
  flex-wrap: wrap;
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer__wordmark {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--color-text);
}

.footer__tagline {
  font-size: var(--text-small);
  letter-spacing: 0.1em;
  color: var(--color-muted);
}

.footer__links {
  display: flex;
  gap: 24px;
}

.footer__social-link {
  font-size: var(--text-caption);
  letter-spacing: 0.1em;
  text-transform: capitalize;
  color: var(--color-muted);
  transition: color var(--duration-fast) ease;
}

.footer__social-link:hover {
  color: var(--color-accent);
}

.footer__divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 32px 0;
}

.footer__bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.footer__copyright,
.footer__legal {
  font-size: var(--text-small);
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.2);
}
</style>
