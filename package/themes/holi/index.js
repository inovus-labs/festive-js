// Minimal Holi theme: powder and rangoli modes only. Small footprint, no libs.
export const metadata = {
  name: 'Holi - Festival of Colors',
  version: '1.0.0',
}

export const params = {
  mode: { type: 'string', default: 'powder', options: ['powder', 'rangoli', 'splash'] },
  intensity: { type: 'number', default: 1, min: 0.5, max: 2 },
  particleCount: { type: 'number', default: 40, min: 10, max: 150 },
  patternCount: { type: 'number', default: 3, min: 1, max: 6 },
  splashBurst: { type: 'number', default: 1, min: 1, max: 8 },
}

export const autoTrigger = { type: 'range', monthStart: 3, dayStart: 1, monthEnd: 3, dayEnd: 31 }

const COLORS = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF8C42','#FF1493']

function makeCanvas(root) {
  const c = document.createElement('canvas')
  c.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:9999;'
  c.width = window.innerWidth
  c.height = window.innerHeight
  const parent = root || document.body
  if (parent && parent.appendChild) parent.appendChild(c)
  return c
}

function powderRunner(root, opts) {
  const canvas = makeCanvas(root)
  const ctx = canvas.getContext('2d')
  const particles = []
  let raf = null

  function emit() {
    const rate = Math.max(1, Math.round((opts.particleCount||40) * (opts.intensity||1) / 30))
    for (let i=0;i<rate;i++) particles.push({
      x: Math.random()*canvas.width, y: -10,
      vx: (Math.random()-0.5)*2, vy: 0.5+Math.random(),
      size: 2+Math.random()*6, color: COLORS[(Math.random()*COLORS.length)|0], life:1
    })
  }

  function frame(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    emit()
    for (let i=particles.length-1;i>=0;i--){
      const p = particles[i]
      p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.life -= 0.01
      ctx.globalAlpha = Math.max(0, p.life)
      ctx.fillStyle = p.color
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill()
      if (p.life<=0 || p.y>canvas.height+50) particles.splice(i,1)
    }
    raf = requestAnimationFrame(frame)
  }
  frame()

  function stop(){ if (raf) cancelAnimationFrame(raf); canvas.remove() }
  return { stop }
}

function rangoliRunner(root, opts){
  const container = document.createElement('div')
  container.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:9998;'
  const parent = root || document.body
  if (parent && parent.appendChild) parent.appendChild(container)
  const timers = []
  function make(x,y){
    // Geometric Rangoli: polygon (hexagon/star) with small dots around
    const s = 56 + (Math.random()*72|0)
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg')
    svg.setAttribute('width',s); svg.setAttribute('height',s)
    svg.style.cssText = 'position:absolute;left:' + (x-s/2) + 'px;top:' + (y-s/2) + 'px;opacity:0;transition:opacity .3s,transform 4s;transform:scale(.75)'
    const cx = s/2, cy = s/2
    const sides = 6 + ((opts.patternCount||3)|0) % 3 // vary sides a bit
    const r = s*0.28
    // build polygon points
    let pts = []
    for (let i=0;i<sides;i++){ const a = (i/sides)*Math.PI*2; pts.push((cx+Math.cos(a)*r)+','+(cy+Math.sin(a)*r)) }
    const poly = document.createElementNS('http://www.w3.org/2000/svg','polygon')
    poly.setAttribute('points', pts.join(' '))
    poly.setAttribute('fill', 'none')
    poly.setAttribute('stroke', COLORS[(Math.random()*COLORS.length)|0])
    poly.setAttribute('stroke-width', Math.max(1, s*0.04))
    poly.setAttribute('opacity', '0.9')
    svg.appendChild(poly)
    // inner star (alternate vertices)
    if (sides>=5){
      let starPts=[]
      for (let i=0;i<sides;i++){ const a=(i/sides)*Math.PI*2; const rr = (i%2===0? r*0.55 : r*0.25); starPts.push((cx+Math.cos(a)*rr)+','+(cy+Math.sin(a)*rr)) }
      const star = document.createElementNS('http://www.w3.org/2000/svg','polygon')
      star.setAttribute('points', starPts.join(' '))
      star.setAttribute('fill', COLORS[(Math.random()*COLORS.length)|0])
      star.setAttribute('opacity', '0.9')
      svg.appendChild(star)
    }
    // decorative dots around
    const dotCount = 6
    for (let i=0;i<dotCount;i++){ const a=(i/dotCount)*Math.PI*2; const dx=cx+Math.cos(a)*(r+ s*0.12); const dy=cy+Math.sin(a)*(r+ s*0.12); const d = document.createElementNS('http://www.w3.org/2000/svg','circle'); d.setAttribute('cx',dx); d.setAttribute('cy',dy); d.setAttribute('r',Math.max(2, s*0.03)); d.setAttribute('fill', COLORS[(Math.random()*COLORS.length)|0]); d.setAttribute('opacity','0.95'); svg.appendChild(d) }
    container.appendChild(svg)
    requestAnimationFrame(()=>{ svg.style.opacity=0.95; svg.style.transform='scale(1) rotate('+(Math.random()*30-15)+'deg)'; })
    timers.push(setTimeout(()=>{ svg.style.opacity=0; setTimeout(()=>svg.remove(),500) }, 4200))
  }
  for (let i=0;i<(opts.patternCount||3);i++) {
    timers.push(setTimeout(()=>make(Math.random()*window.innerWidth, Math.random()*window.innerHeight), i*500))
  }
  timers.push(setInterval(()=>make(Math.random()*window.innerWidth, Math.random()*window.innerHeight), 2000))
  return { stop(){ timers.forEach(t=>clearInterval(t)); if (container && container.remove) container.remove() } }
}

