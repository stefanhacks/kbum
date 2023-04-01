const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerController extends cc.Component {
    private targetRotation: cc.Vec3;
    private targetPosition: cc.Vec3;
    private prevPosition: cc.Vec3;

    get atRest (): Boolean {
        const isMoving = (cc.Vec3.distance(this.node.position, this.targetPosition) < 0.05);
        const isRotating = (cc.Vec3.distance(this.node.eulerAngles, this.targetRotation) < 0.05);

        return !(isMoving && isRotating);
    }
}
