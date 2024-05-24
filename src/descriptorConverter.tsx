import {
    Actions,
    BetterAvalonGameDescriptor,
    Faction,
    FinalVoting,
    Mission,
    ToggleAction,
    VideoAvalonGameDescriptor,
    VideoFinalVoting,
    VideoMission,
    VideoVoting,
    Voting,
    VotingScore
} from "../public/inputs-sample/game-video-descriptor";
import {MissionsBarDescriptor} from "./MissionsProgress";
import {AdmittanceDescriptor, PlayersBarDescriptor} from "./PlayersBar";
import {VotingResultDescriptor, VotingResultsBarDescriptor} from "./VotingResultBox";
import {MissionResultDescriptor, MissionResultsBarDescriptor} from "./MissionResultBar";
import {AvalonGameDescriptor} from "./Overlay";
import {MissionDescriptor} from "./MissionMarker";
import {AppearanceFromTo} from "./commonConfigTypes";

type PreProcessedVoting = UnifiedVoting & { endsAt: number }
type UnifiedVoting = {
    leader: string;
    score?: VotingScore;
    nominees: string[];
    admittedInFavour?: string[],
    leaderAtTime: number
    nomineesAtTime: number
    admittedInFavourAtTime?: number
    scoreAtTime?: number
};
type PreProcessedMission = { failures: number; successes: number; wonBy: Faction, startAt: number, endAt: number };

function timeToSeconds(time: string) {
    const parts = time.split(":");
    if (parts.length === 1) return Number(parts[0])
    if (parts.length === 2) return Number(parts[0]) * 60 + Number(parts[1])
    if (parts.length === 3) return Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2])
    throw new Error(`Unknown time format '${time}`);
}

export class Converter {
    private game: BetterAvalonGameDescriptor;
    private video: VideoAvalonGameDescriptor;

    constructor(game: BetterAvalonGameDescriptor, video: VideoAvalonGameDescriptor) {
        this.game = game;
        this.video = video;
    }

    toComponentsDescriptor(): AvalonGameDescriptor {
        return {
            missionsBar: this.toMissionsBar(),
            playersBar: this.toPlayersBar(),
            votingResultsBar: this.toVotingResultBar(),
            missionResultsBar: this.toMissionResultsBar(),
        };
    }

    private toMissionResultsBar(): MissionResultsBarDescriptor {
        return {
            results: this.mergedMissions()
                .map(mission => ({
                    startAt: mission.startAt,
                    endAt: mission.endAt,
                    successes: mission.successes,
                    failures: mission.failures,
                } as MissionResultDescriptor)),
            appearances: this.toEventPairs(Actions.ShowCupsResults, Actions.HideCupsResults),
        }
    }

    private toVotingResultBar(): VotingResultsBarDescriptor {
        return {
            results: this.mergedVoting()
                .filter(voting => voting.score !== undefined)
                .map(voting => ({
                    startAt: voting.scoreAtTime,
                    endAt: voting.endsAt,
                    approve: voting.score?.approve,
                    reject: voting.score?.reject,
                } as VotingResultDescriptor)),
            appearances: this.toEventPairs(Actions.ShowApproveRejectBox, Actions.HideApproveRejectBox),
        };
    }

    private toEventPairs(show: ToggleAction, hide: ToggleAction): AppearanceFromTo[] {
        const actions = this.video.toggles.map(t => ({time: timeToSeconds(t.time), action: t.action}))
            .sort((a, b) => a.time - b.time)
            .filter(t => [show, hide].includes(t.action));
        let i = 0;
        const r: AppearanceFromTo[] = [];
        while (i < actions.length) {
            while (i < actions.length && actions[i].action !== show) ++i;
            if (i >= actions.length) break;
            const start = actions[i];
            ++i;
            while (i < actions.length && actions[i].action !== hide) ++i;
            if (i >= actions.length) {
                r.push({appearAt: start.time, disappearAt: Number.MAX_VALUE});
                break;
            }
            r.push({appearAt: start.time, disappearAt: actions[i].time});
            ++i;
        }
        return r;
    }

    private toPlayersBar(): PlayersBarDescriptor {
        return {
            players: this.game.playersInOrder.map((player) => ({name: player})),
            appearances: this.toEventPairs(Actions.ShowPlayersBar, Actions.HidePlayersBar),
            nominations: this.mergedVoting().map(voting => ({
                startAt: voting.nomineesAtTime,
                endAt: voting.endsAt,// === undefined ? voting.nomineesAtTime + 30 : voting.scoreAtTime,
                players: voting.nominees,
            })),
            cup: this.mergedVoting().map(voting => ({
                startAt: voting.leaderAtTime,
                endAt: voting.endsAt,
                player: voting.leader,
            })),
            admittance: this.mergedVoting()
                .filter(voting => voting.admittedInFavour !== undefined)
                .map(voting => ({
                    startAt: voting.admittedInFavourAtTime,
                    endAt: voting.endsAt,
                    players: voting.admittedInFavour,
                } as AdmittanceDescriptor)),
        }
    }

