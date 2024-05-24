import {Composition} from "remotion";
import {Overlay} from "./Overlay";
import {Converter} from "./descriptorConverter";
import {game, video} from "../public/inputs-sample/the-actual-game";

const gameDescriptor = new Converter(game, video).toComponentsDescriptor();
const fps = 60;
const seconds = 15*60+20;
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
                defaultProps={{avalonGameDescriptor: gameDescriptor}}
            />
        </>
    );
};
