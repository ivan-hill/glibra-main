import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const reveal = (el: HTMLElement, opts: Partial<gsap.TweenVars> = {}) =>
  gsap.fromTo(el, { y: 24, opacity: 0 }, {
    y: 0, opacity: 1, ease: 'power2.out', duration: 0.5,
    ...opts,
    scrollTrigger: { 
      trigger: el, 
      start: 'top 85%', 
      toggleActions: 'play none none reverse',
      ...(opts.scrollTrigger || {})
    }
  });

export const pinSection = (section: HTMLElement, scrub = 0.3) =>
  ScrollTrigger.create({ trigger: section, start: 'top top', end: '+=200%', pin: true, scrub });

export const mountPageProgress = (root: HTMLElement, onUpdate: (p: number) => void) =>
  ScrollTrigger.create({ trigger: root, start: 'top top', end: 'bottom bottom', onUpdate: (self) => onUpdate(self.progress) });