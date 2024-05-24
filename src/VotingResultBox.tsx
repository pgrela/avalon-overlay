import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion'
import React, {useMemo} from "react";
import {loadFont} from "@remotion/google-fonts/RobotoMono";
import {appearAndDisappear} from "./commons";
import {AppearanceFromTo} from "./commonConfigTypes";

export type VotingResultDescriptor = {
    startAt: number,
    endAt: number,
    approve: number,
    reject: number
};
export type VotingResultsBarDescriptor = {
    results: VotingResultDescriptor[],
    appearances: AppearanceFromTo[]
}
const {fontFamily} = loadFont();
export const VotingResultBox: React.FC<{ votingResultsBar: VotingResultsBarDescriptor }> = ({votingResultsBar}) => {

    const frame = useCurrentFrame()
    const {fps} = useVideoConfig();

    let right = 0;
    let result = "_:_"
    for (let i = 0; i < votingResultsBar.appearances.length; i++) {
        right += appearAndDisappear(votingResultsBar.appearances[i], 330, fps, frame);
    }
    for (let i = 0; i < votingResultsBar.results.length; i++) {
        if (votingResultsBar.results[i].startAt <= frame / fps) {
            result = `${votingResultsBar.results[i].approve}:${votingResultsBar.results[i].reject}`
        }
    }
    const imageCommon: React.CSSProperties = useMemo(() => {
        return {
            width: "100%",
            height: "100%",
            objectFit: "contain",
        };
    }, []);

    const container: React.CSSProperties = useMemo(() => {
        return {
            position: "absolute",
            backgroundColor: "white",
            borderRadius: 5,
            right: right - 300,
            bottom: 30,
            padding: 10,
            height: 100,
            display: "flex",
            justifyContent: "space-between",

        };
    }, [right]);
    const score: React.CSSProperties = useMemo(() => {
        return {
            fontFamily,
            fontSize: 50,
            whiteSpace: "nowrap",
            padding: "0 10px",
        };
    }, [right]);

    return (
        <div style={container}>
            <Img style={imageCommon} src={staticFile("avalon-approve.png")}/>
            <div style={score}>{result}</div>
            <Img style={imageCommon} src={staticFile("avalon-reject.png")}/>
        </div>
    );
};