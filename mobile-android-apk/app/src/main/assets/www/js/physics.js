/**
 * ============================================================================
 * GIRI ORBIT — LAUNCHER ZERO-GRAVITY PHYSICS (physics.js)
 * By GIRI Corporation (A Subsidiary of Giri Group)
 * ============================================================================
 * Features:
 * - Manages the weightless floating state of document cards on the Launcher Hub
 * - Interactive pointer drag & throw kinetic inertia with frictional decay
 * - Soft boundary cushion-bounce physics
 * - Smooth hover dampening & auto-leveling (0deg, scale 1.03)
 */

export class LauncherPhysicsEngine {
  constructor(viewportElement) {
    this.viewport = viewportElement;
    this.cards = [];
    this.isRunning = false;
    this.animId = null;
    this.lastTime = performance.now();
    this.highestZIndex = 10;
    this.activeDraggingCard = null;

    this.padding = { top: 16, left: 24, right: 24, bottom: 24 };
    this.updateBounds();

    window.addEventListener('resize', () => this.updateBounds());
    window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    window.addEventListener('pointercancel', (e) => this.handlePointerUp(e));
  }

  updateBounds() {
    if (!this.viewport) return;
    const rect = this.viewport.getBoundingClientRect();
    this.bounds = {
      minX: this.padding.left,
      minY: this.padding.top,
      maxX: rect.width - this.padding.right,
      maxY: rect.height - this.padding.bottom
    };
  }

  registerCard(element, initialPos = {}) {
    const width = 320;
    const height = 180;

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.24 + Math.random() * 0.18;
    const baseVx = Math.cos(angle) * speed;
    const baseVy = Math.sin(angle) * speed;

    const card = {
      element,
      width,
      height,
      x: initialPos.x || 60,
      y: initialPos.y || 60,
      vx: baseVx,
      vy: baseVy,
      baseVx,
      baseVy,
      rotation: 0,
      targetRotation: 0,
      scale: 1,
      targetScale: 1,
      driftPhase: Math.random() * 100,
      isHovered: false,
      isDragging: false,
      isThrowing: false,
      hasMoved: false,
      dragStartX: 0,
      dragStartY: 0,
      dragOffsetX: 0,
      dragOffsetY: 0,
      velocityHistory: []
    };

    // Hover dynamics: level to 0deg, scale to 1.03
    element.addEventListener('pointerenter', () => {
      if (card.isDragging) return;
      card.isHovered = true;
      card.targetScale = 1.03;
      card.targetRotation = 0;
      this.highestZIndex += 1;
      element.style.zIndex = this.highestZIndex;
    });

    element.addEventListener('pointerleave', () => {
      if (card.isDragging) return;
      card.isHovered = false;
      card.targetScale = 1.0;
    });

    // Pointer Down for Drag & Throw
    element.addEventListener('pointerdown', (e) => {
      card.isDragging = true;
      card.isThrowing = false;
      card.hasMoved = false;
      this.activeDraggingCard = card;

      card.dragStartX = e.clientX;
      card.dragStartY = e.clientY;
      card.dragOffsetX = e.clientX - card.x;
      card.dragOffsetY = e.clientY - card.y;

      card.velocityHistory = [{
        x: e.clientX,
        y: e.clientY,
        time: performance.now()
      }];

      this.highestZIndex += 1;
      element.style.zIndex = this.highestZIndex;
      card.targetScale = 1.04;
    });

    this.cards.push(card);
    this.applyTransform(card);
    return card;
  }

  handlePointerMove(e) {
    const card = this.activeDraggingCard;
    if (!card || !card.isDragging) return;

    const dx = e.clientX - card.dragStartX;
    const dy = e.clientY - card.dragStartY;
    if (Math.hypot(dx, dy) > 6) {
      card.hasMoved = true;
    }

    card.x = e.clientX - card.dragOffsetX;
    card.y = e.clientY - card.dragOffsetY;

    const now = performance.now();
    card.velocityHistory.push({ x: e.clientX, y: e.clientY, time: now });
    card.velocityHistory = card.velocityHistory.filter(pt => now - pt.time <= 80);

    if (card.velocityHistory.length >= 2) {
      const first = card.velocityHistory[0];
      const last = card.velocityHistory[card.velocityHistory.length - 1];
      const dt = (last.time - first.time) || 16;
      const vX = (last.x - first.x) / dt;
      card.targetRotation = Math.max(-3, Math.min(3, vX * 1.5));
    }
  }

