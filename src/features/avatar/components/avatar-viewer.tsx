'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import type { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { env } from '@/config/env';

function AvatarModel({ modelUrl }: Readonly<{ modelUrl: string | null }>) {
  const group = useRef<Group>(null);
  const [scene, setScene] = useState<Group | null>(null);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    const loader = new GLTFLoader();
    let isMounted = true;
    setScene(null);
    setHasFailed(false);
    const source = modelUrl
      ? modelUrl.startsWith('http')
        ? modelUrl
        : `${env.NEXT_PUBLIC_API_ORIGIN}${modelUrl}`
      : '/models/default-humanoid.glb';

    loader.load(
      source,
      (gltf) => {
        if (isMounted) {
          setScene(gltf.scene);
        }
      },
      undefined,
      () => {
        if (isMounted) {
          setHasFailed(true);
        }
      },
    );

    return () => {
      isMounted = false;
    };
  }, [modelUrl]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.25;
    }
  });

  if (!scene || hasFailed) {
    return <HumanoidFallback />;
  }

  return (
    <group ref={group} position={[0, -0.45, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function HumanoidFallback() {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={group} position={[0, -1, 0]}>
      <mesh position={[0, 2.35, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#d7b39b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <capsuleGeometry args={[0.42, 1.25, 16, 32]} />
        <meshStandardMaterial color="#2f9e8f" roughness={0.65} />
      </mesh>
      <mesh position={[-0.62, 1.45, 0]} rotation={[0, 0, -0.18]}>
        <capsuleGeometry args={[0.12, 1.05, 12, 24]} />
        <meshStandardMaterial color="#d7b39b" roughness={0.8} />
      </mesh>
      <mesh position={[0.62, 1.45, 0]} rotation={[0, 0, 0.18]}>
        <capsuleGeometry args={[0.12, 1.05, 12, 24]} />
        <meshStandardMaterial color="#d7b39b" roughness={0.8} />
      </mesh>
      <mesh position={[-0.2, 0.25, 0]}>
        <capsuleGeometry args={[0.15, 1.2, 12, 24]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
      <mesh position={[0.2, 0.25, 0]}>
        <capsuleGeometry args={[0.15, 1.2, 12, 24]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
    </group>
  );
}

export function AvatarViewer({
  modelUrl,
}: Readonly<{ modelUrl: string | null }>) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold">
          {modelUrl ? 'Generated avatar' : 'Avatar preview'}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {modelUrl
            ? 'Your generated 3D model.'
            : 'A preview appears here after your first photo is uploaded.'}
        </p>
      </div>
      <div className="h-[420px] bg-muted/30">
        <Canvas camera={{ position: [0, 1.6, 4], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 4, 5]} intensity={1.4} />
          <Suspense fallback={null}>
            <AvatarModel modelUrl={modelUrl} />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}
