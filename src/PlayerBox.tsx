import {Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion'
import React, {useMemo} from "react";
import {loadFont} from "@remotion/google-fonts/Roboto";
import {AppearanceFromTo} from "./commonConfigTypes";
import {appearAndDisappear} from "./commons";

export type PlayerDescriptor = {
    name: string
}
export type PlayerBoxComponentProperties = {
    player: PlayerDescriptor,
    cup: AppearanceFromTo[],
    nominations: AppearanceFromTo[],
}
const {fontFamily} = loadFont();
export const PlayerBox: React.FC<PlayerBoxComponentProperties> = ({player, cup, nominations}) => {

    const frame = useCurrentFrame()
    const {fps} = useVideoConfig();

    let top = 0;
    let color = "#ddd"
    const bounceDuration = fps / 2;
    for (let i = 0; i < nominations.length; i++) {
        top += interpolate(frame, [nominations[i].appearAt * fps, nominations[i].appearAt * fps + bounceDuration], [0, 1], {
            easing: Easing.bounce,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
        top -= interpolate(frame, [nominations[i].appearAt * fps + bounceDuration, nominations[i].appearAt * fps + bounceDuration * 2], [0, 1], {
            easing: Easing.bounce,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
        if(nominations[i].appearAt<=frame/fps && frame/fps<=nominations[i].disappearAt){
            color = "#d09e3f"
        }

    }
    const container: React.CSSProperties = useMemo(() => {
        return {
            padding: 2,
            width: "100%",
            marginLeft: 4,
            marginRight: 4,
            display: "flex",
            fontFamily,
            fontSize: 20,
            backgroundColor: color,
            borderRadius: 3,
            textAlign: "left",
            paddingLeft: 7,
            justifyContent: "space-between",
            alignItems: "center",
            transform: `translateY(${top*20}px)`
        };
    }, [top,color]);


    let scaleCup = 0;
    for (let i = 0; i < cup.length; i++) {
        scaleCup += appearAndDisappear(cup[i], 1, fps, frame, {
            config: {
                mass: 10,
                stiffness: 115,
            },
            durationInFrames: fps,
        }, {
            config: {},
            durationInFrames: fps / 2,
        })
    }

    const cupStyle: React.CSSProperties = useMemo(() => {
        return {
            height: "1em",
            objectFit: "contain",
            display: "block",
            paddingRight: 7,
            scale: String(scaleCup),
        };
    }, [scaleCup]);


    return (
        <div style={container}>
            <div>{player.name}</div>
            <Img style={cupStyle} src={staticFile("avalon-cup.png")}/>
        </div>
    );
};