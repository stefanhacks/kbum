import SoundController from "./SoundController";
import { AIDifficulty, Config } from "./game/Configs";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenu extends cc.Component {
    @property(sp.Skeleton)
    private intro: sp.Skeleton = null;

    @property(cc.Button)
    private playButton: cc.Button = null;

    @property(cc.Button)
    private soloButton: cc.Button = null;

    @property(cc.Button)
    private multiplayerButton: cc.Button = null;

    @property(cc.Button)
    private easyButton: cc.Button = null;

    @property(cc.Button)
    private hardButton: cc.Button = null;

    @property(cc.Button)
    private youWillDieButton: cc.Button = null;

    @property()
    private introDuration = 5;

    protected onLoad(): void {
        this.intro.enabled = true;
        this.intro.setAnimation(0, 'showdown', false);
        this.intro.addAnimation(0, 'intro', false);
        this.intro.addAnimation(0, 'loop', true);

        cc.tween(this.playButton.node).delay(this.introDuration).set({ active: true }).start();
    }

    private async onPlayClicked() :Promise<void> {
        SoundController.instance.play(SoundController.instance.menuSelect, false, 1);
        this.fadeNodeOut(this.playButton.node);
        this.fadeNodeIn(this.soloButton.node);
        this.fadeNodeIn(this.multiplayerButton.node);
    }

    private async onSoloClicked() :Promise<void> {
        this.fadeNodeOut(this.soloButton.node);
        this.fadeNodeOut(this.multiplayerButton.node);
        this.fadeNodeIn(this.easyButton.node);
        this.fadeNodeIn(this.hardButton.node);
        this.fadeNodeIn(this.youWillDieButton.node);
    }

    private async onEasyClicked() :Promise<void> {
        this.changeScene(AIDifficulty.Easy);
    }

    private async onHardClicked() :Promise<void> {
        this.changeScene(AIDifficulty.Hard);
    }

    private async onYouWillDieClicked() :Promise<void> {
        this.changeScene(AIDifficulty.YouWillDie);
    }

    private async onMultiplayerClicked() :Promise<void> {
        this.changeScene();
    }

    private fadeNodeIn(node: cc.Node) :void {
        node.active = true;
        new Promise<void>((resolve) => {
            cc.tween(node).to(0.5, { opacity: 255 }, { easing: 'quartOut' }).call(resolve).start();
        });
    }

    private fadeNodeOut(node: cc.Node) :void {
        node.active = false
        new Promise<void>((resolve) => {
            cc.tween(node).to(0.5, { opacity: 0 }, { easing: 'quartOut' }).call(resolve).start();
        });
    }

    private changeScene(difficulty?: AIDifficulty): void {
        SoundController.instance.playBackground(SoundController.instance.bgWind);
        SoundController.instance.play(SoundController.instance.saloonDoorSqueak, false, 0.5);
        SoundController.instance.playEffect(SoundController.instance.promptPrepare);
        Config.instance.difficulty = difficulty;
        cc.director.loadScene('Game');
    }
}
