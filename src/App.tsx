import { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { Camera, TextureLoader } from "three";
import {
  FaceBufferGeometry,
  FaceTracker,
  ZapparCamera,
  ZapparCanvas,
  BrowserCompatibility,
} from "@zappar/zappar-react-three-fiber";
import VaporwaveScene from "./components/VaporwaveScene";
import ParelaxCamera from "./components/ParelaxCamera";

function FaceMeshMaterial() {
  const faceMapTexture = useLoader(
    TextureLoader,
    new URL("./assets/faceMeshTemplate-jason.png", import.meta.url).href
  );
  return <meshStandardMaterial transparent map={faceMapTexture} opacity={1} />;
}

function App() {
  const faceTrackerGroup = useRef();

  return (
    <>
      <BrowserCompatibility fallback={<div>Sorry!</div>} />
      <ZapparCanvas>
        <ParelaxCamera userFacing userCameraMirrorMode="css" />

        <VaporwaveScene trackerGroup={faceTrackerGroup} />

        <FaceTracker ref={faceTrackerGroup}>
          <mesh>
            <FaceBufferGeometry
              attach="geometry"
              trackerGroup={faceTrackerGroup}
            />
            <FaceMeshMaterial />
          </mesh>
        </FaceTracker>

        <directionalLight position={[2.5, -8, 5]} intensity={1.5} />
      </ZapparCanvas>
    </>
  );
}

export default App;
