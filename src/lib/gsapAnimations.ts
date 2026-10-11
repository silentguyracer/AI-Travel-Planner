import { gsap } from 'gsap';

/**
 * Coordinated GSAP Animation Suite for AI Travel Planner
 * Provides unified, silky-smooth motion design, choreographed entrances,
 * responsive spring physics, and micro-interactions.
 */

export const GSAP_EASE = {
  smooth: 'power3.out',
  snappy: 'power4.out',
  elastic: 'elastic.out(1, 0.45)',
  bounce: 'back.out(1.7)',
  inOut: 'power2.inOut',
};

/**
 * Orchestrates a coordinated hero entrance with stagger and subtle 3D depth
 */
export function animateHeroEntrance(
  container: HTMLElement | null,
  options: { delay?: number; onComplete?: () => void } = {}
) {
  if (!container) return;

  const elements = container.querySelectorAll('[data-gsap-hero]');
  if (!elements.length) return;

  const tl = gsap.timeline({
    delay: options.delay ?? 0.05,
    onComplete: options.onComplete,
  });

  tl.fromTo(
    elements,
    {
      opacity: 0,
      y: 28,
      scale: 0.97,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: GSAP_EASE.smooth,
      stagger: 0.08,
      clearProps: 'transform,opacity',
    }
  );

  return tl;
}

/**
 * Staggers a collection of cards, chips, or items with fluid cascade
 */
export function animateStaggerCards(
  elements: HTMLElement[] | NodeListOf<HTMLElement> | string,
  options: {
    yOffset?: number;
    delay?: number;
    stagger?: number;
    duration?: number;
    scale?: number;
    onComplete?: () => void;
  } = {}
) {
  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: options.yOffset ?? 24,
      scale: options.scale ?? 0.96,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: options.duration ?? 0.55,
      delay: options.delay ?? 0,
      stagger: options.stagger ?? 0.06,
      ease: GSAP_EASE.snappy,
      clearProps: 'transform,opacity',
      onComplete: options.onComplete,
    }
  );
}

/**
 * Spring-pop micro-interaction for checkmarks, badges, counters, and action triggers
 */
export function animateSpringPop(
  element: HTMLElement | null,
  options: { scale?: number; rotation?: number; duration?: number } = {}
) {
  if (!element) return;

  return gsap.fromTo(
    element,
    {
      scale: options.scale ?? 1.28,
      rotate: options.rotation ?? 8,
    },
    {
      scale: 1,
      rotate: 0,
      duration: options.duration ?? 0.55,
      ease: GSAP_EASE.elastic,
      clearProps: 'transform',
    }
  );
}

/**
 * Smoothly animates a progress bar to a target percentage
 */
export function animateProgressBar(
  element: HTMLElement | null,
  targetPercent: number,
  options: { duration?: number; onUpdate?: (val: number) => void } = {}
) {
  if (!element) return;

  return gsap.to(element, {
    width: `${Math.max(0, Math.min(100, targetPercent))}%`,
    duration: options.duration ?? 0.65,
    ease: GSAP_EASE.smooth,
  });
}

/**
 * Coordinated Tab / View transition animation
 */
export function animateTabTransition(
  container: HTMLElement | null,
  direction: 'forward' | 'backward' | 'fade' = 'fade',
  onComplete?: () => void
) {
  if (!container) return;

  const xOffset = direction === 'forward' ? 24 : direction === 'backward' ? -24 : 0;

  return gsap.fromTo(
    container,
    {
      opacity: 0,
      x: xOffset,
      y: direction === 'fade' ? 12 : 0,
      scale: 0.985,
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.42,
      ease: GSAP_EASE.smooth,
      clearProps: 'transform,opacity',
      onComplete,
    }
  );
}

/**
 * Subtle Magnetic button effect that coordinates with pointer proximity
 */
export function attachMagneticHover(
  button: HTMLElement | null,
  strength: number = 0.25
): () => void {
  if (!button) return () => {};

  const handleMouseMove = (e: MouseEvent) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(button, {
      x: x * strength,
      y: y * strength,
      rotation: (x * strength) * 0.05,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.6,
      ease: GSAP_EASE.elastic,
      clearProps: 'transform',
    });
  };

  button.addEventListener('mousemove', handleMouseMove);
  button.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    button.removeEventListener('mousemove', handleMouseMove);
    button.removeEventListener('mouseleave', handleMouseLeave);
  };
}

/**
 * Creates continuous natural floating motion for destination stamps or hero badges
 */
export function animateFloating(
  element: HTMLElement | null,
  options: { y?: number; duration?: number; rotation?: number } = {}
) {
  if (!element) return;

  return gsap.to(element, {
    y: options.y ?? -8,
    rotation: options.rotation ?? 2,
    duration: options.duration ?? 2.8,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
}

/**
 * Coordinated audio equalizer waveform wave animation
 */
export function animateAudioWaveform(
  container: HTMLElement | null,
  isPlaying: boolean
): gsap.core.Timeline | null {
  if (!container) return null;

  const bars = container.querySelectorAll<HTMLElement>('.audio-bar');
  if (!bars.length) return null;

  if (!isPlaying) {
    gsap.to(bars, {
      scaleY: 0.2,
      duration: 0.3,
      ease: 'power2.out',
    });
    return null;
  }

  const tl = gsap.timeline({ repeat: -1, yoyo: true });
  bars.forEach((bar, index) => {
    tl.to(
      bar,
      {
        scaleY: gsap.utils.random(0.4, 1.4),
        duration: gsap.utils.random(0.3, 0.6),
        ease: 'sine.inOut',
      },
      index * 0.08
    );
  });

  return tl;
}
