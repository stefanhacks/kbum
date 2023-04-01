// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { loadDefaultSpriteSplash } from "./Utils";

const { ccclass } = cc._decorator;

const NodeName = 'Transition';

@ccclass
export default class Transition extends cc.Component {
  static async getInstance(): Promise<Transition> {
    const canvas = cc.Canvas.instance.node;
    const transition = canvas.getChildByName(NodeName);
    if (transition) return transition.getComponent(Transition);
    const newTransition = new cc.Node(NodeName).addComponent(Transition);
    // Create Sprite
    const sprite = newTransition.node.addComponent(cc.Sprite);
    sprite.spriteFrame = await loadDefaultSpriteSplash();
    sprite.trim = true;
    sprite.type = cc.Sprite.Type.SIMPLE;
    sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    sprite.node.width = canvas.width;
    sprite.node.height = canvas.height;
    // Create Widget
    const widget = newTransition.node.addComponent(cc.Widget);
    widget.top = 0;
    widget.bottom = 0;
    widget.left = 0;
    widget.right = 0;
    widget.isAbsoluteBottom = true;
    widget.isAbsoluteTop = true;
    widget.isAbsoluteLeft = true;
    widget.isAbsoluteRight = true;
    widget.target = canvas;
    canvas.addChild(newTransition.node);
    widget.updateAlignment();
    newTransition.node.opacity = 0;
    return newTransition;
  }

  protected onLoad(): void {
    cc.game.addPersistRootNode(this.node);
    Transition.getInstance();
  }

  static async toBlack(wait = 0.5): Promise<void> {
    const instance = await Transition.getInstance();
    instance.node.color = cc.Color.BLACK;
    await new Promise<void>((resolve) =>
      cc.tween(instance.node)
        .to(0.3, { opacity: 255 })
        .delay(wait)
        .call(() => resolve())
        .start()
    );
  }

  static async toWhite(wait = 0.5): Promise<void> {
    const instance = await Transition.getInstance();
    instance.node.color = cc.Color.WHITE;
    await new Promise<void>((resolve) =>
      cc.tween(instance.node)
        .to(0.3, { opacity: 255 })
        .delay(wait)
        .call(() => resolve())
        .start()
    );
  }

  static async exit(): Promise<void> {
    const instance = await Transition.getInstance();
    await new Promise<void>((resolve) =>
      cc.tween(instance.node)
        .delay(0.3)
        .to(0.3, { opacity: 0 })
        .call(() => resolve())
        .start()
    );
  }
}
