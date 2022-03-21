export enum LengthUnit {
  FIXED = 'fixed',
  PERCENT = 'percent',
  AUTO = 'auto'
}

export type Length =
  | [LengthUnit.AUTO]
  | [LengthUnit.FIXED, number]
  | [LengthUnit.PERCENT, number]
