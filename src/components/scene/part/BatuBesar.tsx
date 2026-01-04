import type { JSX } from 'react';
import { useGLTF } from '@react-three/drei';
import type * as THREE from 'three';

export function BatuBesar(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/3d/batu_besar.glb');
  return (
    <group {...props} dispose={null}>
      <group position={[1.64, -2.196, 10.734]}>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Object_64 as THREE.Mesh).geometry}
          material={materials.RocksBig}
          position={[-1.685, 0, -10.673]}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/3d/batu_besar.glb');
