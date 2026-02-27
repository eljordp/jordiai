import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'

interface Props {
  cameraMode: 'idle' | 'desk' | 'monitor'
  onResourcesLoaded: () => void
  onClickOutside: () => void
  onEnterMonitor: () => void
}

const KEYFRAMES = {
  idle: {
    position: { x: 550, y: 420, z: 650 },
    lookAt: { x: 0, y: 180, z: -50 },
  },
  desk: {
    position: { x: 60, y: 320, z: 380 },
    lookAt: { x: 0, y: 240, z: -60 },
  },
  monitor: {
    position: { x: 0, y: 280, z: 140 },
    lookAt: { x: 0, y: 268, z: -55 },
  },
}

export default function Scene3D({ cameraMode, onResourcesLoaded, onClickOutside, onEnterMonitor }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const lookAtTarget = useRef(new THREE.Vector3(0, 180, -50))
  const screenRef = useRef<THREE.Mesh | null>(null)
  const frameRef = useRef<number>(0)
  const mousePos = useRef({ x: 0, y: 0 })
  const cameraModeRef = useRef(cameraMode)
  const monitorGlowRef = useRef<THREE.PointLight | null>(null)
  const scanLineMeshRef = useRef<THREE.Mesh | null>(null)
  const lampOnRef = useRef(true)
  const lampGroupRef = useRef<THREE.Group | null>(null)

  cameraModeRef.current = cameraMode

  const transitionCamera = useCallback((mode: 'idle' | 'desk' | 'monitor') => {
    const camera = cameraRef.current
    if (!camera) return
    const target = KEYFRAMES[mode]
    const duration = mode === 'monitor' ? 800 : 1200
    TWEEN.removeAll()
    new TWEEN.Tween(camera.position)
      .to(target.position, duration)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start()
    new TWEEN.Tween(lookAtTarget.current)
      .to(target.lookAt, duration)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start()
  }, [])

  useEffect(() => {
    transitionCamera(cameraMode)
  }, [cameraMode, transitionCamera])

  useEffect(() => {
    if (!containerRef.current) return

    // ── Scene ──
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x8899aa)

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 5000)
    camera.position.set(550, 420, 650)
    cameraRef.current = camera

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.8
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // ── Materials ──
    const darkWood = new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 0.7, metalness: 0.05 })
    const lightWood = new THREE.MeshStandardMaterial({ color: 0x6d4c3a, roughness: 0.65, metalness: 0.05 })
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.25, metalness: 0.85 })
    const chrome = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.15, metalness: 0.95 })
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x778899, roughness: 0.95, metalness: 0.0 })
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x554840, roughness: 0.85, metalness: 0.05 })
    const fabric = new THREE.MeshStandardMaterial({ color: 0x333344, roughness: 0.9, metalness: 0 })
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf0ece8, roughness: 0.7 })
    const blackPlastic = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.3 })

    // ── Lighting ──
    // Light mode: bright room
    const ambient = new THREE.AmbientLight(0xffffff, 1.5)
    scene.add(ambient)

    const hemi = new THREE.HemisphereLight(0xddeeff, 0x8B7355, 1.2)
    scene.add(hemi)

    // Desk lamp (warm) — the main togglable light
    const deskLamp = new THREE.PointLight(0xffcc88, 200000, 1200, 2)
    deskLamp.position.set(-200, 420, 60)
    deskLamp.castShadow = true
    deskLamp.shadow.mapSize.set(1024, 1024)
    deskLamp.shadow.radius = 4
    scene.add(deskLamp)

    // Monitor glow (teal/blue)
    const monitorGlow = new THREE.PointLight(0x66ccdd, 60000, 600, 2)
    monitorGlow.position.set(0, 300, 20)
    scene.add(monitorGlow)
    monitorGlowRef.current = monitorGlow

    // Rim light (purple accent)
    const rimLight = new THREE.SpotLight(0x8855cc, 80000, 1500, Math.PI / 6, 0.5, 2)
    rimLight.position.set(400, 600, -300)
    rimLight.target.position.set(0, 200, 0)
    scene.add(rimLight)
    scene.add(rimLight.target)

    // Fill light
    const fillLight = new THREE.PointLight(0x88aacc, 40000, 1200, 2)
    fillLight.position.set(-300, 50, 300)
    scene.add(fillLight)

    // Overhead room light
    const ceilingLight = new THREE.PointLight(0xffeedd, 300000, 1500, 2)
    ceilingLight.position.set(0, 900, 100)
    ceilingLight.castShadow = true
    scene.add(ceilingLight)

    // Window daylight
    const dayLight = new THREE.DirectionalLight(0xffffff, 2.0)
    dayLight.position.set(-500, 800, 200)
    dayLight.castShadow = true
    scene.add(dayLight)

    // ── Lamp toggle state ──
    let lampIsOn = lampOnRef.current
    const bulbColor = { on: 0xffcc66, off: 0x333333 }

    const setLightMode = (on: boolean) => {
      lampIsOn = on
      lampOnRef.current = on
      // Light mode = lamp on = bright room
      ambient.intensity = on ? 1.5 : 0.15
      hemi.intensity = on ? 1.2 : 0.2
      deskLamp.intensity = on ? 200000 : 80000
      ceilingLight.intensity = on ? 300000 : 0
      dayLight.intensity = on ? 2.0 : 0.0
      fillLight.intensity = on ? 40000 : 10000
      rimLight.intensity = on ? 80000 : 40000
      scene.background = new THREE.Color(on ? 0x8899aa : 0x050508)
    }

    // ── Room ──
    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Back wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(2000, 1000), wallMat)
    backWall.position.set(0, 500, -350)
    backWall.receiveShadow = true
    scene.add(backWall)

    // Left wall
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(2000, 1000), wallMat)
    leftWall.position.set(-600, 500, 0)
    leftWall.rotation.y = Math.PI / 2
    scene.add(leftWall)

    // Right wall
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(2000, 1000), wallMat)
    rightWall.position.set(600, 500, 0)
    rightWall.rotation.y = -Math.PI / 2
    scene.add(rightWall)

    // Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshStandardMaterial({ color: 0x0e0e14, roughness: 0.95 })
    )
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.y = 1000
    scene.add(ceiling)

    // ── Desk ──
    // Desktop surface
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(520, 14, 260), darkWood)
    deskTop.position.set(0, 162, -10)
    deskTop.castShadow = true
    deskTop.receiveShadow = true
    scene.add(deskTop)

    // Desk front panel
    const deskFront = new THREE.Mesh(new THREE.BoxGeometry(520, 140, 8), lightWood)
    deskFront.position.set(0, 82, 120)
    scene.add(deskFront)

    // Desk side panels
    ;[[-256, 82, -10], [256, 82, -10]].forEach(([x, y, z]) => {
      const side = new THREE.Mesh(new THREE.BoxGeometry(8, 140, 260), lightWood)
      side.position.set(x, y, z)
      side.castShadow = true
      scene.add(side)
    })

    // Desk back panel
    const deskBack = new THREE.Mesh(new THREE.BoxGeometry(520, 60, 8), lightWood)
    deskBack.position.set(0, 50, -136)
    scene.add(deskBack)

    // Desk drawer (right side)
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(160, 100, 240), lightWood)
    drawer.position.set(170, 62, -10)
    scene.add(drawer)
    // Drawer handle
    const handle = new THREE.Mesh(new THREE.BoxGeometry(40, 4, 4), chrome)
    handle.position.set(170, 90, 112)
    scene.add(handle)

    // ── Monitor ──
    // Monitor body (thicker bezel)
    const monitorGroup = new THREE.Group()
    monitorGroup.position.set(0, 0, -55)
    scene.add(monitorGroup)

    // Back casing
    const monitorBack = new THREE.Mesh(new THREE.BoxGeometry(290, 180, 20), darkMetal)
    monitorBack.position.set(0, 310, 0)
    monitorBack.castShadow = true
    monitorGroup.add(monitorBack)

    // Bezel frame (slightly larger, dark)
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.3, metalness: 0.7 })
    // Top bezel
    const bezelTop = new THREE.Mesh(new THREE.BoxGeometry(292, 12, 3), bezelMat)
    bezelTop.position.set(0, 396, 12)
    monitorGroup.add(bezelTop)
    // Bottom bezel
    const bezelBot = new THREE.Mesh(new THREE.BoxGeometry(292, 16, 3), bezelMat)
    bezelBot.position.set(0, 216, 12)
    monitorGroup.add(bezelBot)
    // Left bezel
    const bezelL = new THREE.Mesh(new THREE.BoxGeometry(10, 180, 3), bezelMat)
    bezelL.position.set(-141, 310, 12)
    monitorGroup.add(bezelL)
    // Right bezel
    const bezelR = new THREE.Mesh(new THREE.BoxGeometry(10, 180, 3), bezelMat)
    bezelR.position.set(141, 310, 12)
    monitorGroup.add(bezelR)

    // Screen with OS preview texture
    const screenGeo = new THREE.PlaneGeometry(270, 164)

    // Draw OS preview on a canvas
    const previewCanvas = document.createElement('canvas')
    previewCanvas.width = 1024
    previewCanvas.height = 640
    const ctx = previewCanvas.getContext('2d')!

    // Desktop background
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 640)
    bgGrad.addColorStop(0, '#0d1b2a')
    bgGrad.addColorStop(0.5, '#1b2838')
    bgGrad.addColorStop(1, '#0d1b2a')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 1024, 640)

    // Desktop icons
    const iconData = [
      { label: 'Showcase', y: 30 },
      { label: 'About Me', y: 110 },
      { label: 'Projects', y: 190 },
      { label: 'Contact', y: 270 },
    ]
    iconData.forEach(({ label, y }) => {
      ctx.fillStyle = 'rgba(200,200,200,0.15)'
      ctx.fillRect(16, y, 56, 50)
      ctx.strokeStyle = 'rgba(200,200,200,0.3)'
      ctx.strokeRect(16, y, 56, 50)
      ctx.fillStyle = '#fff'
      ctx.font = '11px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(label, 44, y + 68)
    })

    // Window
    const wx = 100, wy = 16, ww = 680, wh = 540
    // Window shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fillRect(wx + 4, wy + 4, ww, wh)
    // Window body
    ctx.fillStyle = '#c0c0c0'
    ctx.fillRect(wx, wy, ww, wh)
    // Title bar
    const titleGrad = ctx.createLinearGradient(wx, wy, wx + ww, wy)
    titleGrad.addColorStop(0, '#000080')
    titleGrad.addColorStop(1, '#1084d0')
    ctx.fillStyle = titleGrad
    ctx.fillRect(wx, wy, ww, 24)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 13px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('Jordi - Showcase 2025', wx + 8, wy + 17)
    // Title buttons
    ctx.fillStyle = '#c0c0c0'
    ;[ww - 20, ww - 40, ww - 60].forEach(bx => {
      ctx.fillRect(wx + bx, wy + 4, 16, 16)
      ctx.strokeStyle = '#808080'
      ctx.strokeRect(wx + bx, wy + 4, 16, 16)
    })
    // Menu bar
    ctx.fillStyle = '#c0c0c0'
    ctx.fillRect(wx, wy + 24, ww, 20)
    ctx.fillStyle = '#000'
    ctx.font = '11px monospace'
    ctx.fillText('File   Edit   View   Help', wx + 8, wy + 38)
    // Content area
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(wx + 4, wy + 48, ww - 8, wh - 80)
    // Content text
    ctx.fillStyle = '#000'
    ctx.font = 'bold 36px monospace'
    ctx.fillText('Jordi', wx + 28, wy + 105)
    ctx.font = '14px monospace'
    ctx.fillStyle = '#444'
    ctx.fillText('AI Engineer & Software Developer', wx + 28, wy + 130)
    // Separator
    ctx.fillStyle = '#000080'
    ctx.fillRect(wx + 28, wy + 145, 200, 3)
    // Bio text
    ctx.fillStyle = '#333'
    ctx.font = '12px monospace'
    const bioLines = [
      "I'm an AI Engineer passionate about building",
      'innovative digital experiences. I specialize in',
      'building websites, crafting software solutions,',
      'and developing AI automations.',
    ]
    bioLines.forEach((line, i) => {
      ctx.fillText(line, wx + 28, wy + 175 + i * 18)
    })
    // Section
    ctx.fillStyle = '#000'
    ctx.font = 'bold 16px monospace'
    ctx.fillText('PROJECTS', wx + 28, wy + 270)
    ctx.fillStyle = '#000080'
    ctx.fillRect(wx + 28, wy + 278, 120, 2)
    // Category cards
    const cards = [
      { title: 'Websites', desc: 'Web design & dev', x: wx + 28 },
      { title: 'Software', desc: 'Custom apps & tools', x: wx + 250 },
      { title: 'Contact', desc: 'Get in touch', x: wx + 472 },
    ]
    cards.forEach(({ title, desc, x }) => {
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(x, wy + 295, 190, 70)
      ctx.strokeStyle = '#d0d0d0'
      ctx.strokeRect(x, wy + 295, 190, 70)
      ctx.fillStyle = '#000080'
      ctx.font = 'bold 13px monospace'
      ctx.fillText(title, x + 12, wy + 320)
      ctx.fillStyle = '#555'
      ctx.font = '11px monospace'
      ctx.fillText(desc, x + 12, wy + 340)
    })
    // Bottom links
    ctx.fillStyle = '#000080'
    ctx.font = '12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('About  |  Projects  |  Contact', wx + ww / 2, wy + wh - 60)
    ctx.textAlign = 'left'

    // Taskbar
    ctx.fillStyle = '#c0c0c0'
    ctx.fillRect(0, 608, 1024, 32)
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1
    ctx.strokeRect(0, 608, 1024, 1)
    // Start button
    ctx.fillStyle = '#c0c0c0'
    ctx.fillRect(4, 612, 64, 24)
    ctx.strokeStyle = '#dfdfdf'
    ctx.strokeRect(4, 612, 64, 24)
    ctx.fillStyle = '#000'
    ctx.font = 'bold 12px monospace'
    ctx.fillText('Start', 18, 628)
    // Taskbar item
    ctx.fillStyle = '#a0a0a0'
    ctx.fillRect(76, 612, 140, 24)
    ctx.fillStyle = '#000'
    ctx.font = '11px monospace'
    ctx.fillText('Showcase', 84, 628)
    // Clock
    ctx.fillStyle = '#c0c0c0'
    ctx.fillRect(924, 612, 96, 24)
    ctx.strokeStyle = '#808080'
    ctx.strokeRect(924, 612, 96, 24)
    ctx.fillStyle = '#000'
    ctx.font = '12px monospace'
    ctx.textAlign = 'right'
    const now = new Date()
    ctx.fillText(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }), 1012, 628)
    ctx.textAlign = 'left'

    const previewTexture = new THREE.CanvasTexture(previewCanvas)

    const screenMat = new THREE.MeshStandardMaterial({
      map: previewTexture,
      emissive: 0x444444,
      emissiveIntensity: 0.8,
      roughness: 0.05,
      metalness: 0.1,
    })
    const screen = new THREE.Mesh(screenGeo, screenMat)
    screen.position.set(0, 310, 12)
    screenRef.current = screen
    monitorGroup.add(screen)

    // Scan lines overlay
    const scanCanvas = document.createElement('canvas')
    scanCanvas.width = 1
    scanCanvas.height = 512
    const scanCtx = scanCanvas.getContext('2d')!
    for (let i = 0; i < 512; i++) {
      scanCtx.fillStyle = i % 3 === 0 ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0)'
      scanCtx.fillRect(0, i, 1, 1)
    }
    const scanTexture = new THREE.CanvasTexture(scanCanvas)
    scanTexture.wrapS = THREE.RepeatWrapping
    scanTexture.wrapT = THREE.RepeatWrapping
    scanTexture.repeat.set(1, 30)
    const scanMat = new THREE.MeshBasicMaterial({ map: scanTexture, transparent: true, opacity: 0.3, depthWrite: false })
    const scanMesh = new THREE.Mesh(new THREE.PlaneGeometry(270, 164), scanMat)
    scanMesh.position.set(0, 310, 12.5)
    scanLineMeshRef.current = scanMesh
    monitorGroup.add(scanMesh)

    // Screen reflection (subtle)
    const reflectionMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.02,
      depthWrite: false,
    })
    const reflection = new THREE.Mesh(new THREE.PlaneGeometry(270, 164), reflectionMat)
    reflection.position.set(0, 310, 13)
    monitorGroup.add(reflection)

    // Monitor stand
    const standNeck = new THREE.Mesh(new THREE.BoxGeometry(12, 55, 12), darkMetal)
    standNeck.position.set(0, 192, 0)
    monitorGroup.add(standNeck)

    const standBase = new THREE.Mesh(new THREE.CylinderGeometry(40, 45, 6, 24), darkMetal)
    standBase.position.set(0, 171, 0)
    monitorGroup.add(standBase)

    // ── Keyboard ──
    const kbGroup = new THREE.Group()
    kbGroup.position.set(-10, 170, 50)
    kbGroup.rotation.x = -0.05
    scene.add(kbGroup)

    const kbBase = new THREE.Mesh(new THREE.BoxGeometry(160, 5, 55), blackPlastic)
    kbBase.receiveShadow = true
    kbGroup.add(kbBase)

    // Keyboard keys (grid pattern)
    const keyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6, metalness: 0.3 })
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 14; col++) {
        const key = new THREE.Mesh(new THREE.BoxGeometry(9, 3, 8), keyMat)
        key.position.set(-65 + col * 10.5, 4, -18 + row * 10.5)
        kbGroup.add(key)
      }
    }
    // Spacebar
    const spacebar = new THREE.Mesh(new THREE.BoxGeometry(55, 3, 8), keyMat)
    spacebar.position.set(-5, 4, 24)
    kbGroup.add(spacebar)

    // ── Mouse ──
    const mouseGroup = new THREE.Group()
    mouseGroup.position.set(120, 170, 55)
    scene.add(mouseGroup)

    const mouseBody = new THREE.Mesh(
      new THREE.CapsuleGeometry(8, 14, 8, 12),
      darkMetal
    )
    mouseBody.rotation.x = Math.PI / 2
    mouseBody.rotation.z = Math.PI
    mouseBody.castShadow = true
    mouseGroup.add(mouseBody)

    // Mouse pad
    const pad = new THREE.Mesh(
      new THREE.BoxGeometry(80, 1, 80),
      new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.85 })
    )
    pad.position.set(0, -2, 0)
    mouseGroup.add(pad)

    // ── Desk Lamp (clickable — toggles light/dark) ──
    const lampGroup = new THREE.Group()
    lampGroup.position.set(-210, 170, 50)
    scene.add(lampGroup)
    lampGroupRef.current = lampGroup

    // Lamp base
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(20, 22, 6, 16), chrome)
    lampBase.castShadow = true
    lampGroup.add(lampBase)

    // Lamp arm
    const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 200, 8), chrome)
    lampArm.position.set(0, 100, -10)
    lampArm.rotation.z = 0.15
    lampGroup.add(lampArm)

    // Lamp shade
    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(28, 35, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.6, side: THREE.DoubleSide })
    )
    lampShade.position.set(15, 215, -10)
    lampShade.rotation.z = 0.15
    lampGroup.add(lampShade)

    // Lamp bulb glow
    const bulbMat = new THREE.MeshBasicMaterial({ color: bulbColor.on })
    const bulbGlow = new THREE.Mesh(new THREE.SphereGeometry(6, 8, 8), bulbMat)
    bulbGlow.position.set(15, 200, -10)
    lampGroup.add(bulbGlow)

    // ── Coffee Mug ──
    const mugGroup = new THREE.Group()
    mugGroup.position.set(-140, 170, 70)
    scene.add(mugGroup)

    const mugBody = new THREE.Mesh(
      new THREE.CylinderGeometry(11, 9, 26, 16),
      whiteMat
    )
    mugBody.position.y = 13
    mugBody.castShadow = true
    mugGroup.add(mugBody)

    // Mug handle
    const handleCurve = new THREE.TorusGeometry(7, 2, 8, 12, Math.PI)
    const mugHandle = new THREE.Mesh(handleCurve, whiteMat)
    mugHandle.position.set(12, 16, 0)
    mugHandle.rotation.y = Math.PI / 2
    mugGroup.add(mugHandle)

    // Coffee liquid
    const coffee = new THREE.Mesh(
      new THREE.CircleGeometry(9.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x3a1f0a, roughness: 0.3 })
    )
    coffee.rotation.x = -Math.PI / 2
    coffee.position.y = 25
    mugGroup.add(coffee)

    // ── Plant ──
    const plantGroup = new THREE.Group()
    plantGroup.position.set(210, 170, -70)
    scene.add(plantGroup)

    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(16, 12, 28, 8),
      new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.85 })
    )
    pot.position.y = 14
    pot.castShadow = true
    plantGroup.add(pot)

    // Soil
    const soil = new THREE.Mesh(
      new THREE.CircleGeometry(14, 8),
      new THREE.MeshStandardMaterial({ color: 0x2a1a0a, roughness: 0.95 })
    )
    soil.rotation.x = -Math.PI / 2
    soil.position.y = 27
    plantGroup.add(soil)

    // Plant leaves (multiple spheres for organic shape)
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.85 })
    const leafPositions = [
      [0, 48, 0, 18], [-8, 42, 6, 12], [10, 44, -4, 14],
      [-6, 55, -5, 10], [7, 52, 5, 11], [0, 60, 0, 8],
    ]
    leafPositions.forEach(([x, y, z, r]) => {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 6), leafMat)
      leaf.position.set(x, y, z)
      leaf.castShadow = true
      plantGroup.add(leaf)
    })

    // ── Books stack ──
    const bookColors = [0x8B0000, 0x00008B, 0x006400, 0x4B0082, 0xB8860B]
    bookColors.forEach((color, i) => {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(30 + Math.random() * 10, 6, 40),
        new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
      )
      book.position.set(-200, 172 + i * 7, -80)
      book.rotation.y = (Math.random() - 0.5) * 0.2
      book.castShadow = true
      scene.add(book)
    })

    // ── Shelf on wall ──
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(200, 8, 30), darkWood)
    shelf.position.set(-250, 450, -340)
    shelf.castShadow = true
    scene.add(shelf)

    // Items on shelf
    const shelfItem1 = new THREE.Mesh(
      new THREE.BoxGeometry(24, 35, 18),
      new THREE.MeshStandardMaterial({ color: 0x333340, roughness: 0.5 })
    )
    shelfItem1.position.set(-290, 472, -340)
    scene.add(shelfItem1)

    const shelfItem2 = new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8, 25, 12),
      new THREE.MeshStandardMaterial({ color: 0xcc6633, roughness: 0.7 })
    )
    shelfItem2.position.set(-240, 466, -340)
    scene.add(shelfItem2)

    const shelfItem3 = new THREE.Mesh(
      new THREE.SphereGeometry(12, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x4488aa, roughness: 0.3, metalness: 0.6 })
    )
    shelfItem3.position.set(-210, 466, -340)
    scene.add(shelfItem3)

    // ── Second Monitor (smaller, angled) ──
    const monitor2 = new THREE.Group()
    monitor2.position.set(-180, 0, -40)
    monitor2.rotation.y = 0.4
    scene.add(monitor2)

    const m2Back = new THREE.Mesh(new THREE.BoxGeometry(160, 110, 12), darkMetal)
    m2Back.position.set(0, 280, 0)
    monitor2.add(m2Back)

    const m2Screen = new THREE.Mesh(
      new THREE.PlaneGeometry(148, 98),
      new THREE.MeshStandardMaterial({ color: 0x0a1515, emissive: 0x061010, emissiveIntensity: 0.3, roughness: 0.1 })
    )
    m2Screen.position.set(0, 280, 7)
    monitor2.add(m2Screen)

    const m2Stand = new THREE.Mesh(new THREE.CylinderGeometry(18, 22, 5, 16), darkMetal)
    m2Stand.position.set(0, 171, 0)
    monitor2.add(m2Stand)

    const m2Neck = new THREE.Mesh(new THREE.BoxGeometry(8, 45, 8), darkMetal)
    m2Neck.position.set(0, 197, 0)
    monitor2.add(m2Neck)

    // ── Headphones on desk ──
    const hpGroup = new THREE.Group()
    hpGroup.position.set(180, 170, 60)
    scene.add(hpGroup)

    const headband = new THREE.Mesh(
      new THREE.TorusGeometry(18, 2.5, 8, 24, Math.PI),
      darkMetal
    )
    headband.position.y = 22
    headband.rotation.z = Math.PI
    hpGroup.add(headband)

    const earL = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 8, 12), fabric)
    earL.position.set(-18, 5, 0)
    earL.rotation.z = Math.PI / 2
    hpGroup.add(earL)

    const earR = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 8, 12), fabric)
    earR.position.set(18, 5, 0)
    earR.rotation.z = Math.PI / 2
    hpGroup.add(earR)

    // ── Chair (behind desk / to side) ──
    const chairGroup = new THREE.Group()
    chairGroup.position.set(30, 0, 320)
    chairGroup.rotation.y = -0.3
    scene.add(chairGroup)

    // Chair seat
    const seat = new THREE.Mesh(new THREE.BoxGeometry(80, 10, 70), fabric)
    seat.position.y = 110
    chairGroup.add(seat)

    // Chair back
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(80, 100, 8), fabric)
    chairBack.position.set(0, 165, -35)
    chairBack.rotation.x = -0.1
    chairGroup.add(chairBack)

    // Chair base
    const chairBase = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 60, 8), chrome)
    chairBase.position.y = 75
    chairGroup.add(chairBase)

    // Chair wheels (5 legs)
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2
      const legMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 45), chrome)
      legMesh.position.set(Math.cos(angle) * 22, 42, Math.sin(angle) * 22)
      legMesh.rotation.y = angle
      chairGroup.add(legMesh)

      const wheel = new THREE.Mesh(new THREE.SphereGeometry(5, 8, 8), blackPlastic)
      wheel.position.set(Math.cos(angle) * 40, 38, Math.sin(angle) * 40)
      chairGroup.add(wheel)
    }

    // ── LED strip under desk ──
    const ledStrip = new THREE.Mesh(
      new THREE.BoxGeometry(480, 2, 2),
      new THREE.MeshBasicMaterial({ color: 0x6633ff })
    )
    ledStrip.position.set(0, 12, 115)
    scene.add(ledStrip)

    const ledLight = new THREE.PointLight(0x6633ff, 5000, 300, 2)
    ledLight.position.set(0, 10, 115)
    scene.add(ledLight)

    // ── Floating dust particles ──
    const particleCount = 500
    const particleGeo = new THREE.BufferGeometry()
    const pPositions = new Float32Array(particleCount * 3)
    const pSizes = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 1200
      pPositions[i * 3 + 1] = Math.random() * 600 + 50
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 1200
      pSizes[i] = Math.random() * 2 + 0.5
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))

    const particleMat = new THREE.PointsMaterial({
      color: 0x8888cc,
      size: 1.5,
      transparent: true,
      opacity: 0.25,
      sizeAttenuation: true,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── Small accent lights around room ──
    // LED on monitor
    const led1 = new THREE.Mesh(
      new THREE.SphereGeometry(2, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x00ff44 })
    )
    led1.position.set(130, 222, -43)
    scene.add(led1)

    // Power LED on PC
    const led2 = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x0088ff })
    )
    led2.position.set(240, 180, 90)
    scene.add(led2)

    // ── Raycaster ──
    const raycaster = new THREE.Raycaster()
    const mouseVec = new THREE.Vector2()

    let isHoveringMonitor = false

    const handleClick = (event: MouseEvent) => {
      mouseVec.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseVec.y = -(event.clientY / window.innerHeight) * 2 + 1
      raycaster.setFromCamera(mouseVec, camera)

      // Check lamp click (toggle light/dark)
      const lampHits = raycaster.intersectObjects(lampGroup.children, true)
      if (lampHits.length > 0) {
        lampIsOn = !lampIsOn
        setLightMode(lampIsOn)
        bulbMat.color.setHex(lampIsOn ? bulbColor.on : bulbColor.off)
        return
      }

      const intersects = raycaster.intersectObject(screen)
      if (intersects.length > 0) {
        onEnterMonitor()
      } else {
        onClickOutside()
      }
    }
    renderer.domElement.addEventListener('click', handleClick)

    // ── Mouse parallax + hover detection ──
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mousePos.current.y = (e.clientY / window.innerHeight - 0.5) * 2

      // Hover detection on monitor — triggers zoom in
      if (cameraModeRef.current !== 'monitor') {
        mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1
        mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1
        raycaster.setFromCamera(mouseVec, camera)
        const hits = raycaster.intersectObject(screen)
        if (hits.length > 0 && !isHoveringMonitor) {
          isHoveringMonitor = true
          onEnterMonitor()
        } else if (hits.length === 0) {
          isHoveringMonitor = false
        }
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // ── Resize ──
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Signal loaded
    setTimeout(() => onResourcesLoaded(), 2000)

    // ── Animate ──
    let time = 0
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      time += 0.016
      TWEEN.update()

      // Mouse parallax (subtle when in idle/desk, none when in monitor)
      const mode = cameraModeRef.current
      if (mode !== 'monitor') {
        const parallaxStrength = mode === 'idle' ? 15 : 6
        const targetX = KEYFRAMES[mode].position.x + mousePos.current.x * parallaxStrength
        const targetY = KEYFRAMES[mode].position.y - mousePos.current.y * parallaxStrength * 0.5
        camera.position.x += (targetX - camera.position.x) * 0.02
        camera.position.y += (targetY - camera.position.y) * 0.02
      }

      // Gentle particle float
      const pPos = particleGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < particleCount; i++) {
        pPos.array[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.05
        if (pPos.array[i * 3 + 1] > 700) pPos.array[i * 3 + 1] = 50
      }
      pPos.needsUpdate = true

      // Monitor glow pulse
      if (monitorGlowRef.current) {
        const baseGlow = lampIsOn ? 60000 : 40000
        monitorGlowRef.current.intensity = baseGlow + Math.sin(time * 2) * 3000
      }

      // Scan line scroll
      if (scanLineMeshRef.current) {
        const mat = scanLineMeshRef.current.material as THREE.MeshBasicMaterial
        if (mat.map) {
          mat.map.offset.y += 0.002
        }
      }

      // LED blink
      led1.material.opacity = 0.7 + Math.sin(time * 3) * 0.3

      camera.lookAt(lookAtTarget.current)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameRef.current)
      renderer.domElement.removeEventListener('click', handleClick)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  )
}
