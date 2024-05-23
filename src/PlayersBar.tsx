import React, {useMemo} from "react";
import {PlayerBox, PlayerDescriptor} from "./PlayerBox";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {AppearanceFromTo} from "./commonConfigTypes";
import {appearAndDisappear} from "./commons";


export type PlayersBarDescriptor = {
    players: PlayerDescriptor[],
    cup: { player: string, startAt: number, endAt: number }[],
    appearances: AppearanceFromTo[],
    nominations:
        {
            startAt: number,
            endAt: number,
            players: string[]
        }[]
}

export const PlayersBar: React.FC<{ playersBar: PlayersBarDescriptor }> = ({playersBar}) => {
    const frame = useCurrentFrame()
    const {fps} = useVideoConfig();
    let top = 0;
    for (let i = 0; i < playersBar.appearances.length; i++) {
        top += appearAndDisappear(playersBar.appearances[i], 100, fps, frame);
    }
    const container: React.CSSProperties = useMemo(() => {
        return {
            position: "absolute",
            backgroundColor: "white",
            borderRadius: 5,
            left: "2%",
            width: "96%",
            top: top - 95,
            padding: 3,
            display: "flex",
            justifyContent: "space-around"
        };
    }, [top]);
    const cupPerPlayer: { [key: string]: AppearanceFromTo[] } = {};
    const nominationsPerPlayer: { [key: string]: AppearanceFromTo[] } = {};
    playersBar.players.forEach((player) => {
        cupPerPlayer[player.name] = []
        nominationsPerPlayer[player.name] = []
    })
    for (let i = 0; i < playersBar.cup.length; i++) {
        cupPerPlayer[playersBar.cup[i].player].push({
            appearAt: playersBar.cup[i].startAt,
            disappearAt: playersBar.cup[i].endAt
        })
    }
    for (let i = 0; i < playersBar.nominations.length; i++) {
        for (let j = 0; j < playersBar.nominations[i].players.length; j++) {
            nominationsPerPlayer[playersBar.nominations[i].players[j]].push({
                appearAt: playersBar.nominations[i].startAt+1./10*j,
                disappearAt: playersBar.nominations[i].endAt,
            })
        }
    }
    const playerBoxes: React.JSX.Element[] = [];
    for (let i = 0; i < playersBar.players.length; i++) {
        playerBoxes.push(<PlayerBox key={`playerBox${i}`} player={playersBar.players[i]} cup={cupPerPlayer[playersBar.players[i].name]} nominations={nominationsPerPlayer[playersBar.players[i].name]}/>);
    }
    return (
        <div style={container}>
            {playerBoxes}
        </div>
    );
};