import {Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion'
import React, {useMemo} from "react";
import {loadFont} from "@remotion/google-fonts/Roboto";
import {AppearanceFromTo} from "./commonConfigTypes";
import {appearAndDisappear} from "./commons";

export type PlayerDescriptor = {
    name: string
}
export type Nomination = AppearanceFromTo & { nominated: boolean };
export type Admittance = AppearanceFromTo & { admitted: boolean };
export type PlayerBoxComponentProperties = {
    player: PlayerDescriptor,
    cup: AppearanceFromTo[],
    nominations: Nomination[],
    admittances: Admittance[],
}
const {fontFamily} = loadFont();
export const PlayerBox: React.FC<PlayerBoxComponentProperties> = ({player, cup, nominations, admittances}) => {

    const frame = useCurrentFrame()
    const {fps} = useVideoConfig();

    let top = 0;
    let color = "#ddd"
    const bounceDuration = fps / 4;

    function bounce(appearance: AppearanceFromTo) {
        return interpolate(frame, [appearance.appearAt * fps, appearance.appearAt * fps + bounceDuration], [0, 1], {
            easing: Easing.sin,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }) - interpolate(frame, [appearance.appearAt * fps + bounceDuration, appearance.appearAt * fps + bounceDuration * 2], [0, 1], {
            easing: Easing.sin,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
    }

    for (let i = 0; i < nominations.length; i++) {
        top += bounce(nominations[i]);
        if (nominations[i].nominated && nominations[i].appearAt <= frame / fps && frame / fps <= nominations[i].disappearAt) {
            color = "#d09e3f"
        }
    }
    for (let i = 0; i < admittances.length; i++) {
        top += bounce(admittances[i]);
    }

    const admitStyle: React.CSSProperties = useMemo(() => {
        return {
            height: "1em",
            objectFit: "contain",
            display: "block",
            paddingRight: 7,
        };
    }, []);
    let admittedImage: React.JSX.Element = <Img style={{...admitStyle, opacity:0}} src={staticFile("avalon-approve.png")}/>;
    for (let i = 0; i < admittances.length; i++) {
        if (admittances[i].appearAt <= frame / fps && frame / fps <= admittances[i].disappearAt) {
            if (admittances[i].admitted)
                admittedImage = <Img style={admitStyle} src={staticFile("avalon-approve.png")}/>
            else
                admittedImage = <Img style={admitStyle} src={staticFile("avalon-reject.png")}/>
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
            transform: `translateY(${top * 20}px)`
        };
    }, [top, color]);


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
            {admittedImage}
            <div>{player.name}</div>
            <Img style={cupStyle} src={staticFile("avalon-cup.png")}/>
        </div>
    );
};