export enum State {
    WarmUp = 0,
    WaitInput = 1,
    WindDown = 2,
}

export type SettingsObject = {
    warmUp: { min: number, max: number };
    repeat: number;
}

export const Settings: SettingsObject = {
    warmUp: { min: 1, max: 4 },
    repeat: 2,
}