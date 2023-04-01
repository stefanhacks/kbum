// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SoundController from "./SoundController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenu extends cc.Component {
    @property(cc.Button)
    private playButton: cc.Button = null;

    @property(cc.Button)
    private soloButton: cc.Button = null;

    @property(cc.Button)
    private multiplayerButton: cc.Button = null;

private async onPlayClicked() :Promise<void> {
    this.fadeNodeOut(this.playButton.node);
    this.fadeNodeIn(this.soloButton.node);
    this.fadeNodeIn(this.multiplayerButton.node);
}

private fadeNodeIn(node: cc.Node) :void {
    new Promise<void>((resolve) => {
        cc.tween(node).to(0.5, { opacity: 255 }, { easing: 'quartOut' }).call(resolve).start();
    });
}

private fadeNodeOut(node: cc.Node) :void {
    new Promise<void>((resolve) => {
        cc.tween(node).to(0.5, { opacity: 0 }, { easing: 'quartOut' }).call(resolve).start();
    });
}

private changeScene(): void {
    SoundController.instance.playBackground(SoundController.instance.bgWind);
    SoundController.instance.playEffect(SoundController.instance.saloonDoorSqueak);
    SoundController.instance.playEffect(SoundController.instance.promptPrepare);
    cc.director.loadScene('Game');
}
}
