import SoundController from "./SoundController";
import { State, Settings } from "./game/Configs";
import { getTwoRandomChars } from "./game/KeyManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ManagerDuel extends cc.Component {
    private currentState: State;

    @property({ type: cc.Label })
    exclamation: cc.Label = null;

    @property({ type: cc.Label })
    result: cc.Label = null;

    @property({ type: cc.Label })
    instructionA: cc.Label = null;

    @property({ type: cc.Label })
    instructionB: cc.Label = null;

    private expectedA: string;
    private expectedB: string;
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

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
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

    protected setupTimer(): void {
        const { min, max } = Settings.warmUp;
        if (max < min) throw new Error ("Max bigger than min on Game Warmup timer.");

        const interval = max - min;
        this.timer = (Math.random() * interval) + min;
        console.error('Wait time: ', this.timer)
    }

    protected onKeyDown(e: KeyboardEvent): void {
        const { keyCode } = e;
        const keyA = this.expectedA.charCodeAt(0);
        const keyB = this.expectedB.charCodeAt(0);
        if (this.currentState !== State.WaitInput || (keyCode !== keyA && keyCode !== keyB)) return;

        this.currentState = State.WindDown;
        this.doWindDown(keyCode === keyA);
    }
    //#endregion

    //#region States
    protected doWarmUp(dt: number): void {
        this.timer = this.timer - dt;
        if (this.timer === 0) {
            this.setupTimer();
            SoundController.instance.playEffect(SoundController.instance.promptGo);
            this.doWaitInput();
        }
    }

    protected doWaitInput(): void {
        this.currentState = State.WaitInput;

        const [a, b] = getTwoRandomChars();
        this.expectedA = a;
        this.expectedB = b;

        this.exclamation.enabled = true;

        this.instructionA.enabled = true;
        this.instructionA.string = this.expectedA;

        this.instructionB.enabled = true;
        this.instructionB.string = this.expectedB;
    }

    protected doWindDown(player1: boolean): void {
        this.currentState = State.WindDown;

        this.exclamation.enabled = false;
        this.instructionA.enabled = false;
        this.instructionB.enabled = false;

        this.result.enabled = true;
        this.result.string = player1 ? "<" : ">";

        const camera = cc.Camera.cameras[0];
        camera.backgroundColor = cc.Color.WHITE;

        SoundController.instance.playEffect(SoundController.instance.promptHit);
        SoundController.instance.playEffect(SoundController.instance.celebWin);

        cc.tween(camera)
            .to(Settings.repeat, { backgroundColor: cc.Color.BLACK }, { easing: cc.easing.quartOut })
            .call(() => {
                this.currentState = State.WarmUp;
                this.result.enabled = false;
                this.result.string = "";
            })
            .start();
    }
    //#endregion
}
