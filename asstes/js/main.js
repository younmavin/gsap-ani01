gsap.registerPlugin(ScrollTrigger)

//////////////////////////////////////////
// lenis scroll
//////////////////////////////////////////
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
})

const raf = (time) => {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

//////////////////////////////////////////
// util
//////////////////////////////////////////
const splitChars = (el, className) => {
  const chars = el.textContent.split('')
  el.innerHTML = chars.map((char) => `<span class="${className}">${char === ' ' ? '&nbsp;' : char}</span>`).join('')
}

const splitNodes = (el, className) => {
  el.innerHTML = Array.from(el.childNodes)
    .map((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim()
        if (!text) return ''
        return text
          .split('')
          .map((char) => `<span class="${className}">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('')
      }
      if (node.nodeName === 'BR') return '<br>'
      if (node.nodeName === 'SPAN') {
        return node.textContent
          .split('')
          .map((char) => `<span class="${className} tit-point">${char === ' ' ? '&nbsp;' : char}</span>`)
          .join('')
      }
      return ''
    })
    .join('')
}

const splitSec02Title = (el) => {
  el.innerHTML = el.textContent
    .split('')
    .map((char, i) => `<span class="char-s ${i % 2 === 0 ? 'even' : 'odd'}">${char === ' ' ? '&nbsp;' : char}</span>`)
    .join('')
}

//////////////////////////////////////////
// language (애니메이션보다 먼저 실행)
//////////////////////////////////////////
function setLang(lang) {
  document.documentElement.setAttribute('lang', lang) // ← 추가
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n
    if (!i18n[lang][key]) return
    el.innerHTML = i18n[lang][key].replace(/\n/g, '<br>')
  })
  localStorage.setItem('lang', lang)
}

const savedLang = localStorage.getItem('lang') || 'en'
document.querySelector('#lang-select').value = savedLang
setLang(savedLang) // ← 애니메이션 등록 전에 텍스트 먼저 세팅

//////////////////////////////////////////
// section01
//////////////////////////////////////////
splitNodes(document.querySelector('.sec01 .tit'), 'char')

gsap.from('.sec01 .char', {
  scrollTrigger: {
    trigger: '.sec01',
    start: 'top 80%',
    toggleActions: 'play none none reverse',
  },
  opacity: 0,
  y: 40,
  rotation: 3,
  stagger: 0.05,
  duration: 0.8,
  ease: 'power3.out',
})

gsap.from('.sec01 h6', {
  scrollTrigger: {
    trigger: '.sec01',
    start: 'top 60%',
    toggleActions: 'play none none reverse',
  },
  opacity: 0,
  y: 50,
  duration: 2,
  delay: 1.5,
  ease: 'power3.out',
})

//////////////////////////////////////////
// section02
//////////////////////////////////////////
const cont01Title = document.querySelector('.sec02 .cont01 hgroup h1')
splitSec02Title(cont01Title)

gsap.to('.sec02 .bg .ani', {
  scrollTrigger: { trigger: '.sec02', start: 'top top', end: '+=800', scrub: 1 },
  backgroundColor: 'transparent',
  ease: 'none',
})

gsap.utils.toArray('.sec02 .cont01 .char-s').forEach((char, i) => {
  gsap.from(char, {
    scrollTrigger: {
      trigger: '.sec02 .cont01',
      start: `top+=${i * 30} 70%`,
      end: `top+=${i * 40 + 70} 70%`,
      scrub: 1,
    },
    opacity: 0,
    y: i % 2 === 0 ? -80 : 80,
    ease: 'power3.out',
  })
})

gsap.from('.sec02 .cont02 hgroup', {
  scrollTrigger: {
    trigger: '.sec02 .cont02',
    start: 'top 10%',
    toggleActions: 'play none none reverse',
  },
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
})

gsap.to('.sec02 .cont01 .img-bx', {
  y: -30,
  duration: 1.2,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
})

//////////////////////////////////////////
// section03
//////////////////////////////////////////
splitNodes(document.querySelector('.sec03 .tit'), 'char2')

gsap.to('.sec03-bg', {
  scrollTrigger: { trigger: '.sec03', start: 'top top', end: '+=2000', scrub: 1 },
  x: '-20%',
  ease: 'none',
})

gsap.from('.sec03 .char2', {
  scrollTrigger: { trigger: '.sec03', start: 'top top', end: '+=2000', pin: true, scrub: 1 },
  opacity: 0,
  y: (i, el, arr) => Math.sin((i / arr.length) * Math.PI) * -80,
  stagger: 0.1,
  ease: 'power3.out',
})

//////////////////////////////////////////
// section04
//////////////////////////////////////////
gsap.set('.sec04 .bg img:nth-child(3)', { opacity: 0, zIndex: 2 })

const sec04ImgTrigger = (imgOut, imgIn, trigger) => {
  const config = { trigger, start: 'top center', end: 'bottom center', scrub: 1 }
  gsap.to(imgOut, { scrollTrigger: config, opacity: 0 })
  gsap.to(imgIn, { scrollTrigger: config, opacity: 1 })
}

sec04ImgTrigger('.sec04 .bg img:nth-child(1)', '.sec04 .bg img:nth-child(2)', '.sec04 .cont02')

gsap.to('.sec04 .bg img:nth-child(3)', {
  scrollTrigger: { trigger: '.sec04 .cont03', start: 'top center', end: 'bottom center', scrub: 1 },
  opacity: 1,
})

gsap
  .timeline({
    scrollTrigger: {
      trigger: '.sec04 .cont04',
      start: 'top top',
      end: '+=3000',
      pin: true,
      scrub: 1,
      pinSpacing: true,
    },
  })
  .from('.sec04 .cont04 .img-bx', { scale: 0.05, opacity: 0, duration: 2, ease: 'power3.out' }, 0)
  .to('.sec04 .cont04 .line:nth-child(1)', { opacity: 1, duration: 0.3 }, 2.2)
  .to('.sec04 .cont04 .line:nth-child(2)', { opacity: 1, duration: 0.3 }, 2.6)
  .to('.sec04 .cont04 .line:nth-child(3)', { opacity: 1, duration: 0.3 }, 3.0)
  .to('.sec04 .cont04 .line:nth-child(4)', { opacity: 1, duration: 0.3 }, 3.4)

//////////////////////////////////////////
// section05
//////////////////////////////////////////
ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' })

const slideItems = gsap.utils.toArray('.card')
const scrollTween = gsap.to(slideItems, {
  xPercent: -120 * (slideItems.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-sliders',
    start: 'top top',
    anticipatePin: 1,
    invalidateOnRefresh: true,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    end: '+=2000',
  },
})

document.querySelectorAll('.horizontal-sliders .card').forEach((el) => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      containerAnimation: scrollTween,
      start: 'left center',
      toggleActions: 'play none none none',
      toggleClass: 'active',
    },
  })
})

window.addEventListener('resize', () => ScrollTrigger.refresh())

document.querySelectorAll('.btn-link').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    alert('Coming soon!')
  })
})

const btnTop = document.querySelector('.btn-top')
gsap.set(btnTop, { opacity: 0, pointerEvents: 'none' })

btnTop.addEventListener('click', () => {
  lenis.scrollTo(0, { duration: 0.5 })
})

ScrollTrigger.create({
  trigger: '.sec01',
  start: 'top top',
  end: 'bottom top',
  onEnter: () => gsap.to(btnTop, { opacity: 0, pointerEvents: 'none', duration: 0.1 }),
  onLeave: () => gsap.to(btnTop, { opacity: 1, pointerEvents: 'auto', duration: 0.1 }),
  onEnterBack: () => gsap.to(btnTop, { opacity: 1, pointerEvents: 'auto', duration: 0.1 }),
  onLeaveBack: () => gsap.to(btnTop, { opacity: 0, pointerEvents: 'none', duration: 0.1 }),
})

//////////////////////
// top scroll progress bar
//////////////////////
const scrollProgress = document.querySelector('.scroll-progress')

lenis.on('scroll', ({ progress }) => {
  gsap.to(scrollProgress, {
    width: `${progress * 100}%`,
    duration: 0.1,
    ease: 'none',
  })
})

//////////////////////////////////////////
// 언어 전환 이벤트 (언어 변경 시 새로고침)
//////////////////////////////////////////
document.querySelector('#lang-select').addEventListener('change', (e) => {
  localStorage.setItem('lang', e.target.value)
  location.reload() // 페이지 새로고침으로 모든 애니메이션 재등록
})