    private toMissionsBar(): MissionsBarDescriptor {
        return {
            missions: this.mergedMissions().map(mission => ({
                time: mission.startAt,
                result: mission.wonBy.toLowerCase(),
            } as MissionDescriptor)),
            appearances: this.toEventPairs(Actions.ShowFiveMissionsBox, Actions.HideFiveMissionsBox),
        };
    }

    private mergedVoting(): PreProcessedVoting[] {
        const list = this.votingInOrder();
        const r: PreProcessedVoting[] = []
        for (let i = 0; i < list.length; i++) {
            if (i === list.length - 1) {
                r.push({
                    ...list[i],
                    endsAt: Number.MAX_VALUE
                } as PreProcessedVoting)
            } else {
                r.push({
                    ...list[i],
                    endsAt: list[i + 1].leaderAtTime
                } as PreProcessedVoting)
            }
        }
        return r;
    }


    private mergedMissions(): PreProcessedMission[] {
        const r: PreProcessedMission[] = []
        const missions = [
            {game: this.game.mission1, video: this.video.mission1},
            {game: this.game.mission2, video: this.video.mission2},
            {game: this.game.mission3, video: this.video.mission3},
            {game: this.game.mission4, video: this.video.mission4},
            {game: this.game.mission5, video: this.video.mission5},
        ].filter(gv => gv.game !== undefined)
            .map(gv => gv as { game: Mission, video: VideoMission });
        for (let i = 0; i < missions.length; i++) {
            if (i === missions.length - 1) {
                r.push({
                    ...missions[i].game.result,
                    startAt: timeToSeconds(missions[i].video.resultAtTime),
                    endAt: Number.MAX_VALUE
                } as PreProcessedMission)
            } else {
                r.push({
                    ...missions[i].game.result,
                    startAt: timeToSeconds(missions[i].video.resultAtTime),
                    endAt: timeToSeconds(missions[i + 1].video.resultAtTime)
                } as PreProcessedMission)
            }
        }
        return r
    }

    private votingInOrder(): UnifiedVoting[] {
        return [
            this.votingInOrderFromMission(this.game.mission1, this.video.mission1),
            this.votingInOrderFromMission(this.game.mission2, this.video.mission2),
            this.votingInOrderFromMission(this.game.mission3, this.video.mission3),
            this.votingInOrderFromMission(this.game.mission4, this.video.mission4),
            this.votingInOrderFromMission(this.game.mission5, this.video.mission5),
        ].flatMap(i => i)
            .filter(i => i !== undefined) as UnifiedVoting[];
    }

    private votingInOrderFromMission(mission?: Mission, video?: VideoMission): (UnifiedVoting | undefined)[] {
        if (mission === undefined) return [];
        return [
            this.mergeVoting(mission.voting1, video?.voting1),
            this.mergeVoting(mission.voting2, video?.voting2),
            this.mergeVoting(mission.voting3, video?.voting3),
            this.mergeVoting(mission.voting4, video?.voting4),
            this.mergeFinalVoting(mission.voting5, video?.voting5),
        ]
    }

    private mergeVoting(missionVoting: Voting | undefined, videoVoting: VideoVoting | undefined): UnifiedVoting | undefined {
        if (missionVoting === undefined || videoVoting === undefined) return undefined;
        return {
            leader: missionVoting.leader,
            score: missionVoting.score,
            nominees: missionVoting.nominees,
            admittedInFavour: missionVoting.admittedInFavour,
            leaderAtTime: timeToSeconds(videoVoting.leaderAtTime),
            nomineesAtTime: timeToSeconds(videoVoting.nomineesAtTime),
            admittedInFavourAtTime: timeToSeconds(videoVoting.admittedInFavourAtTime),
            scoreAtTime: timeToSeconds(videoVoting.scoreAtTime),
        };
    }

    private mergeFinalVoting(missionVoting: FinalVoting | undefined, videoVoting: VideoFinalVoting | undefined): UnifiedVoting | undefined {
        if (missionVoting === undefined || videoVoting === undefined) return undefined;
        return {
            leader: missionVoting.leader,
            nominees: missionVoting.nominees,
            leaderAtTime: timeToSeconds(videoVoting.leaderAtTime),
            nomineesAtTime: timeToSeconds(videoVoting.nomineesAtTime),
        };
    }
}