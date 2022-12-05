import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";
import {
  FaceBufferGeometry,
  FaceTracker,
  ZapparCamera,
  ZapparCanvas,
  BrowserCompatibility,
} from "@zappar/zappar-react-three-fiber";
import VaporwaveScene from "./components/VaporwaveScene";
import ParelaxCamera from "./components/ParelaxCamera";
import { Loader } from "@zappar/zappar-react-three-fiber";

function FaceMeshMaterial() {
  const faceMapTexture = useLoader(
    TextureLoader,
    new URL("./assets/faceMeshTemplate-jason.png", import.meta.url).href
  );
  return <meshStandardMaterial transparent map={faceMapTexture} opacity={1} />;
}

function App() {
  const faceTrackerGroup = useRef();
  const envRef = useRef<Mesh>();

  return (
    <>
      <BrowserCompatibility fallback={<div>Sorry!</div>} />
      <ZapparCanvas>
        <ParelaxCamera userFacing userCameraMirrorMode="css" />

        <React.Suspense fallback={null}>
          <VaporwaveScene trackerGroup={faceTrackerGroup} />
        </React.Suspense>

        <FaceTracker ref={faceTrackerGroup}>
          <mesh>
            <FaceBufferGeometry
              attach="geometry"
              trackerGroup={faceTrackerGroup}
            />
            <FaceMeshMaterial />
          </mesh>
        </FaceTracker>

        <Loader />

        <directionalLight position={[2.5, -8, 5]} intensity={1.5} />
      </ZapparCanvas>
    </>
  );
}

export default App;
