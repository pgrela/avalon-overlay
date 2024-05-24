import React, {useMemo} from "react";
import {Admittance, Nomination, PlayerBox, PlayerDescriptor} from "./PlayerBox";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {AppearanceFromTo} from "./commonConfigTypes";
import {appearAndDisappear} from "./commons";


export type AdmittanceDescriptor = {
    startAt: number,
    endAt: number,
    players: string[]
};
export type PlayersBarDescriptor = {
    players: PlayerDescriptor[],
    cup: { player: string, startAt: number, endAt: number }[],
    appearances: AppearanceFromTo[],
    nominations:
        {
            startAt: number,
            endAt: number,
            players: string[]
        }[],
    admittance: AdmittanceDescriptor[]
}

export const PlayersBar: React.FC<{ playersBar: PlayersBarDescriptor }> = ({playersBar}) => {
        const frame = useCurrentFrame()
        const {fps} = useVideoConfig();
        const top = playersBar.appearances
            .map((appearance) => appearAndDisappear(appearance, 100, fps, frame))
            .reduce((c, a) => a + c, 0)

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
        const nominationsPerPlayer: { [key: string]: Nomination[] } = {};
        const admittancesPerPlayer: { [key: string]: Admittance[] } = {};
        playersBar.players.forEach((player) => {
            cupPerPlayer[player.name] = []
            nominationsPerPlayer[player.name] = []
            admittancesPerPlayer[player.name] = []
        })
        for (let i = 0; i < playersBar.cup.length; i++) {
            cupPerPlayer[playersBar.cup[i].player].push({
                appearAt: playersBar.cup[i].startAt,
                disappearAt: playersBar.cup[i].endAt
            })
        }
        for (let i = 0; i < playersBar.nominations.length; i++) {
            playersBar.players.forEach((player, j: number) => {
                nominationsPerPlayer[player.name].push({
                    appearAt: playersBar.nominations[i].startAt + 1. / 20 * j,
                    disappearAt: playersBar.nominations[i].endAt,
                    nominated: playersBar.nominations[i].players.includes(player.name)
                })
            })
        }
        for (let i = 0; i < playersBar.admittance.length; i++) {
            playersBar.players.forEach((player, j: number) => {
                admittancesPerPlayer[player.name].push({
                    appearAt: playersBar.admittance[i].startAt + 1. / 20 * j,
                    disappearAt: playersBar.admittance[i].endAt,
                    admitted: playersBar.admittance[i].players.includes(player.name)
                })
            })
        }
        const playerBoxes: React.JSX.Element[] = [];
        playersBar.players.forEach(player =>
            playerBoxes.push(<PlayerBox
                key={`playerBox${player.name}`}
                player={player}
                cup={cupPerPlayer[player.name]}
                admittances={admittancesPerPlayer[player.name]}
                nominations={nominationsPerPlayer[player.name]}/>));

        return (
            <div style={container}>
                {playerBoxes}
            </div>
        );
    }
;