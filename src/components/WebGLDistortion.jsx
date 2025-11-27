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

  // Wave effect based on mouse interaction
  float dist = distance(uv, uMouse);
  float wave = sin(dist * 10.0 - uTime * 2.0) * 0.1 * uHover;

  // Subtle idle breathing effect
  float idle = sin(uTime * 0.5) * 0.02 * (1.0 - uHover);
  pos.z += wave + idle * sin(uv.x * 3.0 + uv.y * 2.0);

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

  // Direction-based chromatic aberration (based on mouse position)
  vec2 dir = normalize(uv - uMouse);
  float shift = 0.015 * uHover;

  vec4 r = texture2D(uTexture, uv + dir * shift);
  vec4 g = texture2D(uTexture, uv);
  vec4 b = texture2D(uTexture, uv - dir * shift);

  gl_FragColor = vec4(r.r, g.g, b.b, 1.0);
}
`;

const ImagePlane = ({ image, isHovering, mousePosition }) => {
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

      // Smooth mouse position update
      const currentMouse = meshRef.current.material.uniforms.uMouse.value;
      currentMouse.x = THREE.MathUtils.lerp(currentMouse.x, mousePosition.x, 0.1);
      currentMouse.y = THREE.MathUtils.lerp(currentMouse.y, mousePosition.y, 0.1);
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
  const containerRef = useRef(null);
  const mousePosition = useRef({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mousePosition.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height // Flip Y for UV coordinates
      };
    }
  };

  return (
    <div
      ref={containerRef}
      className="webgl-container"
      onMouseMove={handleMouseMove}
    >
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <Suspense fallback={null}>
          <ImagePlane image={image} isHovering={isHovering} mousePosition={mousePosition.current} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default WebGLDistortion;
