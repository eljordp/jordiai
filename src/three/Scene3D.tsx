import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'

interface Props {
  cameraMode: 'idle' | 'desk' | 'monitor'
  onResourcesLoaded: () => void
  onClickOutside: () => void
  onClickMonitor: () => void
}

const KEYFRAMES = {
  idle: {
    position: { x: 800, y: 600, z: 800 },
    lookAt: { x: 0, y: 100, z: 0 },
  },
  desk: {
    position: { x: 0, y: 350, z: 500 },
    lookAt: { x: 0, y: 200, z: 0 },
  },
  monitor: {
    position: { x: 0, y: 280, z: 200 },
    lookAt: { x: 0, y: 260, z: -50 },
  },
}

export default function Scene3D({ cameraMode, onResourcesLoaded, onClickOutside, onClickMonitor }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const lookAtTarget = useRef(new THREE.Vector3(0, 100, 0))
  const monitorMeshRef = useRef<THREE.Mesh | null>(null)
  const frameRef = useRef<number>(0)

  const transitionCamera = useCallback((mode: 'idle' | 'desk' | 'monitor') => {
    const camera = cameraRef.current
    if (!camera) return

    const target = KEYFRAMES[mode]
    TWEEN.removeAll()

    new TWEEN.Tween(camera.position)
      .to(target.position, 1500)
      .easing(TWEEN.Easing.Quintic.InOut)
      .start()

    new TWEEN.Tween(lookAtTarget.current)
      .to(target.lookAt, 1500)
      .easing(TWEEN.Easing.Quintic.InOut)
      .start()
  }, [])

  useEffect(() => {
    transitionCamera(cameraMode)
  }, [cameraMode, transitionCamera])

  useEffect(() => {
    if (!containerRef.current) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0a)
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0008)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 5000)
    camera.position.set(800, 600, 800)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.8
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404060, 0.4)
    scene.add(ambientLight)

    const deskLamp = new THREE.PointLight(0xffaa44, 1.5, 600)
    deskLamp.position.set(-150, 400, 100)
    deskLamp.castShadow = true
    scene.add(deskLamp)

    const monitorGlow = new THREE.PointLight(0x4488ff, 0.8, 400)
    monitorGlow.position.set(0, 300, 50)
    scene.add(monitorGlow)

    const rimLight = new THREE.DirectionalLight(0x6644aa, 0.3)
    rimLight.position.set(200, 500, -200)
    scene.add(rimLight)

    // Floor
    const floorGeo = new THREE.PlaneGeometry(3000, 3000)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.9,
      metalness: 0.1,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Desk
    const deskColor = 0x2a1810
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(500, 12, 250),
      new THREE.MeshStandardMaterial({ color: deskColor, roughness: 0.6, metalness: 0.1 })
    )
    deskTop.position.set(0, 160, 0)
    deskTop.castShadow = true
    deskTop.receiveShadow = true
    scene.add(deskTop)

    // Desk legs
    const legGeo = new THREE.BoxGeometry(12, 160, 12)
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1a1008, roughness: 0.7 })
    const legPositions = [[-240, 80, -110], [240, 80, -110], [-240, 80, 110], [240, 80, 110]]
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat)
      leg.position.set(x, y, z)
      leg.castShadow = true
      scene.add(leg)
    })

    // Monitor stand
    const standBase = new THREE.Mesh(
      new THREE.CylinderGeometry(30, 35, 6, 16),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.8 })
    )
    standBase.position.set(0, 169, -40)
    scene.add(standBase)

    const standPole = new THREE.Mesh(
      new THREE.BoxGeometry(8, 80, 8),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3, metalness: 0.8 })
    )
    standPole.position.set(0, 212, -40)
    scene.add(standPole)

    // Monitor
    const monitorBody = new THREE.Mesh(
      new THREE.BoxGeometry(260, 160, 12),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.6 })
    )
    monitorBody.position.set(0, 310, -50)
    monitorBody.castShadow = true
    scene.add(monitorBody)

    // Monitor screen (glowing)
    const screenGeo = new THREE.PlaneGeometry(240, 140)
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x1d2e2f,
      emissive: 0x0a2020,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.3,
    })
    const screen = new THREE.Mesh(screenGeo, screenMat)
    screen.position.set(0, 310, -43)
    screen.name = 'monitor-screen'
    monitorMeshRef.current = screen
    scene.add(screen)

    // Keyboard
    const keyboard = new THREE.Mesh(
      new THREE.BoxGeometry(140, 6, 50),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.4 })
    )
    keyboard.position.set(0, 169, 40)
    keyboard.castShadow = true
    scene.add(keyboard)

    // Mouse
    const mouse = new THREE.Mesh(
      new THREE.BoxGeometry(20, 8, 30),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.4 })
    )
    mouse.position.set(100, 169, 40)
    mouse.castShadow = true
    scene.add(mouse)

    // Coffee mug
    const mugBody = new THREE.Mesh(
      new THREE.CylinderGeometry(12, 10, 30, 16),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.6 })
    )
    mugBody.position.set(-180, 181, 30)
    mugBody.castShadow = true
    scene.add(mugBody)

    // Plant pot
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(18, 14, 30, 8),
      new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 })
    )
    pot.position.set(200, 181, -60)
    scene.add(pot)

    const plant = new THREE.Mesh(
      new THREE.SphereGeometry(25, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.9 })
    )
    plant.position.set(200, 210, -60)
    scene.add(plant)

    // Wall behind desk
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(3000, 1500),
      new THREE.MeshStandardMaterial({ color: 0x12121e, roughness: 0.95 })
    )
    wall.position.set(0, 750, -400)
    scene.add(wall)

    // Floating particles
    const particleCount = 200
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000
      positions[i * 3 + 1] = Math.random() * 800
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({ color: 0x6666aa, size: 2, transparent: true, opacity: 0.4 })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Raycaster for monitor clicks
    const raycaster = new THREE.Raycaster()
    const mouseVec = new THREE.Vector2()

    const handleClick = (event: MouseEvent) => {
      mouseVec.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseVec.y = -(event.clientY / window.innerHeight) * 2 + 1
      raycaster.setFromCamera(mouseVec, camera)
      const intersects = raycaster.intersectObject(screen)
      if (intersects.length > 0) {
        onClickMonitor()
      } else {
        onClickOutside()
      }
    }
    renderer.domElement.addEventListener('click', handleClick)

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Signal loaded
    setTimeout(() => onResourcesLoaded(), 1500)

    // Animate
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      TWEEN.update()

      // Gentle particle float
      particles.rotation.y += 0.0001

      camera.lookAt(lookAtTarget.current)
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameRef.current)
      renderer.domElement.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />
}
