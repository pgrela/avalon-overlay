import {AbsoluteFill, staticFile, Video,} from "remotion";
import React from "react";
import {MissionsBarDescriptor, MissionsProgress} from "./MissionsProgress";
import {PlayersBar, PlayersBarDescriptor} from "./PlayersBar";
import {VotingResultBox, VotingResultsBarDescriptor} from "./VotingResultBox";
import {MissionResultBar, MissionResultsBarDescriptor} from "./MissionResultBar";

export type AvalonGameDescriptor = {
    missionsBar: MissionsBarDescriptor,
    playersBar: PlayersBarDescriptor,
    votingResultsBar: VotingResultsBarDescriptor,
    missionResultsBar: MissionResultsBarDescriptor,
}


export const Overlay: React.FC<{
    avalonGameDescriptor: AvalonGameDescriptor
}> = ({avalonGameDescriptor}) => {

    return (
        <>
            <AbsoluteFill>
                <Video startFrom={120*60} src={staticFile("inputs/video.mp4")}/>
            </AbsoluteFill>
            <AbsoluteFill>
                <MissionsProgress missionsBar={avalonGameDescriptor.missionsBar}/>
            </AbsoluteFill>
            <AbsoluteFill>
                <PlayersBar playersBar={avalonGameDescriptor.playersBar}/>
            </AbsoluteFill>
            <AbsoluteFill>
                <VotingResultBox votingResultsBar={avalonGameDescriptor.votingResultsBar}/>
            </AbsoluteFill>
            <AbsoluteFill>
                <MissionResultBar missionResultsBar={avalonGameDescriptor.missionResultsBar}/>
            </AbsoluteFill>
        </>
    );
};
