const {ccclass, property} = cc._decorator;

@ccclass
export default class ManagerAnimation extends cc.Component {

    @property(cc.Node)
    flash: cc.Node = null;

    @property(cc.Node)
    minutePointer: cc.Node = null;

    minutePointerBaseRotation: number;

    minutePointerTween: cc.Tween;

    @property(cc.Node)
    wheatBall: cc.Node = null;

    protected onLoad(): void {
        this.minutePointerBaseRotation = this.minutePointer.angle;
    }

    set highNoon (isHigh: boolean) {
        if (isHigh) {
            this.minutePointerTween.stop();
            this.minutePointer.angle = 0;
        } else {
            const shake = cc.tween(this.minutePointer).to(0.05, { angle: this.minutePointerBaseRotation - 0.5 }).to(0.05, { angle: this.minutePointerBaseRotation + 0.5 })
            this.minutePointerTween = cc.tween(this.minutePointer).repeatForever(shake).start();
            this.minutePointer.angle = this.minutePointerBaseRotation;
        }
    }
}
