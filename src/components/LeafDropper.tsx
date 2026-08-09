"use client";
import { useEffect } from "react";

export function LeafDropper() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('select') || target.closest('.leaf-trigger')) {
        dropLeaves(e.clientX, e.clientY);
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const dropLeaves = (x: number, y: number) => {
    for (let i = 0; i < 6; i++) {
      const leaf = document.createElement('div');
      leaf.innerHTML = '🍃';
      leaf.style.position = 'fixed';
      leaf.style.left = `${x}px`;
      leaf.style.top = `${y}px`;
      leaf.style.fontSize = `${Math.random() * 12 + 10}px`;
      leaf.style.pointerEvents = 'none';
      leaf.style.zIndex = '99999';
      leaf.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      leaf.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 90 - 45}deg)`;
      leaf.style.opacity = '1';
      document.body.appendChild(leaf);
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          leaf.style.transform = `translate(${Math.random() * 80 - 40}px, ${Math.random() * 120 + 40}px) rotate(${Math.random() * 360}deg)`;
          leaf.style.opacity = '0';
        });
      });
      
      setTimeout(() => leaf.remove(), 1000);
    }
  };

  return null;
}
