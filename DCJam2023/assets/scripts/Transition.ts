// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass } = cc._decorator;

const NodeName = 'Transition';

@ccclass
export default class Transition extends cc.Component {
  static get instance(): Transition {
    const canvas = cc.Canvas.instance.node;
    const transition = canvas.getChildByName(NodeName);
    if (transition) return transition.getComponent(Transition);
    const newTransition = new cc.Node(NodeName).addComponent(Transition);
    // Create Sprite
    const sprite = newTransition.node.addComponent(cc.Sprite);
    cc.assetManager.internal.load<cc.SpriteFrame>('image/default_sprite_splash', cc.SpriteFrame, (err, asset) => {
      if (err) return;
      sprite.spriteFrame = asset;
      sprite.trim = true;
      sprite.type = cc.Sprite.Type.SIMPLE;
      sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    })
    // Create Widget
    const widget = newTransition.node.addComponent(cc.Widget);
    widget.top = 0;
    widget.bottom = 0;
    widget.left = 0;
    widget.right = 0;
    widget.target = canvas;
    canvas.addChild(newTransition.node);
    widget.updateAlignment();
    return newTransition;
  }

  // LIFE-CYCLE CALLBACKS:
  protected onLoad() {
    this.node.opacity = 0;
  }

  static toBlack(wait = 0.5): Promise<void> {
    const { node } = Transition.instance;
    node.color = cc.Color.BLACK;
    return new Promise<void>((resolve) =>
      cc.tween(node)
        .to(0.3, { opacity: 255 })
        .delay(wait)
        .call(() => resolve())
        .to(0.3, { opacity: 0 })
        .start
    );
  }

  static toWhite(wait = 0.5): Promise<void> {
    const { node } = Transition.instance;
    node.color = cc.Color.WHITE;
    return new Promise<void>((resolve) =>
      cc.tween(node)
        .to(0.3, { opacity: 255 })
        .delay(wait)
        .call(() => resolve())
        .to(0.3, { opacity: 0 })
        .start
    );
  }
}
