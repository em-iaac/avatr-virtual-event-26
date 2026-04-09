<template>
  <footer class="footer section">
    <div class="section__inner">
      <div class="footer__top">
        <div class="footer__brand">
          <img :src="textLogo" alt="AVATR" class="footer__logo" />
          <span class="footer__tagline">Intelligence Defines the Drive</span>
        </div>
        <div class="footer__links">
          <!-- Instagram -->
          <a :href="BRAND.social.instagram" target="_blank" rel="noopener noreferrer" class="footer__social-link" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="5"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <!-- X / Twitter -->
          <a :href="BRAND.social.twitter" target="_blank" rel="noopener noreferrer" class="footer__social-link" aria-label="X">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <!-- YouTube -->
          <a :href="BRAND.social.youtube" target="_blank" rel="noopener noreferrer" class="footer__social-link" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="4"/>
              <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/>
            </svg>
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
import textLogo from '../assets/avatr-text-logo-white.png'
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
  gap: 10px;
}

.footer__logo {
  height: 20px;
  width: auto;
  opacity: 0.8;
  filter: brightness(1.2);
}

.footer__tagline {
  font-size: var(--text-small);
  letter-spacing: 0.1em;
  color: var(--color-muted);
}

.footer__links {
  display: flex;
  gap: 20px;
}

.footer__social-link {
  width: 22px;
  height: 22px;
  color: var(--color-muted);
  transition: color var(--duration-fast) ease, transform var(--duration-fast) ease;
}

.footer__social-link:hover {
  color: var(--color-accent);
  transform: translateY(-2px);
}

.footer__social-link svg {
  width: 100%;
  height: 100%;
}

.footer__divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(200, 169, 110, 0.1), transparent);
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
