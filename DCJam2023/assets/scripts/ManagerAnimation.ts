import PlayerAnimated from "./component/PlayerAnimated";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ManagerAnimation extends cc.Component {

    @property(cc.Node)
    flash: cc.Node = null;

    @property(cc.Node)
    minutePointer: cc.Node = null;
    
    @property(PlayerAnimated)
    player1: PlayerAnimated = null;
  
    @property(PlayerAnimated)
    player2: PlayerAnimated = null;

    minutePointerBaseRotation: number;

    minutePointerTween: cc.Tween;

    @property(cc.Node)
    wheatBall: cc.Node = null;

    @property()
    private intensity = 1;

    protected onLoad(): void {
        this.minutePointerBaseRotation = this.minutePointer.angle;
    }

    set highNoon (isHigh: boolean) {
        if (isHigh) {
            this.minutePointerTween.stop();
            this.minutePointer.angle = 0;
        } else {
            const shake = cc.tween(this.minutePointer).to(0.05, { angle: this.minutePointerBaseRotation - this.intensity }).to(0.05, { angle: this.minutePointerBaseRotation + this.intensity })
            this.minutePointerTween = cc.tween(this.minutePointer).repeatForever(shake).start();
            this.minutePointer.angle = this.minutePointerBaseRotation;
        }
    }
}
