/** biome-ignore-all lint/complexity/noUselessFragments: <noUselessFragments> */
import { TropicalIsland } from '@/components/scene/part/TropicalPlane';
import { TheatreObject } from '@/components/scene/TheatreObject';

export function ProjectIsland() {
  return (
    <>
      <TheatreObject
        id="Project: Tropical Island"
        position={[0, -1, 0]}
        rotation={[0, Math.PI / 2, 0]} // 90 derajat = PI/2
      >
        <TropicalIsland />
      </TheatreObject>
    </>
  );
}
