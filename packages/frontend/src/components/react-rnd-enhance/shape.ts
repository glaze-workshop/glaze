/*
 * ILine 命名規則
 * l=>left r=>right t=>top b=>bottom
 * c=>center w=>width h=>height
 * x=>x軸 y=>y軸
 * Ex: lw 表示 左邊寬度
 *       cxh 表示 x軸方向中心 Line的寬度
 * */
export interface ILine {
  lw: number
  lh: number
  lt: number
  ll: number
  rw: number
  rh: number
  rt: number
  rl: number
  tw: number
  th: number
  tl: number
  tt: number
  bw: number
  bh: number
  bl: number
  bt: number
  cl: number
  ct: number
  cxh: number
  cxw: number
  cyh: number
  cyw: number
}

export const basicLine: ILine = {
  lw: 0,
  lh: 0,
  lt: 0,
  ll: 0,
  rw: 0,
  rh: 0,
  rt: 0,
  rl: 0,
  tw: 0,
  th: 0,
  tl: 0,
  tt: 0,
  bw: 0,
  bh: 0,
  bl: 0,
  bt: 0,
  cl: 0,
  ct: 0,
  cxh: 0,
  cxw: 0,
  cyh: 0,
  cyw: 0
}
