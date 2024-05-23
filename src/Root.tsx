import {Composition} from "remotion";
import {Overlay} from "./Overlay";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import avalonGameDescriptor from "../public/inputs/game-video-descriptor.json"

const fps = 60;
const seconds = 20;
export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="Overlay"
                component={Overlay}
                durationInFrames={fps * seconds}
                fps={fps}
                width={1280}
                height={720}
                defaultProps={{avalonGameDescriptor}}
            />
        </>
    );
};