  handlePointerUp() {
    const card = this.activeDraggingCard;
    if (!card) return;

    card.isDragging = false;
    this.activeDraggingCard = null;
    card.targetScale = card.isHovered ? 1.03 : 1.0;

    const now = performance.now();
    const samples = card.velocityHistory.filter(pt => now - pt.time <= 90);

    if (samples.length >= 2) {
      const oldest = samples[0];
      const newest = samples[samples.length - 1];
      const dt = Math.max(16, newest.time - oldest.time);
      const throwSpeedFactor = 16.67;

      const throwVx = ((newest.x - oldest.x) / dt) * throwSpeedFactor;
      const throwVy = ((newest.y - oldest.y) / dt) * throwSpeedFactor;

      const speed = Math.hypot(throwVx, throwVy);
      if (speed > 0.8) {
        const maxSpeed = 18;
        const factor = speed > maxSpeed ? maxSpeed / speed : 1.0;
        card.vx = throwVx * factor;
        card.vy = throwVy * factor;
        card.isThrowing = true;
      }
    }

    card.velocityHistory = [];
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();

    const loop = (timestamp) => {
      if (!this.isRunning) return;
      this.update(timestamp);
      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);
  }

  freeze() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  update(timestamp) {
    const t = timestamp * 0.001;

    for (const card of this.cards) {
      if (card.isDragging) {
        this.applyTransform(card);
        continue;
      }

      if (card.isHovered && !card.isThrowing) {
        // Smooth deceleration on hover
        card.vx *= 0.82;
        card.vy *= 0.82;
        card.targetRotation = 0;
      } else if (card.isThrowing) {
        // Throw kinetic inertia decay
        card.x += card.vx;
        card.y += card.vy;
        card.vx *= 0.94;
        card.vy *= 0.94;
        card.targetRotation = Math.max(-3, Math.min(3, card.vx * 0.5));

        if (Math.hypot(card.vx, card.vy) < 0.3) {
          card.isThrowing = false;
          card.vx = card.baseVx;
          card.vy = card.baseVy;
        }
      } else {
        // Harmonic zero-g ambient drift
        const swayX = Math.sin(card.driftPhase + t * 0.7) * 0.16;
        const swayY = Math.cos(card.driftPhase * 0.8 + t * 0.6) * 0.16;

        card.vx += (card.baseVx + swayX - card.vx) * 0.03;
        card.vy += (card.baseVy + swayY - card.vy) * 0.03;

        card.x += card.vx;
        card.y += card.vy;

        // Dynamic minute angular rotation between -2deg and +2deg
        const swayAngle = Math.sin(t * 0.8 + card.driftPhase) * 1.35;
        card.targetRotation = Math.max(-2.0, Math.min(2.0, (card.vx * 1.2) + swayAngle));
      }

      // Cushion-bounce boundaries
      if (this.bounds) {
        const minX = this.bounds.minX;
        const maxX = Math.max(minX, this.bounds.maxX - card.width);
        const minY = this.bounds.minY;
        const maxY = Math.max(minY, this.bounds.maxY - card.height);
        const bounceDamping = 0.84;

        if (card.x <= minX) {
          card.x = minX;
          card.vx = Math.abs(card.vx) * bounceDamping;
          card.baseVx = Math.abs(card.baseVx);
        } else if (card.x >= maxX) {
          card.x = maxX;
          card.vx = -Math.abs(card.vx) * bounceDamping;
          card.baseVx = -Math.abs(card.baseVx);
        }

        if (card.y <= minY) {
          card.y = minY;
          card.vy = Math.abs(card.vy) * bounceDamping;
          card.baseVy = Math.abs(card.baseVy);
        } else if (card.y >= maxY) {
          card.y = maxY;
          card.vy = -Math.abs(card.vy) * bounceDamping;
          card.baseVy = -Math.abs(card.baseVy);
        }
      }

      // LERP interpolation
      card.rotation += (card.targetRotation - card.rotation) * 0.1;
      card.scale += (card.targetScale - card.scale) * 0.1;

      this.applyTransform(card);
    }
  }

  applyTransform(card) {
    const x = Math.round(card.x);
    const y = Math.round(card.y);
    const rot = card.rotation.toFixed(2);
    const scl = card.scale.toFixed(3);
    card.element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${scl})`;
  }

  destroy() {
    this.freeze();
    this.cards = [];
  }
}
