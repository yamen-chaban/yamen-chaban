/* Progressive enhancement: content stays visible if JS is disabled. */
(()=>{"use strict";const root=document.documentElement,btn=document.querySelector(".theme-toggle"),key="yc-portfolio-theme";
let stored;try{stored=localStorage.getItem(key)}catch(e){}
function setTheme(theme){root.dataset.theme=theme;if(btn){btn.setAttribute("aria-pressed",String(theme==="light"));btn.textContent=theme==="light"?"Dunkelmodus":"Hellmodus"}}
setTheme(stored==="light"?"light":"dark");root.classList.add("js-ready");
if(btn)btn.addEventListener("click",()=>{const next=root.dataset.theme==="light"?"dark":"light";setTheme(next);try{localStorage.setItem(key,next)}catch(e){}});
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
if(!reduced.matches&&"IntersectionObserver" in window){const reveal=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add("motion-enter");reveal.unobserve(e.target)}}},{threshold:.12});document.querySelectorAll("main section > h2, main .card, main .entry, main .hire").forEach(el=>{if(el.getBoundingClientRect().top>window.innerHeight)reveal.observe(el)});document.querySelectorAll(".hero h1,.hero .role,.hero-visual").forEach(el=>el.classList.add("motion-enter"))}
const bar=document.querySelector(".reading-progress");let queued=false;
function update(){queued=false;const max=document.documentElement.scrollHeight-window.innerHeight;if(bar)bar.style.transform="scaleX("+Math.min(1,Math.max(0,max>0?window.scrollY/max:0))+")"}
function onScroll(){if(!queued){queued=true;requestAnimationFrame(update)}}window.addEventListener("scroll",onScroll,{passive:true});window.addEventListener("resize",onScroll,{passive:true});update();
const anchors=Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
if(anchors.length&&"IntersectionObserver" in window){const active=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){for(const a of anchors){if(a.hash==="#"+e.target.id)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current")}}}},{rootMargin:"-15% 0px -65% 0px"});for(const a of anchors){const target=document.getElementById(a.hash.slice(1));if(target)active.observe(target)}}
})();