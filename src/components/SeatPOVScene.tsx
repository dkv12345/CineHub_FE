import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { SeatZone } from "../store";

type Props = {
  seatId: string;
  rowIndex: number;
  columnIndex: number;
  columns: number;
  zone: SeatZone;
  backdrop: string;
};

export default function SeatPOVScene({ seatId, rowIndex, columnIndex, columns, zone, backdrop }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x171315);
    scene.fog = new THREE.Fog(0x171315, 18, 45);

    const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 100);
    const seatX = ((columnIndex - (columns - 1) / 2) / Math.max(columns / 2, 1)) * 3.6;
    const rowRise = 0.22;
    const seatFloor = rowIndex * rowRise;
    const seatZ = 2.1 - rowIndex * 0.58;
    camera.position.set(seatX, seatFloor + (zone === "sweetbox" ? 1.42 : 1.38), seatZ);
    camera.lookAt(0, 4.25, -13.2);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    element.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xeee8df, 0x201719, 1.35));
    const aisleLight = new THREE.PointLight(0xe4ac79, 22, 24);
    aisleLight.position.set(0, 5, 4);
    scene.add(aisleLight);
    const screenGlow = new THREE.PointLight(0xd5d9eb, 44, 28);
    screenGlow.position.set(0, 5.5, -10);
    scene.add(screenGlow);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 38),
      new THREE.MeshStandardMaterial({ color: 0x2b2526, roughness: 0.9 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.06, -4);
    scene.add(floor);

    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x302527, roughness: 0.87 });
    const wallGeometry = new THREE.BoxGeometry(0.35, 10, 28);
    [-11, 11].forEach((x) => {
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(x, 4.8, -5);
      scene.add(wall);
    });

    const screenGeometry = new THREE.PlaneGeometry(17, 9.5, 48, 1);
    const vertices = screenGeometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < vertices.count; i += 1) {
      const x = vertices.getX(i);
      vertices.setZ(i, 0.042 * x * x);
    }
    vertices.needsUpdate = true;
    screenGeometry.computeVertexNormals();
    const screenMaterial = new THREE.MeshBasicMaterial({ color: 0xe7e2d9, side: THREE.DoubleSide, toneMapped: false });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 5.35, -13.2);
    scene.add(screen);
    const screenFill = new THREE.Mesh(
      screenGeometry.clone(),
      new THREE.MeshBasicMaterial({ color: 0xf2e9dc, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }),
    );
    screenFill.position.copy(screen.position);
    screenFill.position.z += 0.025;
    scene.add(screenFill);

    let texture: THREE.Texture | null = null;
    let active = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(backdrop, (loaded) => {
      if (!active) { loaded.dispose(); return; }
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
      texture = loaded;
      screenMaterial.map = loaded;
      screenMaterial.color.set(0xffffff);
      screenMaterial.needsUpdate = true;
    });

    const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x59363b, roughness: 0.76 });
    const seatCushion = new THREE.BoxGeometry(0.95, 0.18, 0.72);
    const seatBack = new THREE.BoxGeometry(0.9, 0.84, 0.16);
    for (let row = Math.max(0, rowIndex - 3); row < rowIndex; row += 1) {
      const rowsAhead = rowIndex - row;
      const z = seatZ - rowsAhead * 1.28;
      const floorHeight = row * rowRise;
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(24, 0.16, 1.15),
        new THREE.MeshStandardMaterial({ color: 0x362b2b, roughness: 0.9 }),
      );
      step.position.set(0, floorHeight - 0.08, z);
      scene.add(step);
      const spacing = Math.max(1.4, 20 / Math.max(columns, 12));
      for (let column = -Math.ceil(columns / 2); column < Math.ceil(columns / 2); column += 1) {
        const x = column * spacing;
        const cushion = new THREE.Mesh(seatCushion, chairMaterial);
        cushion.position.set(x, floorHeight + 0.28, z);
        scene.add(cushion);
        const back = new THREE.Mesh(seatBack, chairMaterial);
        back.position.set(x, floorHeight + 0.78, z - 0.25);
        scene.add(back);
      }
    }

    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(17.3, 0.12, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xb75c69, emissive: 0x3b1118, metalness: 0.2, roughness: 0.42 }),
    );
    trim.position.set(0, 0.45, -12.95);
    scene.add(trim);

    const resizeObserver = new ResizeObserver(() => {
      const width = Math.max(element.clientWidth, 1);
      const height = Math.max(element.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
    resizeObserver.observe(element);

    let frame = 0;
    const render = () => {
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.dispose();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
        meshMaterials.forEach((material) => materials.add(material));
      });
      materials.forEach((material) => material.dispose());
      texture?.dispose();
      renderer.domElement.remove();
    };
  }, [backdrop, columnIndex, columns, rowIndex, zone]);

  return <div ref={host} className="seat-pov h-[480px] w-full overflow-hidden rounded-2xl" role="img" aria-label={`Góc nhìn từ ghế ${seatId} hướng về màn hình`} />;
}