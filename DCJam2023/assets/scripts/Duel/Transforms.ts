import { randomize, randomizePosition } from "../Utils";

const ColorByPlayer = {
  player1: new cc.Color().fromHEX('#FF0000'),
  player2: new cc.Color().fromHEX('#0000FF'),
}

const SafeMargin = 80;

const CANVAS_WIDTH = 960;

const CANVAS_HEIGHT = 640;

const WIDTH = CANVAS_WIDTH / 2;
const HEIGHT = CANVAS_HEIGHT / 2;

const YRange = { min: -HEIGHT + SafeMargin, max: HEIGHT - SafeMargin };

export type LabelInput = {
  label: cc.Label;
  keyCode: string;
}

export type TransformInput = {
  player1: LabelInput;
  player2: LabelInput;
}

export function simpleColor({ player1, player2 }: TransformInput): void {
  player1.label.string = player1.keyCode;
  player1.label.node.color = ColorByPlayer.player1;
  player2.label.string = player2.keyCode;
  player2.label.node.color = ColorByPlayer.player2;
}

export function randomPositionSplit({ player1, player2 }: TransformInput): void {
  const player1Pos = randomizePosition({ min: -WIDTH + SafeMargin, max: 0 }, YRange);
  const player2Pos = randomizePosition({ min: 0, max: WIDTH - SafeMargin }, YRange);
  console.log(' $ p1 pos ', player1Pos);
  console.log(' $ p2 pos ', player2Pos);
  player1.label.node.setPosition(player1Pos);
  player2.label.node.setPosition(player2Pos);
}

export function randomPositionNoSplit({ player1, player2 }: TransformInput): void {
  const xRange = { min: -WIDTH + SafeMargin, max: WIDTH - SafeMargin };
  const player1Pos = randomizePosition(xRange, YRange);
  const player2Pos = randomizePosition(xRange, YRange);
  player1.label.node.setPosition(player1Pos);
  player2.label.node.setPosition(player2Pos);
}

export function invertVertical({ player1, player2 }: TransformInput): void {
  player1.label.node.scaleY = -1;
  player2.label.node.scaleY = -1;
}

export function randomRotate({ player1, player2 }: TransformInput): void {
  const rotate1 = randomize({ min: -45, max: 45 });
  const rotate2 = randomize({ min: -45, max: 45 });
  player1.label.node.angle = rotate1;
  player2.label.node.angle = rotate2;
}
