import type { GLTF } from 'three-stdlib';
import type * as THREE from 'three';

export type GLTFResult = GLTF & {
  nodes: {
    [name: string]: THREE.Mesh;
  };
  materials: {
    [name: string]: THREE.MeshStandardMaterial;
  };
};
