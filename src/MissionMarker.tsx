import React, {useMemo} from "react";
import {Img, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";

export type MissionDescriptor = {
    time: number,
    result: string,
}
const grayMarkerSrc = staticFile('avalon-mission-marker-gray.png')
const redMarkerSrc = staticFile('avalon-mission-marker-red.png')
const blueMarkerSrc = staticFile('avalon-mission-marker-blue.png')

export const MissionMarker: React.FC<{ mission: MissionDescriptor }> = ({mission}) => {

    const {fps, durationInFrames} = useVideoConfig();
    const frame = useCurrentFrame();

    const transitionAtFrame = mission.time * fps;
    const resultImage = mission.result === "good" ? blueMarkerSrc : redMarkerSrc;

    const scaleNewImage = spring({
        fps,
        frame,
        delay: transitionAtFrame,
        durationInFrames: fps * 3,
        config: {
            mass: 4,
            stiffness: 300,
        },
    });
    const scaleOldImage = spring({
        fps,
        frame: durationInFrames - frame,
        delay: durationInFrames - transitionAtFrame,
        durationInFrames: fps,
    });

    const container: React.CSSProperties = useMemo(() => {
        return {
            padding: 4,
            height: 60,
            width: 60,
            display: "inline-block"
        };
    }, []);

    const imageCommon: React.CSSProperties = useMemo(() => {
        return {
            width: "100%",
            height: "100%",
            objectFit: "contain",
        };
    }, []);
    const imageIn: React.CSSProperties = useMemo(() => {
        return {
            scale: String(scaleNewImage),
        };
    }, [scaleNewImage]);
    const imageOut: React.CSSProperties = useMemo(() => {
        return {
            opacity: 0.3,
            scale: String(scaleOldImage),
        };
    }, [scaleOldImage]);


    return (
        <div style={container}>
            <Sequence layout="none" durationInFrames={transitionAtFrame}>
                <Img style={{...imageCommon, ...imageOut}} id="image" src={grayMarkerSrc}/>
            </Sequence>
            <Sequence layout="none" from={transitionAtFrame}>
                <Img style={{...imageCommon, ...imageIn}} id="image" src={resultImage}/>
            </Sequence>
        </div>
    );
};