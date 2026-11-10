// Shared helpers
export const $=(s,r=document)=>r.querySelector(s);
export const $$=(s,r=document)=>[...r.querySelectorAll(s)];
export const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
export const E='cubic-bezier(.22,1,.36,1)'; // --ease
