import { Props as ZapperCameraProps } from "@react-three/fiber/dist/declarations/src/web/Canvas";

function CameraWrapper({ children }: ZapperCameraProps) {
  return <>{children}</>;
}

export default CameraWrapper;
