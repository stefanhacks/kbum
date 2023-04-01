export class Config {
    public difficulty: AIDifficulty;
    private static _instance: Config;

    public static get instance() {
        return this._instance || (this._instance = new this());
    }
}

export enum State {
    WarmUp = 0,
    WaitInput = 1,
    WindDown = 2,
}

export enum AIDifficulty {
    Easy = 0,
    Hard = 1,
    YouWillDie = 2,
}

type MinMax = { min: number, max: number };

export type SettingsObject = {
    warmUp: MinMax;
    repeat: number;
}

export const Settings: SettingsObject = {
    warmUp: { min: 3, max: 8 },
    repeat: 5,
}

export const TimersAI = {
    [AIDifficulty.Easy]: { min: 1.5, max: 2 },
    [AIDifficulty.Hard]: { min: 0.75, max: 1.25 },
    [AIDifficulty.YouWillDie]: { min: 0.25, max: 0.5}
}