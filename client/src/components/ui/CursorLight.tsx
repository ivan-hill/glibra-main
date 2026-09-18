import { useEffect } from 'react';

export default function CursorLight() {
  useEffect(() => {
    const r = document.documentElement;
    const onMove = (e: MouseEvent) => {
      r.style.setProperty('--mx', e.clientX + 'px');
      r.style.setProperty('--my', e.clientY + 'px');
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return null;
}