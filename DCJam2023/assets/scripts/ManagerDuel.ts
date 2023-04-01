import SoundController from "./SoundController";
import { waitSeconds } from "./Utils";
import ManagerAnimation from "./ManagerAnimation";
import { State, Settings } from "./game/Configs";
import { getTwoRandomChars } from "./game/GeneratorKey";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ManagerDuel extends cc.Component {
    private currentState: State;

    @property({ type: ManagerAnimation })
    animator: ManagerAnimation = null;

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
        this.animator.highNoon = false;

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
        this.animator.highNoon = true;

        const [a, b] = getTwoRandomChars();
        this.expectedA = a;
        this.expectedB = b;

        this.exclamation.enabled = true;
        cc.tween(this.exclamation.node)
            .set({ scale: 0.9 })
            .to(0.15, { scale: 1 }, { easing: cc.easing.backOut })
            .start();

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
        const winnerSound = player1 ? SoundController.instance.effectFall : SoundController.instance.effectFall2;

        const camera = cc.Camera.cameras[0];
        camera.backgroundColor = cc.Color.WHITE;

        SoundController.instance.playEffect(SoundController.instance.promptHit);
        waitSeconds(0.2).then(() => SoundController.instance.playEffect(winnerSound));
        waitSeconds(1.2).then(() => SoundController.instance.playEffect(SoundController.instance.celebWin));

        this.animator.flash.opacity = 255;
        cc.tween(this.animator.flash)
            .to(Settings.repeat, { opacity: 0 }, { easing: cc.easing.quartOut })
            .call(() => {
                waitSeconds(0.2).then(() => SoundController.instance.playEffect(SoundController.instance.promptPrepare));
                this.animator.highNoon = false;
                this.currentState = State.WarmUp;
                this.result.enabled = false;
                this.result.string = "";
            })
            .start();
    }
    //#endregion
}
