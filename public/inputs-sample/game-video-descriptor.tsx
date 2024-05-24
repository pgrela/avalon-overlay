export type Faction = "good" | "evil"
export const EVIL: Faction = "evil"
export const GOOD: Faction = "good"
export type MissionResult = { failures: number; successes: number; wonBy: Faction };
export type FinalVoting = { leader: Player; nominees: Player[] };
export type VotingScore = { approve: number; reject: number };
export type Voting = {
    leader: Player;
    score: VotingScore;
    nominees: Player[];
    admittedInFavour: Player[]
};
export type Mission = {
    voting1: Voting
    voting2?: Voting
    voting3?: Voting
    voting4?: Voting
    voting5?: FinalVoting
    result: MissionResult
};
export type BetterAvalonGameDescriptor = {
    playersInOrder: Player[]
    mission1: Mission;
    mission2: Mission;
    mission3: Mission;
    mission4?: Mission;
    mission5?: Mission;
};

export type VideoTime = string;
export type VideoFinalVoting = { leaderAtTime: VideoTime; nomineesAtTime: VideoTime };
export type VideoVoting = {
    leaderAtTime: VideoTime
    nomineesAtTime: VideoTime;
    admittedInFavourAtTime: VideoTime
    scoreAtTime: VideoTime;
};
export type VideoMission = {
    voting1: VideoVoting
    voting2?: VideoVoting
    voting3?: VideoVoting
    voting4?: VideoVoting
    voting5?: VideoFinalVoting
    resultAtTime: VideoTime
};
export type ToggleAction = string

export class Actions {
    public static readonly ShowPlayersBar: ToggleAction = "ShowPlayersBar"
    public static readonly ShowFiveMissionsBox: ToggleAction = "ShowFiveMissionsBox"
    public static readonly ShowApproveRejectBox: ToggleAction = "ShowApproveRejectBox"
    public static readonly ShowCupsResults: ToggleAction = "ShowCupsResults"
    public static readonly HidePlayersBar: ToggleAction = "HidePlayersBar"
    public static readonly HideFiveMissionsBox: ToggleAction = "HideFiveMissionsBox"
    public static readonly HideApproveRejectBox: ToggleAction = "HideApproveRejectBox"
    public static readonly HideCupsResults: ToggleAction = "HideCupsResults"
}

export type ToggleAnimation = {
    time: VideoTime
    action: ToggleAction
}
export type VideoAvalonGameDescriptor = {
    mission1: VideoMission;
    mission2: VideoMission;
    mission3: VideoMission;
    mission4?: VideoMission;
    mission5?: VideoMission;
    toggles: ToggleAnimation[];
};


export type Player = string;
const Anna: Player = "Anna";
const Bertha: Player = "Bertha";
const Chuck: Player = "Chuck";
const Denis: Player = "Denis";
const Eva: Player = "Eva";
const Felix: Player = "Felix";
const Gregory: Player = "Gregory";
const Henry: Player = "Henry";
const Isabel: Player = "Isabel";
const James: Player = "James";
export const game: BetterAvalonGameDescriptor = {
    playersInOrder: [Anna, Bertha, Chuck, Denis, Eva, Felix, Gregory, Henry, Isabel, James],
    mission1: {
        voting1:
            {
                leader: Anna,
                nominees: [Bertha, Chuck, Denis, Eva],
                admittedInFavour: [Denis, Eva, Felix, Gregory],
                score: {
                    approve: 7,
                    reject: 3,
                }
            },
        voting2:
            {
                leader: Anna,
                nominees: [Bertha, Chuck, Denis, Eva],
                admittedInFavour: [Denis, Eva, Felix, Gregory],
                score: {
                    approve: 7,
                    reject: 3,
                }
            },
        voting3:
            {
                leader: Anna,
                nominees: [Bertha, Chuck, Denis, Eva],
                admittedInFavour: [Denis, Eva, Felix, Gregory],
                score: {
                    approve: 7,
                    reject: 3,
                }
            },
        voting4:
            {
                leader: Anna,
                nominees: [Bertha, Chuck, Denis, Eva],
                admittedInFavour: [Denis, Eva, Felix, Gregory],
                score: {
                    approve: 7,
                    reject: 3,
                }
            },
        voting5: {
            leader: Anna,
            nominees: [Felix, Henry],
        },
        result: {
            successes: 3,
            failures: 1,
            wonBy: GOOD,
        }
    },

    mission2: {
        voting1:
            {
                leader: Anna,
                nominees: [Bertha, Chuck, Denis, Eva],
                admittedInFavour: [Denis, Eva, Felix, Gregory],
                score: {
                    approve: 7,
                    reject: 3,
                }
            },
        voting2:
            {
                leader: Anna,
                nominees: [Bertha, Chuck, Denis, Eva],
                admittedInFavour: [Denis, Eva, Felix, Gregory],
                score: {
                    approve: 7,
                    reject: 3,
                }
            },
        voting3:
            {
                leader: Anna,
                nominees: [Bertha, Chuck, Denis, Eva],
                admittedInFavour: [Denis, Eva, Felix, Gregory],
                score: {
                    approve: 7,
                    reject: 3,
                }
            },
        voting4:
            {
                leader: Anna,
                nominees: [Bertha, Chuck, Denis, Eva],
                admittedInFavour: [Denis, Eva, Felix, Gregory],
                score: {
                    approve: 7,
                    reject: 3,
                }
            },
        voting5: {
            leader: Anna,
            nominees: [Felix, Henry],
        },
        result: {
            successes: 3,
            failures: 1,
            wonBy: EVIL,
        }
    },

    mission3: {
        voting1:
            {
                leader: Anna,
                nominees: [Bertha, Chuck, Denis, Eva],
                admittedInFavour: [Denis, Eva, Felix, Gregory],
                score: {
                    approve: 7,
                    reject: 3,
                }
            },
        voting2:
            {
                leader: Anna,
                nominees: [Bertha, Chuck, Denis, Eva],
                admittedInFavour: [Denis, Eva, Felix, Gregory],
                score: {
                    approve: 7,
                    reject: 3,
                }
            },
        voting3:
            {
                leader: Anna,
                nominees: [Bertha, Chuck, Denis, Eva],
                admittedInFavour: [Denis, Eva, Felix, Gregory],
                score: {
                    approve: 7,
                    reject: 3,
                }
            },
        voting4:
            {
                leader: Anna,
                nominees: [Bertha, Chuck, Denis, Eva],
                admittedInFavour: [Denis, Eva, Felix, Gregory],
                score: {
                    approve: 7,
                    reject: 3,
                }
            },
        voting5: {
            leader: Anna,
            nominees: [Felix, Henry],
        },
        result: {
            successes: 3,
            failures: 1,
            wonBy: EVIL,
        }
    }
}

export const video: VideoAvalonGameDescriptor = {
    mission1: {
        voting1: {
            leaderAtTime: "00:00:02",
            nomineesAtTime: "00:00:04",
            admittedInFavourAtTime: "00:00:06",
            scoreAtTime: "00:00:08",
        },
        resultAtTime: "00:00:09"
    },

    mission2: {
        voting1: {
            leaderAtTime: "00:00:10",
            nomineesAtTime: "00:00:12",
            admittedInFavourAtTime: "00:00:14",
            scoreAtTime: "00:00:16",
        },
        resultAtTime: "00:00:18"
    },

    mission3: {
        voting1: {
            leaderAtTime: "00:00:20",
            nomineesAtTime: "00:00:22",
            admittedInFavourAtTime: "00:00:24",
            scoreAtTime: "00:00:26",
        },
        resultAtTime: "00:00:28"
    },
    toggles:[]
}