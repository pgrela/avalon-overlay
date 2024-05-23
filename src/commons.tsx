import {AppearanceFromTo} from "./commonConfigTypes";
import {interpolate, spring, SpringConfig} from "remotion";

type partialSrpingConfig = Partial<{
    config: Partial<SpringConfig>;
    durationInFrames: number
}>;

export function appearAndDisappear(appearance: AppearanceFromTo, maximalValue: number, fps: number, frame: number, appearanceSpringConfig: partialSrpingConfig = {}, disappearanceSpringConfig: partialSrpingConfig = {}) {
    return interpolate(spring({
            fps,
            frame,
            delay: appearance.appearAt * fps,
            ...appearanceSpringConfig
        }), [0, 1], [0, maximalValue])
        - interpolate(spring({
            fps,
            frame,
            delay: appearance.disappearAt * fps,
            ...disappearanceSpringConfig
        }), [0, 1], [0, maximalValue]);
}