
// #region Types
export type RandomRange = {
  min: number;
  max: number;
}
// #endregion

// #region Functions

export function randomize({ max, min }: RandomRange): number {
  if (max < min) throw Error(` Oh shit. Please. ${max} is less than ${min};`);
  const result = min + Math.random() * (max - min);
  console.log(' $ result ', result);
  return result;
}

export function randomizePosition(x: RandomRange, y: RandomRange): cc.Vec2 {
  const randX = randomize(x);
  const randY = randomize(y);
  return new cc.Vec2(randX, randY);
}
// #endregion