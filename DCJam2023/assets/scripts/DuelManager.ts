import { Settings, State } from "./Duel/Configs";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DuelManager extends cc.Component {
    private currentState: State;

    @property({ type: cc.Label })
    label: cc.Label = null;

    @property({ type: cc.Label })
    instruction1: cc.Label = null;

    @property({ type: cc.Label })
    instruction2: cc.Label = null;

    @property({ type: cc.Label })
    result: cc.Label = null;

    private _timer: number;

    //#region Setters
    get timer(): number {
        return this._timer;
    }

    set timer(t: number) {
        this._timer = Math.max(t, 0);
    }
    //#endregion

    //#region Cocos
    protected onLoad(): void {
        this.currentState = State.WarmUp;
        this.setupTimer();
    }

    protected setupTimer(): void {
        const { min, max } = Settings.warmUp;
        if (max < min) throw new Error ("Max bigger than min on Game Warmup timer.");

        const interval = max - min;
        this.timer = (Math.random() * interval) + min;
        console.error('Wait time: ', this.timer)
    }

    protected lateUpdate(dt: number): void {
        switch (this.currentState) {
            case State.WarmUp:
                this.doWarmUp(dt);
                break;
            case State.WaitInput:
                break;
            default:
                break;
        }
    }
    //#endregion

    protected doWarmUp(dt: number): void {
        this.timer = this.timer - dt;
        if (this.timer === 0) {
            this.setupTimer();
            this.doWaitInput();
        }
    }

    protected doWaitInput(): void {
        this.currentState = State.WaitInput;

        this.label.enabled = true;
        this.instruction1.enabled = true;
        this.instruction1.string = 'a';

        this.instruction2.enabled = true;
        this.instruction2.string = 'm';

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    protected onKeyDown(e: KeyboardEvent): void {
        const { keyCode } = e;
        if (keyCode !== 65 && keyCode !== 77) return;
        this.currentState = State.WindDown;

        this.label.enabled = false;
        this.instruction1.enabled = false;
        this.instruction2.enabled = false;

        this.result.enabled = true;
        this.result.string = keyCode === 65 ? "<" : ">";

        const camera = cc.Camera.cameras[0];
        camera.backgroundColor = cc.Color.WHITE;

        cc.tween(camera)
            .to(Settings.repeat, { backgroundColor: cc.Color.BLACK }, { easing: cc.easing.quartOut })
            .call(() => {
                this.currentState = State.WarmUp;
                this.result.enabled = false;
                this.result.string = "";
            })
            .start();
    }
}
