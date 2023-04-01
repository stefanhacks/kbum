const { ccclass, property } = cc._decorator;

@ccclass
export default class SoundController extends cc.Component {
    static instance: SoundController = null;

    // #region LOAD
    @property(cc.AudioClip)
    public bgMenuMusic: cc.AudioClip = null;

    @property(cc.AudioClip)
    public bgWind: cc.AudioClip = null;

    @property(cc.AudioClip)
    public celebWin: cc.AudioClip = null;

    @property(cc.AudioClip)
    public effectFall: cc.AudioClip = null;

    @property(cc.AudioClip)
    public effectFall2: cc.AudioClip = null;
  
    @property(cc.AudioClip)
    public promptGo: cc.AudioClip = null;

    @property(cc.AudioClip)
    public promptHit: cc.AudioClip = null;

    @property(cc.AudioClip)
    public promptPrepare: cc.AudioClip = null;

    @property(cc.AudioClip)
    public saloonDoorSqueak: cc.AudioClip = null;

    @property(cc.AudioClip)
    public whipCrack: cc.AudioClip = null;

    @property(cc.AudioClip)
    public menuBack: cc.AudioClip = null;

    @property(cc.AudioClip)
    public menuSelect: cc.AudioClip = null;

    private currentMusic: cc.AudioClip = null;

    protected onLoad(): void {
        if (!SoundController.instance) SoundController.instance = this;
        cc.game.addPersistRootNode(this.node);
        // set channels volume
        cc.audioEngine.setMusicVolume(0.5);
        cc.audioEngine.setEffectsVolume(0.5);
        // play background menu music
        this.playBackground(this.bgMenuMusic);
        this.currentMusic = this.bgMenuMusic;
    }

    protected onDestroy(): void {
        cc.audioEngine.stopAll();
    }

    public playEffect(audio: cc.AudioClip): void {
        if(audio.loaded) cc.audioEngine.playEffect(audio, false);
    }

    public playBackground(audio: cc.AudioClip): void {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(cc.audioEngine.isMusicPlaying() && this.currentMusic != audio);
        if(cc.audioEngine.isMusicPlaying() && this.currentMusic != audio) cc.audioEngine.stopMusic();
        cc.audioEngine.playMusic(audio, true);
        this.currentMusic = audio;
    }

    public play(audio: cc.AudioClip, loop = false, volume: number): void {
        cc.audioEngine.play(audio, loop, volume);
    }
}