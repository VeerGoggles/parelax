import { useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FaceTracker } from "@zappar/zappar-threejs";
import { BackSide, Mesh, Object3D, TextureLoader } from "three";
import { Box, PerspectiveCamera } from "@react-three/drei";

type TrackerControlledGroupProps = {
  trackerGroup: React.MutableRefObject<(FaceTracker & THREE.Mesh) | undefined>;
};

function VaporWorldMaterial() {
  const envMapTexture = useLoader(
    TextureLoader,
    new URL("../assets/destiny-field-bg.jpg", import.meta.url).href
  );
  return (
    <meshStandardMaterial
      transparent
      map={envMapTexture}
      opacity={1}
      side={BackSide}
    />
  );
}

function VaporwaveScene({ trackerGroup }: TrackerControlledGroupProps) {
  const gltf = useLoader(GLTFLoader, "models/vapor/scene.gltf");
  const { camera } = useThree();
  const modelRef = useRef<Object3D>(null);
  const cameraRef = useRef<Object3D>(null);
  const [isVisible, setIsVisible] = useState(false);

  let targetCameraQuat = new THREE.Quaternion();
  let targetCameraRot = new THREE.Euler();
  let targetCameraPos = new THREE.Vector3();

  useFrame(() => {
    if (!trackerGroup?.current) {
      return;
    }

    // set the target value based on the current tracker value
    // POSITION
    targetCameraPos.set(
      trackerGroup?.current.position.x * 3,
      trackerGroup?.current.position.y * 3,
      trackerGroup?.current.position.z * 3
    );
    // the range of our target is ~[-1,1], so scale it up for effect
    targetCameraPos.multiplyScalar(10);

    // ROTATION
    targetCameraRot.set(
      trackerGroup?.current.rotation.x,
      trackerGroup?.current.rotation.y,
      trackerGroup?.current.rotation.z
    );
    targetCameraQuat.set(
      trackerGroup?.current.quaternion.x,
      trackerGroup?.current.quaternion.y,
      trackerGroup?.current.quaternion.z,
      trackerGroup?.current.quaternion.w
    );

    // show the model if we have a target tracking
    setIsVisible(targetCameraRot.z !== 0);

    // output section to move the camera
    // move the camera holder to mimic the user's movement
    if (modelRef?.current) {
      modelRef.current.position.set(
        modelRef.current.position.x * 0.8 - 0.2 * targetCameraPos.x,
        modelRef.current.position.y * 0.8 - 0.2 * (targetCameraPos.y - 20),
        modelRef.current.position.z * 0.8 + 0.2 * targetCameraPos.z
      );
    }
    // if (cameraRef?.current) {
    //   cameraRef.current.position.set(
    //     -targetCameraPos.x,
    //     -targetCameraPos.y - 10,
    //     targetCameraPos.z
    //   );
    // }

    // for smoothing, we'll probably end up lerping between quaternions once I get my holder squared away
    // since we shouldn't have too many issues with gimble lock in this case, we can get away with our 80-20 rule
    // not ideal (A), but works, but gimble lock (B)
    // TODO: transfer to moving the render camera for this world (A)
    // TODO: convert to a quaternion transform (B)
    if (modelRef?.current)
      modelRef?.current.rotation.set(
        modelRef?.current.rotation.x * 0.8 + 0.2 * targetCameraRot.x,
        modelRef?.current.rotation.y * 0.8 + 0.2 * targetCameraRot.y,
        modelRef?.current.rotation.z * 0.8 + 0.2 * targetCameraRot.z
      );
  });

  return (
    <object3D>
      {
        // TODO: Get this alternate camera working so we can just render from here
      }
      <object3D ref={cameraRef} position={[0, 0, -40]}>
        <PerspectiveCamera makeDefault={true} far={2000} />
      </object3D>

      {
        // CITY MODEL
      }
      <object3D ref={modelRef} visible={isVisible}>
        <mesh position={[0, -10, 100]}>
          <primitive object={gltf.scene} />
        </mesh>

        {
          // ENVIRONMENT SPHERE
        }
        <mesh position={[0, 300, 0]}>
          <sphereGeometry args={[1000, 24, 24]} />
          <VaporWorldMaterial />
        </mesh>
      </object3D>
    </object3D>
  );
}

export default VaporwaveScene;
