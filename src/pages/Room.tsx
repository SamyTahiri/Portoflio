import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, useProgress, OrbitControls, Html } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import Grainient from "../components/ui/Grainient";
import roomModelUrl from "../assets/models/room.glb?url";
import AutumnLeaves from "../components/landing/AutumnLeaves";
import DustMotes from "../components/landing/DustMotes";
import ShapeOverlay, { type ShapeOverlayHandle } from "../components/landing/ShapeOverlay";
import "./Room.css";

const FINAL_POSITION = new THREE.Vector3(10, 3, 8);
const START_POSITION = new THREE.Vector3(40, 15, 30);
const MAX_ZOOM_DISTANCE = 18;
const DOOR_NAME = "Object_231";

function RoomModel({ onDoorHover }: { onDoorHover: (hovering: boolean) => void }) {
  const { scene, nodes } = useGLTF(roomModelUrl);
  const pivotRef = useRef<THREE.Group | null>(null);
  const targetRotation = useRef(0);

  useEffect(() => {
    const door = nodes[DOOR_NAME] as THREE.Object3D | undefined;
    if (!door || !door.parent) return;

    door.updateWorldMatrix(true, false);

    // world-space measurements (accounts for the door's real geometry offsets)
    const box = new THREE.Box3().setFromObject(door);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const widthAxis: "x" | "z" = size.x >= size.z ? "x" : "z";
    const hingeWorld = center.clone();
    if (widthAxis === "x") {
      hingeWorld.x = box.max.x;
    } else {
      hingeWorld.z = box.max.z;
    }

    // CRITICAL FIX: convert the world-space hinge point into door.parent's
    // local space before assigning it as pivot.position
    const hingeLocal = door.parent.worldToLocal(hingeWorld.clone());

    const pivot = new THREE.Group();
    pivot.position.copy(hingeLocal);

    door.parent.add(pivot);
    pivot.attach(door); // preserves the door's real world transform

    pivotRef.current = pivot;
  }, [nodes]);

  useFrame((_, delta) => {
    if (pivotRef.current) {
      const current = pivotRef.current.rotation.y;
      const next = THREE.MathUtils.damp(current, targetRotation.current, 5, delta);
      pivotRef.current.rotation.y = next;
    }
  });

  return (
    <primitive
      object={scene}
      position={[0, -1, 0]}
      onPointerOver={(e: any) => {
        if (e.object.name === DOOR_NAME) {
          e.stopPropagation();
          targetRotation.current = 0.6;
          onDoorHover(true);
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={(e: any) => {
        if (e.object.name === DOOR_NAME) {
          targetRotation.current = 0;
          onDoorHover(false);
          document.body.style.cursor = "auto";
        }
      }}
    />
  );
}

function DoorPopup({ visible, onLeave }: { visible: boolean; onLeave: () => void }) {
  if (!visible) return null;

  return (
    <Html position={[3, 1.2, 2]} center distanceFactor={8}>
      <div className="door-popup" onClick={onLeave}>
        Leave the room
      </div>
    </Html>
  );
}

function CameraRig() {
  const progressRef = useRef(0);

  useFrame((state, delta) => {
    if (progressRef.current < 1) {
      const safeDelta = Math.min(delta, 0.05);
      progressRef.current = Math.min(progressRef.current + safeDelta * 0.5, 1);
      const eased = 1 - Math.pow(1 - progressRef.current, 3);
      state.camera.position.lerpVectors(START_POSITION, FINAL_POSITION, eased);
      state.camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

function LoadingScreen() {
  const { progress } = useProgress();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #f7d9a0 0%, #f3b880 60%, #e89a5c 100%)",
        zIndex: 10,
      }}
    >
      <svg
        viewBox="0 0 40 40"
        width="64"
        height="64"
        fill="none"
        style={{ animation: "spin 1.4s linear infinite" }}
      >
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%" stopColor="#fde3ec" />
            <stop offset="18%" stopColor="#f4afc7" />
            <stop offset="35%" stopColor="#ffffff" />
            <stop offset="52%" stopColor="#d4759a" />
            <stop offset="70%" stopColor="#f9c9da" />
            <stop offset="85%" stopColor="#c85f85" />
            <stop offset="100%" stopColor="#f4afc7" />
          </linearGradient>
        </defs>
        <path d="M20 6a14 14 0 1 1 -9.7 4.05" stroke="url(#logoGrad)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="20" cy="6" r="1.8" fill="url(#logoGrad)" />
        <circle cx="30.5" cy="30.5" r="1.8" fill="url(#logoGrad)" />
        <line x1="30.5" y1="30.5" x2="36" y2="34" stroke="url(#logoGrad)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="36" cy="34" r="1.6" fill="url(#logoGrad)" />
      </svg>

      <p style={{ marginTop: 20, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "#3a2b1a", opacity: 0.75 }}>
        Entering the room · {Math.round(progress)}%
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function Room() {
  const navigate = useNavigate();
  const overlayRef = useRef<ShapeOverlayHandle>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const isLeavingRef = useRef(false);
  const [isDoorHovered, setIsDoorHovered] = useState(false);

  const leaveRoom = () => {
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;
    overlayRef.current?.play(() => navigate("/"));
  };

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY >= 0) return;

      const controls = controlsRef.current;
      const distance = controls ? controls.getDistance() : 0;

      if (distance >= MAX_ZOOM_DISTANCE - 0.5) {
        leaveRoom();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}>
      <AutumnLeaves />
      <DustMotes />
      <Grainient
        className="room-grainient"
        color1="#e8c9a8"
        color2="#c97a4a"
        color3="#a85268"
        timeSpeed={0.15}
        warpStrength={0.8}
        warpAmplitude={40}
        grainAmount={0.06}
        contrast={1.1}
        saturation={0.9}
        zoom={1.1}
      />

      <div className="room-caption">
        <h2>SAMY'S ROOM</h2>
        <p>a quiet corner, warmed by autumn light</p>
      </div>

      <p className="room-hint">scroll to look closer · scroll up to leave</p>

      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          camera={{ position: [40, 15, 30], fov: 40 }}
          gl={{ alpha: true }}
          style={{ background: "transparent", position: "relative", zIndex: 1 }}
        >
          <fog attach="fog" args={["#f3b880", 14, 32]} />
          <ambientLight intensity={0.45} color="#ffd9b3" />
          <directionalLight position={[8, 3, 2]} intensity={1.1} color="#ff9d6c" />
          <Environment preset="sunset" />
          <RoomModel onDoorHover={setIsDoorHovered} />
          <DoorPopup visible={isDoorHovered} onLeave={leaveRoom} />
          <CameraRig />
          <OrbitControls
            ref={controlsRef}
            enableRotate={false}  
            enablePan={false}
            enableZoom={true}
            minDistance={6}
            maxDistance={MAX_ZOOM_DISTANCE}
          />
        </Canvas>
      </Suspense>

      <ShapeOverlay ref={overlayRef} />
    </div>
  );
}