function splashRunner(root, opts){
  const cont = document.createElement('div')
  cont.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:9997;'
  const parent = root || document.body
  if (parent && parent.appendChild) parent.appendChild(cont)
  // track droplet elements for cleanup (store element refs)
  const droplets = new Set()
  const spawn = () => {
    // number of simultaneous splash centers per spawn (burst)
    const burst = Math.max(1, Math.round(opts.splashBurst || 1))
    for (let b = 0; b < burst; b++) {
      const x = Math.random()*window.innerWidth
      const y = Math.random()*(window.innerHeight*0.6)
      const color = COLORS[(Math.random()*COLORS.length)|0]
      const count = Math.max(4, Math.round((opts.splashCount||8) * (opts.intensity||1)))
      for (let i=0;i<count;i++){
        const d = document.createElement('div')
        d.style.cssText = 'position:absolute;width:6px;height:6px;border-radius:50%;pointer-events:none;transition:opacity .2s linear;'
        d.style.background = color
        // add a small jitter so droplets from the same burst don't stack exactly
        const jitterX = (Math.random()-0.5) * 18
        const jitterY = (Math.random()-0.5) * 8
        d.style.left = (x + jitterX) + 'px'
        d.style.top = (y + jitterY) + 'px'
        cont.appendChild(d)
        let vx = (Math.random()*2-1)*2* (opts.intensity||1)
        let vy = (Math.random()*-1.5)* (opts.intensity||1)
        let life = 1
        function step(){
          vy += 0.08
          vx *= 0.99
          vy *= 0.99
          const left = parseFloat(d.style.left) + vx
          const top = parseFloat(d.style.top) + vy
          d.style.left = left + 'px'
          d.style.top = top + 'px'
          life -= 0.02
          d.style.opacity = Math.max(0, life)
          if (life>0 && top < window.innerHeight + 50) {
            const rafId = requestAnimationFrame(step)
            d._holiRaf = rafId
            droplets.add(d)
          } else {
            try{ d.remove() }catch(e){}
            droplets.delete(d)
          }
        }
        step()
      }
    }
  }
  const interval = setInterval(spawn, Math.max(300, 1200 / (opts.intensity||1)))
  // initial burst
  spawn()
  return { stop(){ clearInterval(interval); droplets.forEach(el=>{ if (el._holiRaf) cancelAnimationFrame(el._holiRaf); if (el && el.remove) el.remove() }); if (cont && cont.remove) cont.remove() } }
}

function apply(root, common={}, options={}){
  const opts = Object.assign({}, {mode:params.mode.default, intensity:1, particleCount:40, patternCount:3}, options)
  try { console.debug('[holi] apply', opts.mode, opts) } catch (e) {}
  const mount = root || document.getElementById('festive-js-root') || document.body
  const runners = []
  if (opts.mode === 'powder') runners.push(powderRunner(mount, opts))
  if (opts.mode === 'rangoli') runners.push(rangoliRunner(mount, opts))
  if (opts.mode === 'splash') runners.push(splashRunner(mount, opts))

  return function cleanup(){ runners.forEach(r=>r.stop&&r.stop()) }
}

export default { key: 'holi', name: metadata.name, triggers: [autoTrigger], params, apply }