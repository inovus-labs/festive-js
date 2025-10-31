// April Fool's Day: Playful pranks and chaos
export const metadata = {
  name: 'April Fools - Pranks & Chaos',
  version: '1.0.0',
}

export const params = {
  mode: { type: 'string', default: 'confetti', options: ['confetti', 'cursor', 'glitch', 'combo'] },
  intensity: { type: 'number', default: 1, min: 0.5, max: 2 },
  prankLevel: { type: 'number', default: 2, min: 1, max: 3 }, // 1=mild, 2=medium, 3=chaos
}

export const autoTrigger = { type: 'range', monthStart: 4, dayStart: 1, monthEnd: 4, dayEnd: 1 }

const COLORS = ['#FF6B9D', '#C44569', '#FFC312', '#12CBC4', '#A3CB38', '#FDA7DF', '#ED4C67']

function makeCanvas(root) {
  const c = document.createElement('canvas')
  c.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:99999;width:100%;height:100%;'
  c.width = window.innerWidth
  c.height = window.innerHeight
  const parent = root || document.body
  if (parent && parent.appendChild) parent.appendChild(c)
  return c
}

// MODE 1: Confetti Explosion
function confettiRunner(root, opts) {
  const canvas = makeCanvas(root)
  const ctx = canvas.getContext('2d')
  const particles = []
  let raf = null

  function explode(x, y) {
    const count = Math.round(30 * (opts.intensity || 1))
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const speed = 3 + Math.random() * 4
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        size: 4 + Math.random() * 8,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        life: 1
      })
    }
  }

  // Auto explosions
  function autoExplode() {
    if (Math.random() < 0.3 * (opts.intensity || 1)) {
      explode(Math.random() * canvas.width, Math.random() * canvas.height * 0.6)
    }
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    autoExplode()

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.15 // gravity
      p.vx *= 0.99
      p.rotation += p.rotSpeed
      p.life -= 0.008

      ctx.save()
      ctx.globalAlpha = Math.max(0, p.life)
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillStyle = p.color

      if (p.shape === 'circle') {
        ctx.beginPath()
        ctx.arc(0, 0, p.size, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
      }
      ctx.restore()

      if (p.life <= 0 || p.y > canvas.height + 50) {
        particles.splice(i, 1)
      }
    }
    raf = requestAnimationFrame(frame)
  }
  frame()

  // Click explosions
  function handleClick(e) {
    explode(e.clientX, e.clientY)
  }
  document.addEventListener('click', handleClick)

  function stop() {
    if (raf) cancelAnimationFrame(raf)
    document.removeEventListener('click', handleClick)
    canvas.remove()
  }
  return { stop }
}

// MODE 2: Cursor Chaos
function cursorRunner(root, opts) {
  const cursors = []
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99998;'
  const parent = root || document.body
  if (parent && parent.appendChild) parent.appendChild(container)

  const cursorStyles = ['👆', '🤡', '🎉', '🎪', '🤹', '🎭', '🎨', '🎲']
  let mouseX = window.innerWidth / 2
  let mouseY = window.innerHeight / 2

  function handleMove(e) {
    mouseX = e.clientX
    mouseY = e.clientY
  }
  document.addEventListener('mousemove', handleMove)

  function spawnCursor() {
    const cursor = document.createElement('div')
    cursor.textContent = cursorStyles[(Math.random() * cursorStyles.length) | 0]
    cursor.style.cssText = `position:absolute;font-size:24px;pointer-events:none;transition:opacity 0.3s;`
    cursor.style.left = mouseX + (Math.random() - 0.5) * 40 + 'px'
    cursor.style.top = mouseY + (Math.random() - 0.5) * 40 + 'px'
    container.appendChild(cursor)
    cursors.push(cursor)

    setTimeout(() => {
      cursor.style.opacity = '0'
      setTimeout(() => cursor.remove(), 300)
    }, 500 + Math.random() * 500)
  }

  const interval = setInterval(spawnCursor, 150 / (opts.intensity || 1))

  function stop() {
    clearInterval(interval)
    document.removeEventListener('mousemove', handleMove)
    cursors.forEach(c => c.remove())
    container.remove()
  }
  return { stop }
}

// MODE 3: Screen Glitch
function glitchRunner(root, opts) {
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99997;mix-blend-mode:difference;'
  const parent = root || document.body
  if (parent && parent.appendChild) parent.appendChild(overlay)

  const strips = []
  for (let i = 0; i < 8; i++) {
    const strip = document.createElement('div')
    strip.style.cssText = 'position:absolute;width:100%;height:20px;opacity:0;transition:opacity 0.1s;'
    strip.style.background = COLORS[(Math.random() * COLORS.length) | 0]
    overlay.appendChild(strip)
    strips.push(strip)
  }

  function glitch() {
    const strip = strips[(Math.random() * strips.length) | 0]
    strip.style.top = Math.random() * window.innerHeight + 'px'
    strip.style.opacity = '0.3'
    strip.style.transform = `translateX(${(Math.random() - 0.5) * 20}px)`
    
    setTimeout(() => {
      strip.style.opacity = '0'
    }, 50 + Math.random() * 100)
  }

  const level = opts.prankLevel || 2
  const glitchInterval = setInterval(glitch, Math.max(200, 1000 / level / (opts.intensity || 1)))

  function stop() {
    clearInterval(glitchInterval)
    overlay.remove()
  }
  return { stop }
}

// MODE 4: Combo (All effects)
function comboRunner(root, opts) {
  const runners = [
    confettiRunner(root, { ...opts, intensity: (opts.intensity || 1) * 0.6 }),
    cursorRunner(root, { ...opts, intensity: (opts.intensity || 1) * 0.7 }),
    glitchRunner(root, { ...opts, prankLevel: Math.min(2, opts.prankLevel || 2) })
  ]

  return {
    stop() {
      runners.forEach(r => r.stop && r.stop())
    }
  }
}

function apply(root, common = {}, options = {}) {
  const opts = Object.assign({}, {
    mode: params.mode.default,
    intensity: 1,
    prankLevel: 2
  }, options)

  try { console.debug('[april-fools] apply', opts.mode, opts) } catch (e) {}

  const mount = root || document.getElementById('festive-js-root') || document.body
  let runner = null

  if (opts.mode === 'confetti') runner = confettiRunner(mount, opts)
  else if (opts.mode === 'cursor') runner = cursorRunner(mount, opts)
  else if (opts.mode === 'glitch') runner = glitchRunner(mount, opts)
  else if (opts.mode === 'combo') runner = comboRunner(mount, opts)

  return function cleanup() {
    if (runner && runner.stop) runner.stop()
  }
}

export default {
  key: 'april-fools',
  name: metadata.name,
  triggers: [autoTrigger],
  params,
  apply
}
