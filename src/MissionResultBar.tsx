import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion'
import React, {useMemo} from "react";
import {appearAndDisappear} from "./commons";
import {AppearanceFromTo} from "./commonConfigTypes";

export type MissionResultDescriptor = {
    startAt: number,
    endAt: number,
    successes: number,
    failures: number
};
export type MissionResultsBarDescriptor = {
    results: MissionResultDescriptor[],
    appearances:AppearanceFromTo[]
}
export const MissionResultBar: React.FC<{missionResultsBar:MissionResultsBarDescriptor}> = ({missionResultsBar}) => {

    const frame = useCurrentFrame()
    const {fps} = useVideoConfig();

    let right = 0;
    const imageCommon: React.CSSProperties = useMemo(() => {
        return {
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "0 5px",
        };
    }, []);
    const missionImages: React.JSX.Element[] = []
    for (let i = 0; i < missionResultsBar.appearances.length; i++) {
        right += appearAndDisappear(missionResultsBar.appearances[i], 430, fps, frame);
    }
    for (let i = 0; i < missionResultsBar.results.length; i++) {
        if (missionResultsBar.results[i].startAt <= frame / fps && frame / fps < missionResultsBar.results[i].endAt) {
            for (let j = 0; j < missionResultsBar.results[i].successes; j++) {
                missionImages.push(<Img style={imageCommon} src={staticFile("avalon-success.png")}/>)
            }
            for (let j = 0; j < missionResultsBar.results[i].failures; j++) {
                missionImages.push(<Img style={imageCommon} src={staticFile("avalon-fail.png")}/>)
            }
        }
    }

    const container: React.CSSProperties = useMemo(() => {
        return {
            position: "absolute",
            backgroundColor: "white",
            borderRadius: 5,
            right: right - 400,
            bottom: 30,
            padding: 10,
            height: 100,
            display: "flex",
            justifyContent: "space-between",

        };
    }, [right]);

    return (
        <div style={container}>
            {missionImages}
        </div>
    );
};