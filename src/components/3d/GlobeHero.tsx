import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, MapPin } from 'lucide-react';

interface DestinationPin {
  name: string;
  lat: number;
  lng: number;
  highlight: string;
}

const DESTINATIONS: DestinationPin[] = [
  { name: 'Kashmir', lat: 34.08, lng: 74.79, highlight: 'Valley & Snow' },
  { name: 'Dubai', lat: 25.20, lng: 55.27, highlight: 'Skyline & Desert' },
  { name: 'Bali', lat: -8.34, lng: 115.09, highlight: 'Islands & Temples' },
  { name: 'Kerala', lat: 10.85, lng: 76.27, highlight: 'Backwaters' },
  { name: 'Rajasthan', lat: 26.91, lng: 75.78, highlight: 'Forts & Heritage' },
];

export const GlobeHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePin, setActivePin] = useState<string>('Kashmir');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe group for rotation
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Initial slight tilt
    globeGroup.rotation.x = 0.28;
    globeGroup.rotation.y = 1.2;

    const radius = 1.0;

    // Base Sphere (Deep Ocean Blue-Black with subtle sheen)
    const sphereGeometry = new THREE.SphereGeometry(radius, 48, 48);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0x0a192f),
      emissive: new THREE.Color(0x061122),
      specular: new THREE.Color(0x38bdf8),
      shininess: 25,
      transparent: true,
      opacity: 0.95,
    });
    const baseSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(baseSphere);

    // Outer Atmospheric Glow
    const haloGeometry = new THREE.SphereGeometry(radius * 1.05, 32, 32);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    globeGroup.add(halo);

    // Latitude & Longitude Coordinate Lines
    const wireframeGeometry = new THREE.SphereGeometry(radius * 1.002, 24, 18);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x1e3a8a,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    globeGroup.add(wireframe);

    // Helper: convert lat/lon to 3D position on sphere
    const latLngToVector3 = (lat: number, lng: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // Add Destination Pins & Glow Markers
    const pinObjects: { mesh: THREE.Mesh; ring: THREE.Mesh; dest: DestinationPin }[] = [];

    DESTINATIONS.forEach((dest) => {
      const pos = latLngToVector3(dest.lat, dest.lng, radius * 1.015);

      // Center glowing marker
      const pinGeo = new THREE.SphereGeometry(0.024, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b, // Amber Gold
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);

      // Pulsing outer ripple ring
      const ringGeo = new THREE.RingGeometry(0.03, 0.045, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);

      pinObjects.push({ mesh: pinMesh, ring: ringMesh, dest });
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd97706, 0.6); // Warm accent
    dirLight2.position.set(-3, -2, -2);
    scene.add(dirLight2);

    // Mouse drag rotation interaction
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;
      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous subtle smooth rotation unless user is dragging
      if (!isDragging && !prefersReducedMotion) {
        globeGroup.rotation.y += 0.0035;
      }

      // Pulsing rings
      pinObjects.forEach((p, idx) => {
        const scale = 1 + 0.35 * Math.sin(elapsedTime * 3 + idx);
        p.ring.scale.set(scale, scale, scale);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Auto rotate active destination tag every few seconds
    const interval = setInterval(() => {
      setActivePin((current) => {
        const nextIndex = (DESTINATIONS.findIndex((d) => d.name === current) + 1) % DESTINATIONS.length;
        return DESTINATIONS[nextIndex].name;
      });
    }, 3200);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Canvas Mount Point */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Subtle Floating Destination Labels as specified */}
      <div className="absolute top-4 right-4 pointer-events-none sm:pointer-events-auto">
        <div className="bg-[#0A192F]/85 backdrop-blur-md border border-slate-700/60 rounded-xl px-3.5 py-2.5 shadow-xl text-left transition-all duration-300">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
              Popular Routes
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-w-[220px]">
            {DESTINATIONS.map((d) => (
              <span
                key={d.name}
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-all ${
                  activePin === d.name
                    ? 'bg-amber-400 text-[#0A192F] font-bold shadow-xs'
                    : 'bg-slate-800/80 text-slate-300'
                }`}
              >
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Helper Hint */}
      <div className="absolute bottom-3 left-4 text-[10px] text-slate-400/80 flex items-center gap-1.5 pointer-events-none">
        <Compass className="w-3.5 h-3.5 text-amber-400/80 animate-spin" style={{ animationDuration: '10s' }} />
        <span>Drag globe to explore global flight & tour corridors</span>
      </div>
    </div>
  );
};
