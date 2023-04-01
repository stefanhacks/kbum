const {ccclass, property} = cc._decorator;

@ccclass
export default class ManagerAnimation extends cc.Component {

    @property(cc.Node)
    minutePointer: cc.Node = null;
    
    @property(cc.Node)
    wheatBall: cc.Node = null;
}
