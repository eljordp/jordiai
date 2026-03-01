import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

interface Props {
  cameraMode: 'idle' | 'desk' | 'monitor'
  onResourcesLoaded: () => void
  onClickOutside: () => void
  onEnterMonitor: () => void
}

const KEYFRAMES = {
  idle: {
    position: { x: 500, y: 380, z: 600 },
    lookAt: { x: 0, y: 160, z: -50 },
  },
  desk: {
    position: { x: 50, y: 300, z: 350 },
    lookAt: { x: 0, y: 220, z: -60 },
  },
  monitor: {
    position: { x: 0, y: 270, z: 130 },
    lookAt: { x: 0, y: 258, z: -55 },
  },
}

const isMobile = window.innerWidth < 768
const usePostProcessing = !isMobile && window.devicePixelRatio <= 2

export default function Scene3D({ cameraMode, onResourcesLoaded, onClickOutside, onEnterMonitor }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const lookAtTarget = useRef(new THREE.Vector3(0, 160, -50))
  const screenRef = useRef<THREE.Mesh | null>(null)
  const frameRef = useRef<number>(0)
  const mousePos = useRef({ x: 0, y: 0 })
  const cameraModeRef = useRef(cameraMode)
  const monitorGlowRef = useRef<THREE.PointLight | null>(null)
  const lampOnRef = useRef(true)

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
    camera.position.set(500, 380, 600)
    cameraRef.current = camera

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    containerRef.current.appendChild(renderer.domElement)

    // ── Post-Processing ──
    let composer: EffectComposer | null = null
    if (usePostProcessing) {
      composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.12,  // strength
        0.4,   // radius
        0.95   // threshold
      )
      composer.addPass(bloomPass)
      composer.addPass(new OutputPass())
    }

    // ── Materials ──
    const deskMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.3, metalness: 0.05 })
    const legMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.2, metalness: 0.7 })
    const chrome = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.15, metalness: 0.95 })
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x778899, roughness: 0.95, metalness: 0.0 })
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x554840, roughness: 0.85, metalness: 0.05 })
    const fabric = new THREE.MeshStandardMaterial({ color: 0x333344, roughness: 0.9, metalness: 0 })
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf0ece8, roughness: 0.7 })
    const blackPlastic = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, metalness: 0.3 })

    // ── Lighting ──
    const ambient = new THREE.AmbientLight(0xfff5ee, 0.5)
    scene.add(ambient)

    const hemi = new THREE.HemisphereLight(0xddeeff, 0x8B7355, 0.4)
    scene.add(hemi)

    // Desk lamp (warm)
    const deskLamp = new THREE.PointLight(0xffcc88, 60000, 1200, 2)
    deskLamp.position.set(-200, 420, 60)
    deskLamp.castShadow = true
    deskLamp.shadow.mapSize.set(1024, 1024)
    deskLamp.shadow.radius = 4
    scene.add(deskLamp)

    // Monitor glow (cool white-blue)
    const monitorGlow = new THREE.PointLight(0x88bbdd, 25000, 600, 2)
    monitorGlow.position.set(0, 300, 20)
    scene.add(monitorGlow)
    monitorGlowRef.current = monitorGlow

    // Warm rim light (replaced purple)
    const rimLight = new THREE.SpotLight(0xffaa66, 20000, 1500, Math.PI / 6, 0.5, 2)
    rimLight.position.set(400, 600, -300)
    rimLight.target.position.set(0, 200, 0)
    scene.add(rimLight)
    scene.add(rimLight.target)

    // Fill light
    const fillLight = new THREE.PointLight(0x88aacc, 12000, 1200, 2)
    fillLight.position.set(-300, 50, 300)
    scene.add(fillLight)

    // Ceiling light
    const ceilingLight = new THREE.PointLight(0xffeedd, 80000, 1500, 2)
    ceilingLight.position.set(0, 900, 100)
    ceilingLight.castShadow = true
    scene.add(ceilingLight)

    // Window daylight
    const dayLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dayLight.position.set(-500, 800, 200)
    dayLight.castShadow = true
    scene.add(dayLight)

    // ── Lamp toggle state ──
    let lampIsOn = lampOnRef.current
    const bulbColor = { on: 0xffcc66, off: 0x333333 }

    const setLightMode = (on: boolean) => {
      lampIsOn = on
      lampOnRef.current = on
      ambient.intensity = on ? 0.5 : 0.08
      hemi.intensity = on ? 0.4 : 0.1
      deskLamp.intensity = on ? 60000 : 30000
      ceilingLight.intensity = on ? 80000 : 0
      dayLight.intensity = on ? 0.8 : 0.0
      fillLight.intensity = on ? 12000 : 4000
      rimLight.intensity = on ? 20000 : 10000
      scene.background = new THREE.Color(on ? 0x8899aa : 0x050508)
    }

    // ── Room ──
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(2000, 1000), wallMat)
    backWall.position.set(0, 500, -350)
    backWall.receiveShadow = true
    scene.add(backWall)

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(2000, 1000), wallMat)
    leftWall.position.set(-600, 500, 0)
    leftWall.rotation.y = Math.PI / 2
    scene.add(leftWall)

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(2000, 1000), wallMat)
    rightWall.position.set(600, 500, 0)
    rightWall.rotation.y = -Math.PI / 2
    scene.add(rightWall)

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshStandardMaterial({ color: 0x0e0e14, roughness: 0.95 })
    )
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.y = 1000
    scene.add(ceiling)

    // ── Desk (clean, minimal, white) ──
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(520, 10, 260), deskMat)
    deskTop.position.set(0, 165, -10)
    deskTop.castShadow = true
    deskTop.receiveShadow = true
    scene.add(deskTop)

    // Desk legs
    const legGeo = new THREE.BoxGeometry(6, 160, 6)
    ;[[-240, 82, 110], [-240, 82, -130], [240, 82, 110], [240, 82, -130]].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat)
      leg.position.set(x, y, z)
      leg.castShadow = true
      scene.add(leg)
    })

    // ── GLTF Model Loader ──
    const loader = new GLTFLoader()
    let macbookScreenMesh: THREE.Mesh | null = null

    // Draw macOS-style preview on a canvas for the MacBook screen
    const previewCanvas = document.createElement('canvas')
    previewCanvas.width = 1024
    previewCanvas.height = 640
    const ctx = previewCanvas.getContext('2d')!

    // Dark gradient desktop background
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 640)
    bgGrad.addColorStop(0, '#1a1a2e')
    bgGrad.addColorStop(0.4, '#16213e')
    bgGrad.addColorStop(1, '#0f3460')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 1024, 640)

    // macOS-style window (dark, rounded)
    const wx = 80, wy = 24, ww = 700, wh = 520
    // Window shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.beginPath()
    ctx.roundRect(wx + 6, wy + 6, ww, wh, 12)
    ctx.fill()
    // Window body
    ctx.fillStyle = 'rgba(30, 30, 30, 0.95)'
    ctx.beginPath()
    ctx.roundRect(wx, wy, ww, wh, 12)
    ctx.fill()
    // Window border
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(wx, wy, ww, wh, 12)
    ctx.stroke()
    // Title bar
    ctx.fillStyle = 'rgba(50, 50, 50, 0.95)'
    ctx.beginPath()
    ctx.roundRect(wx, wy, ww, 36, [12, 12, 0, 0])
    ctx.fill()
    // Traffic lights
    const tlY = wy + 14
    ctx.fillStyle = '#ff5f57'
    ctx.beginPath(); ctx.arc(wx + 20, tlY, 6, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#febc2e'
    ctx.beginPath(); ctx.arc(wx + 40, tlY, 6, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#28c840'
    ctx.beginPath(); ctx.arc(wx + 60, tlY, 6, 0, Math.PI * 2); ctx.fill()
    // Title text
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = '12px -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Jordi - Showcase 2025', wx + ww / 2, wy + 23)
    ctx.textAlign = 'left'
    // Content area
    ctx.fillStyle = 'rgba(20,20,20,0.95)'
    ctx.fillRect(wx + 1, wy + 36, ww - 2, wh - 37)
    // Content text
    ctx.fillStyle = '#f5f5f7'
    ctx.font = 'bold 32px -apple-system, sans-serif'
    ctx.fillText('Jordi', wx + 30, wy + 90)
    ctx.font = '13px -apple-system, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillText('AI Engineer & Software Developer', wx + 30, wy + 115)
    // Separator
    ctx.fillStyle = '#0a84ff'
    ctx.fillRect(wx + 30, wy + 128, 160, 2)
    // Bio text
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = '11px -apple-system, sans-serif'
    const bioLines = [
      "Started from nothing — now building AI-powered systems",
      'and working with companies doing billions in revenue.',
      'I specialize in websites, software, and AI automations.',
    ]
    bioLines.forEach((line, i) => {
      ctx.fillText(line, wx + 30, wy + 155 + i * 18)
    })
    // Section header
    ctx.fillStyle = '#f5f5f7'
    ctx.font = '600 12px -apple-system, sans-serif'
    ctx.fillText('PROJECTS', wx + 30, wy + 230)
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.fillRect(wx + 30, wy + 238, ww - 60, 1)
    // Project cards
    const cards = [
      { title: 'Websites', desc: 'Web design & dev', color: '#0a84ff' },
      { title: 'Software', desc: 'Custom apps & tools', color: '#bf5af2' },
      { title: 'Contact', desc: 'Get in touch', color: '#ff9f0a' },
    ]
    cards.forEach(({ title, desc, color }, i) => {
      const cx = wx + 30 + i * 215
      ctx.fillStyle = 'rgba(255,255,255,0.06)'
      ctx.beginPath()
      ctx.roundRect(cx, wy + 255, 195, 65, 8)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.beginPath()
      ctx.roundRect(cx, wy + 255, 195, 65, 8)
      ctx.stroke()
      ctx.fillStyle = color
      ctx.font = '600 12px -apple-system, sans-serif'
      ctx.fillText(title, cx + 14, wy + 280)
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.font = '11px -apple-system, sans-serif'
      ctx.fillText(desc, cx + 14, wy + 298)
    })

    // Dock at bottom
    const dockW = 240, dockH = 40
    const dockX = (1024 - dockW) / 2, dockY = 590
    ctx.fillStyle = 'rgba(40,40,40,0.75)'
    ctx.beginPath()
    ctx.roundRect(dockX, dockY, dockW, dockH, 14)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'
    ctx.beginPath()
    ctx.roundRect(dockX, dockY, dockW, dockH, 14)
    ctx.stroke()
    // Dock icons
    const dockColors = ['#0a84ff', '#30d158', '#bf5af2', '#ff9f0a']
    const dockLabels = ['S', 'A', 'P', 'C']
    dockColors.forEach((color, i) => {
      const ix = dockX + 28 + i * 50
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect(ix, dockY + 8, 24, 24, 6)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 12px -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(dockLabels[i], ix + 12, dockY + 25)
    })
    ctx.textAlign = 'left'

    const previewTexture = new THREE.CanvasTexture(previewCanvas)

    // Load MacBook
    loader.load('/models/macbook/scene.gltf', (gltf) => {
      const model = gltf.scene
      model.scale.set(4.5, 4.5, 4.5)
      model.position.set(0, 170, -55)
      model.rotation.y = 0

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true

          // Find the screen mesh (material with full emissive = sfCQkHOWyrsLmor)
          const mat = child.material as THREE.MeshStandardMaterial
          if (mat && mat.emissiveIntensity > 0.5) {
            macbookScreenMesh = child
            screenRef.current = child

            // Apply OS preview texture to the screen
            const screenMaterial = new THREE.MeshStandardMaterial({
              map: previewTexture,
              emissive: new THREE.Color(0x444444),
              emissiveIntensity: 0.6,
              roughness: 0.05,
              metalness: 0.1,
            })
            child.material = screenMaterial
          }
        }
      })

      scene.add(model)
    })

    // Load AirPods (desk accessory)
    loader.load('/models/airpods/scene.gltf', (gltf) => {
      const model = gltf.scene
      model.scale.set(300, 300, 300)
      model.position.set(160, 171, 80)
      model.rotation.y = -0.4

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      scene.add(model)
    })

    // Load iPhone (desk accessory)
    loader.load('/models/iphone/scene.gltf', (gltf) => {
      const model = gltf.scene
      model.scale.set(40, 40, 40)
      model.position.set(-160, 172, 80)
      model.rotation.set(0, 0.3, -Math.PI / 2)

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      scene.add(model)
    })

    // ── Keyboard (Apple Magic Keyboard style) ──
    const kbGroup = new THREE.Group()
    kbGroup.position.set(-10, 170, 55)
    kbGroup.rotation.x = -0.03
    scene.add(kbGroup)

    const kbMat = new THREE.MeshStandardMaterial({ color: 0xe8e8e8, roughness: 0.35, metalness: 0.1 })
    const kbBase = new THREE.Mesh(new THREE.BoxGeometry(150, 3, 50), kbMat)
    kbBase.receiveShadow = true
    kbGroup.add(kbBase)

    const keyMat = new THREE.MeshStandardMaterial({ color: 0xdadada, roughness: 0.5, metalness: 0.05 })
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 14; col++) {
        const key = new THREE.Mesh(new THREE.BoxGeometry(8.5, 2, 7.5), keyMat)
        key.position.set(-60 + col * 10, 2.5, -16 + row * 9.5)
        kbGroup.add(key)
      }
    }
    const spacebar = new THREE.Mesh(new THREE.BoxGeometry(50, 2, 7.5), keyMat)
    spacebar.position.set(-5, 2.5, 22)
    kbGroup.add(spacebar)

    // ── Mouse (Magic Mouse style) ──
    const mouseGroup = new THREE.Group()
    mouseGroup.position.set(110, 170, 60)
    scene.add(mouseGroup)

    const mouseMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.25, metalness: 0.1 })
    const mouseBody = new THREE.Mesh(
      new THREE.CapsuleGeometry(7, 12, 8, 12),
      mouseMat
    )
    mouseBody.rotation.x = Math.PI / 2
    mouseBody.rotation.z = Math.PI
    mouseBody.scale.y = 0.5
    mouseBody.castShadow = true
    mouseGroup.add(mouseBody)

    // Light grey desk mat
    const deskMatPad = new THREE.Mesh(
      new THREE.BoxGeometry(160, 1, 80),
      new THREE.MeshStandardMaterial({ color: 0x444450, roughness: 0.85 })
    )
    deskMatPad.position.set(50, 169, 60)
    scene.add(deskMatPad)

    // ── Desk Lamp ──
    const lampGroup = new THREE.Group()
    lampGroup.position.set(-210, 170, 50)
    scene.add(lampGroup)

    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(20, 22, 6, 16), chrome)
    lampBase.castShadow = true
    lampGroup.add(lampBase)

    const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 200, 8), chrome)
    lampArm.position.set(0, 100, -10)
    lampArm.rotation.z = 0.15
    lampGroup.add(lampArm)

    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(28, 35, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.6, side: THREE.DoubleSide })
    )
    lampShade.position.set(15, 215, -10)
    lampShade.rotation.z = 0.15
    lampGroup.add(lampShade)

    const bulbMat = new THREE.MeshBasicMaterial({ color: bulbColor.on })
    const bulbGlow = new THREE.Mesh(new THREE.SphereGeometry(6, 8, 8), bulbMat)
    bulbGlow.position.set(15, 200, -10)
    lampGroup.add(bulbGlow)

    // ── Coffee Mug ──
    const mugGroup = new THREE.Group()
    mugGroup.position.set(220, 170, 30)
    scene.add(mugGroup)

    const mugBody = new THREE.Mesh(
      new THREE.CylinderGeometry(11, 9, 26, 16),
      whiteMat
    )
    mugBody.position.y = 13
    mugBody.castShadow = true
    mugGroup.add(mugBody)

    const handleCurve = new THREE.TorusGeometry(7, 2, 8, 12, Math.PI)
    const mugHandle = new THREE.Mesh(handleCurve, whiteMat)
    mugHandle.position.set(12, 16, 0)
    mugHandle.rotation.y = Math.PI / 2
    mugGroup.add(mugHandle)

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

    const soil = new THREE.Mesh(
      new THREE.CircleGeometry(14, 8),
      new THREE.MeshStandardMaterial({ color: 0x2a1a0a, roughness: 0.95 })
    )
    soil.rotation.x = -Math.PI / 2
    soil.position.y = 27
    plantGroup.add(soil)

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

    // ── Books ──
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

    // ── Shelf ──
    const darkWood = new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 0.7, metalness: 0.05 })
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(200, 8, 30), darkWood)
    shelf.position.set(-250, 450, -340)
    shelf.castShadow = true
    scene.add(shelf)

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

    // ── Chair ──
    const chairGroup = new THREE.Group()
    chairGroup.position.set(30, 0, 320)
    chairGroup.rotation.y = -0.3
    scene.add(chairGroup)

    const seat = new THREE.Mesh(new THREE.BoxGeometry(80, 10, 70), fabric)
    seat.position.y = 110
    chairGroup.add(seat)

    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(80, 100, 8), fabric)
    chairBack.position.set(0, 165, -35)
    chairBack.rotation.x = -0.1
    chairGroup.add(chairBack)

    const chairBase = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 60, 8), chrome)
    chairBase.position.y = 75
    chairGroup.add(chairBase)

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

    // ── Subtle LED strip (warm white instead of purple) ──
    const ledStrip = new THREE.Mesh(
      new THREE.BoxGeometry(480, 2, 2),
      new THREE.MeshBasicMaterial({ color: 0x4488ff })
    )
    ledStrip.position.set(0, 12, 115)
    scene.add(ledStrip)

    const ledLight = new THREE.PointLight(0x4488ff, 3000, 300, 2)
    ledLight.position.set(0, 10, 115)
    scene.add(ledLight)

    // ── Floating dust particles ──
    const particleCount = 500
    const particleGeo = new THREE.BufferGeometry()
    const pPositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 1200
      pPositions[i * 3 + 1] = Math.random() * 600 + 50
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 1200
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))

    const particleMat = new THREE.PointsMaterial({
      color: 0x8888cc,
      size: 1.5,
      transparent: true,
      opacity: 0.2,
      sizeAttenuation: true,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── LEDs ──

    // ── Raycaster ──
    const raycaster = new THREE.Raycaster()
    const mouseVec = new THREE.Vector2()

    const handleClick = (event: MouseEvent) => {
      mouseVec.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseVec.y = -(event.clientY / window.innerHeight) * 2 + 1
      raycaster.setFromCamera(mouseVec, camera)

      // Lamp toggle
      const lampHits = raycaster.intersectObjects(lampGroup.children, true)
      if (lampHits.length > 0) {
        lampIsOn = !lampIsOn
        setLightMode(lampIsOn)
        bulbMat.color.setHex(lampIsOn ? bulbColor.on : bulbColor.off)
        return
      }

      // MacBook screen click
      if (macbookScreenMesh) {
        const screenHits = raycaster.intersectObject(macbookScreenMesh)
        if (screenHits.length > 0) {
          onEnterMonitor()
          return
        }
      }

      onClickOutside()
    }
    renderer.domElement.addEventListener('click', handleClick)

    // ── Mouse parallax ──
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mousePos.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)

    // ── Resize ──
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      if (composer) {
        composer.setSize(window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener('resize', handleResize)

    // Signal loaded (give models time to load)
    setTimeout(() => onResourcesLoaded(), 3000)

    // ── Animate ──
    let time = 0
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      time += 0.016
      TWEEN.update()

      // Mouse parallax
      const mode = cameraModeRef.current
      if (mode !== 'monitor') {
        const parallaxStrength = mode === 'idle' ? 50 : 35
        const targetX = KEYFRAMES[mode].position.x + mousePos.current.x * parallaxStrength
        const targetY = KEYFRAMES[mode].position.y - mousePos.current.y * parallaxStrength * 0.4
        camera.position.x += (targetX - camera.position.x) * 0.12
        camera.position.y += (targetY - camera.position.y) * 0.12
      }

      // Particle float
      const pPos = particleGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < particleCount; i++) {
        pPos.array[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.05
        if (pPos.array[i * 3 + 1] > 700) pPos.array[i * 3 + 1] = 50
      }
      pPos.needsUpdate = true

      // Monitor glow pulse
      if (monitorGlowRef.current) {
        const baseGlow = lampIsOn ? 25000 : 18000
        monitorGlowRef.current.intensity = baseGlow + Math.sin(time * 2) * 2000
      }

      camera.lookAt(lookAtTarget.current)

      if (composer) {
        composer.render()
      } else {
        renderer.render(scene, camera)
      }
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
