import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import './WebGLDistortion.css';

// Shader for the distortion effect
const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Simple wave effect based on mouse interaction
  float dist = distance(uv, uMouse);
  float wave = sin(dist * 10.0 - uTime * 2.0) * 0.1 * uHover;
  
  pos.z += wave;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;

void main() {
  vec2 uv = vUv;
  
  // Chromatic aberration
  float shift = 0.02 * uHover;
  vec4 r = texture2D(uTexture, uv + vec2(shift, 0.0));
  vec4 g = texture2D(uTexture, uv);
  vec4 b = texture2D(uTexture, uv - vec2(shift, 0.0));
  
  gl_FragColor = vec4(r.r, g.g, b.b, 1.0);
}
`;

const ImagePlane = ({ image, isHovering }) => {
  const meshRef = useRef();
  const texture = useTexture(image);
  const { viewport } = useThree();
  
  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHover: { value: 0 }
  }), [texture]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Smooth hover transition
      meshRef.current.material.uniforms.uHover.value = THREE.MathUtils.lerp(
        meshRef.current.material.uniforms.uHover.value,
        isHovering ? 1 : 0,
        0.1
      );
      
      // Update mouse position (normalized)
      // In a real implementation, we'd map screen mouse coordinates to UV space
      // For now, we'll just let it ripple
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};



const WebGLDistortion = ({ image, isHovering }) => {
  return (
    <div className="webgl-container">
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <Suspense fallback={null}>
          <ImagePlane image={image} isHovering={isHovering} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default WebGLDistortion;
