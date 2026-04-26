'use client'

import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls, Torus, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'

export function WebGLFarmScene() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-[320px] md:h-[420px] rounded-2xl overflow-hidden border border-wheat/10 bg-gradient-to-br from-soil/80 to-ash/80"
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={1.2} color="#f4c542" />
        <directionalLight position={[-2, -1, 2]} intensity={0.7} color="#0f5b4f" />

        <Float speed={2.4} rotationIntensity={1.2} floatIntensity={0.8}>
          <Torus args={[1.2, 0.28, 24, 64]} rotation={[0.9, 0.3, 0.2]}>
            <MeshDistortMaterial color="#0f5b4f" roughness={0.2} metalness={0.7} distort={0.25} speed={2} />
          </Torus>
        </Float>

        <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.2}>
          <Sphere args={[0.55, 64, 64]} position={[1.8, -0.8, 0.4]}>
            <MeshDistortMaterial color="#f4c542" roughness={0.1} metalness={0.6} distort={0.18} speed={1.5} />
          </Sphere>
        </Float>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.9} />
      </Canvas>
    </motion.div>
  )
}
