import { Abandoned } from '@/components/scene/part/Abandoned';
import { BatuBesar } from '@/components/scene/part/BatuBesar';
import { TheatreObject } from '@/components/scene/TheatreObject';
import type { JSX } from 'react';

export function SkillsIsland(props: JSX.IntrinsicElements['group']) {
  return (
    <group {...props} dispose={null}>
      <TheatreObject
        id="SKILLS: Batu"
        position={[0, 5, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <BatuBesar position={[0, 0, 0]} rotation={[0, 0, 0]} />
      </TheatreObject>

      <TheatreObject
        id="SKILLS: Tropical Island"
        position={[0, 1, 2]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <Abandoned position={[0, 0, 0]} />
      </TheatreObject>
    </group>
  );
}
