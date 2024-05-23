import React, {useMemo} from "react";
import {MissionDescriptor, MissionMarker} from "./MissionMarker";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {AppearanceFromTo} from "./commonConfigTypes";
import {appearAndDisappear} from "./commons";


export type MissionsBarDescriptor = {
    missions: MissionDescriptor[],
    appearances: AppearanceFromTo[]
}

export const MissionsProgress: React.FC<{ missionsBar: MissionsBarDescriptor }> = ({missionsBar}) => {
    const {fps, durationInFrames} = useVideoConfig();
    const frame = useCurrentFrame();

    const missionsProperties: MissionDescriptor[] = [];
    for (let i = 0; i < 5; i++) {
        if (missionsBar.missions.length > i) {
            missionsProperties[i] = missionsBar.missions[i];
        } else {
            missionsProperties[i] = {time: durationInFrames / fps + 1, result: "none"}
        }
    }

    let left = 0;
    for (let i = 0; i < missionsBar.appearances.length; i++) {
        left = +appearAndDisappear(missionsBar.appearances[i], 430, fps, frame);
    }

    const container: React.CSSProperties = useMemo(() => {
        return {
            position: "absolute",
            backgroundColor: "white",
            borderRadius: 5,
            left: left - 400,
            bottom: 30,
            padding: 10,
        };
    }, [left]);

    return (
        <div style={container}>
            <MissionMarker mission={missionsProperties[0]}/>
            <MissionMarker mission={missionsProperties[1]}/>
            <MissionMarker mission={missionsProperties[2]}/>
            <MissionMarker mission={missionsProperties[3]}/>
            <MissionMarker mission={missionsProperties[4]}/>
        </div>
    );
};