const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerAnimated extends cc.Component {

  @property(sp.Skeleton)
  spine: sp.Skeleton = null;

  @property(cc.Node)
  defeated: cc.Node = null;

  public playIdle(): void {
    this.defeated.active = false;
    this.spine.node.active = true;
    this.spine.setAnimation(0, 'idle', true);
  }

  public playWon(): void {
    this.defeated.active = false;
    this.spine.node.active = true;
    this.spine.setAnimation(0, 'win', true);
  }

  public playLost(): void {
    this.defeated.active = true;
    this.spine.node.active = false;
  }
}
