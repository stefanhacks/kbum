import SoundController from "./SoundController";
import { waitSeconds } from "./Utils";
import ManagerAnimation from "./ManagerAnimation";
import { State, Settings, TimersAI, Config } from "./game/Configs";
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
    instructionA: cc.Label = null;

    @property({ type: cc.Label })
    instructionB: cc.Label = null;

    private expectedA: string;
    private expectedB: string;
    private _timer: number;
    private _timerAI: number;
    private gongSoundId: number;

    //#region Setters
    get timer(): number {
        return this._timer;
    }

    set timer(t: number) {
        this._timer = Math.max(t, 0);
    }

    get timerAI(): number {
        return this._timerAI;
    }

    set timerAI(t: number) {
        this._timerAI = Math.max(t, 0);
    }
    //#endregion

    //#region Cocos
    protected onLoad(): void {
        this.currentState = State.WarmUp;
        this.setupTimerAI();
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
                if (Config.instance.difficulty !== undefined) this.callAI(dt)
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

    protected setupTimerAI(): void {
        console.log(Config.instance.difficulty)
        if (Config.instance.difficulty === undefined) return;
        const { min, max } = TimersAI[Config.instance.difficulty];

        const interval = max - min;
        this.timerAI = (Math.random() * interval) + min;
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
            SoundController.instance.playEffect(SoundController.instance.bell);
            this.gongSoundId = SoundController.instance.playEffect(SoundController.instance.gong);
            this.setupTimerAI();
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

        if (Config.instance.difficulty === undefined) {
            this.instructionB.enabled = true;
            this.instructionB.string = this.expectedB;
        }
    }

    protected doWindDown(player1: boolean): void {
        this.currentState = State.WindDown;

        this.exclamation.enabled = false;
        this.instructionA.enabled = false;
        this.instructionB.enabled = false;

        const winnerSound = player1 ? SoundController.instance.effectFall : SoundController.instance.effectFall2;

        const camera = cc.Camera.cameras[0];
        camera.backgroundColor = cc.Color.WHITE;

        SoundController.instance.playEffect(SoundController.instance.promptHit);
        waitSeconds(0.2).then(() => SoundController.instance.playEffect(winnerSound));
        waitSeconds(1.2).then(() => {
            SoundController.instance.playEffect(SoundController.instance.celebWin);
            SoundController.instance.stop(this.gongSoundId);
        });

        this.animator.flash.opacity = 255;
        if (player1) {
          this.animator.player1.playWon();
          this.animator.player2.playLost();
        } else {
          this.animator.player2.playWon();
          this.animator.player1.playLost();
        }
        cc.tween(this.animator.flash)
            .to(Settings.repeat / 2, { opacity: 0 }, { easing: cc.easing.quartIn })
            .call(() => {
                waitSeconds(Settings.repeat / 2 + 0.2).then(() => SoundController.instance.playEffect(SoundController.instance.promptPrepare));
            })
            .delay(Settings.repeat / 2)
            .call(() => {
              this.animator.highNoon = false;
              this.currentState = State.WarmUp;
              this.animator.player1.playIdle();
              this.animator.player2.playIdle();
            })
            .start();
    }

    protected callAI(dt: number): void {
        this.timerAI = this.timerAI - dt;
        if (this.timerAI === 0) {
            console.log('DEAD')
            this.doWindDown(false)
        }
    }
    //#endregion
}
