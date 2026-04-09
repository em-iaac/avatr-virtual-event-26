<template>
  <section class="mystery section" id="mystery">
    <div class="section__inner mystery__inner glass-panel glass-panel--deep">
      <div class="mystery__label">Mystery Room</div>
      <h2 class="mystery__title">A second reveal is still behind the glass.</h2>
      <p class="mystery__text">
        This room should feel unresolved on purpose. It hints that the event is more than a single premiere.
        Something else is waiting to unlock.
      </p>
      <div class="mystery__vault">
        <div class="mystery__door">
          <div class="mystery__door-core"></div>
          <div class="mystery__door-ring mystery__door-ring--one"></div>
          <div class="mystery__door-ring mystery__door-ring--two"></div>
        </div>
        <div class="mystery__seal">Opens on premiere night</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mystery__inner {
  min-height: 360px;
  padding: clamp(28px, 5vw, 54px);
  display: grid;
  place-items: center;
  text-align: center;
  gap: 18px;
  background:
    radial-gradient(circle at 50% 40%, rgba(200,169,110,0.09), transparent 35%),
    linear-gradient(180deg, rgba(10,10,14,0.8), rgba(7,7,10,0.95));
}

.mystery__label {
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.mystery__title {
  font-family: var(--font-display);
  font-weight: 300;
  font-size: clamp(1.6rem, 4vw, 2.8rem);
  letter-spacing: 0.05em;
  max-width: 10ch;
}

.mystery__text {
  max-width: 54ch;
  color: var(--color-muted);
}

.mystery__vault {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.mystery__door {
  position: relative;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.mystery__door-core {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--color-accent), rgba(200,169,110,0.2));
  box-shadow: 0 0 24px rgba(200,169,110,0.35);
}

.mystery__door-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(200,169,110,0.2);
}

.mystery__door-ring--one {
  animation: beaconRing 2.4s linear infinite;
}

.mystery__door-ring--two {
  animation: beaconRing 2.4s linear infinite 1.2s;
}

.mystery__seal {
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text);
}
</style>
