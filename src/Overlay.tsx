import {AbsoluteFill, staticFile, Video,} from "remotion";
import React from "react";
import {MissionsBarDescriptor, MissionsProgress} from "./MissionsProgress";
import {PlayersBar, PlayersBarDescriptor} from "./PlayersBar";
import {VotingResultBox, VotingResultsBarDescriptor} from "./VotingResultBox";

export type AvalonGameDescriptor = {
    missionsBar: MissionsBarDescriptor,
    playersBar: PlayersBarDescriptor,
    votingResultsBar: VotingResultsBarDescriptor,
}


export const Overlay: React.FC<{
    avalonGameDescriptor: AvalonGameDescriptor
}> = ({avalonGameDescriptor}) => {

    return (
        <>
            <AbsoluteFill>
                <Video startFrom={20000} src={staticFile("inputs/video.mp4")}/>
            </AbsoluteFill>
            <AbsoluteFill>
                <MissionsProgress missionsBar={avalonGameDescriptor.missionsBar}/>
            </AbsoluteFill>
            <AbsoluteFill>
                <PlayersBar playersBar={avalonGameDescriptor.playersBar}/>
            </AbsoluteFill>
            <AbsoluteFill>
                <VotingResultBox results={avalonGameDescriptor.votingResultsBar.results}/>
            </AbsoluteFill>
        </>
    );
};
