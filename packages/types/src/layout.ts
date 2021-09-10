import type { Color } from './property'

/** Vertical constraint as an enum, see {@link LayoutConstraint} */
export enum VerticalConstraint {
  /** Node is laid out relative to top of the containing frame */
  TOP = 'TOP',

  /** Node is laid out relative to bottom of the containing frame */
  BOTTOM = 'BOTTOM',

  /** Node is vertically centered relative to containing frame */
  CENTER = 'CENTER',

  /** Both top and bottom of node are constrained relative to containing frame (node stretches with frame) */
  TOP_BOTTOM = 'TOP_BOTTOM',

  /** Node scales vertically with containing frame */
  SCALE = 'SCALE'
}

/** Horizontal constraint as an enum, see {@link LayoutConstraint} */
export enum HorizontalConstraint {
  /** Node is laid out relative to left of the containing frame */
  LEFT = 'LEFT',

  /** Node is laid out relative to right of the containing frame */
  RIGHT = 'RIGHT',

  /** Node is horizontally centered relative to containing frame */
  CENTER = 'CENTER',

  /** Both left and right of node are constrained relative to containing frame (node stretches with frame) */
  LEFT_RIGHT = 'LEFT_RIGHT',

  /** Node scales horizontally with containing frame */
  SCALE = 'SCALE'
}

/** Layout constraint relative to containing Frame */
export interface LayoutConstraint {
  /** Vertical constraint as an enum */
  vertical: VerticalConstraint

  /** Horizontal constraint as an enum */
  horizontal: HorizontalConstraint
}

/** Orientation of the grid as a string enum, see {@link LayoutGrid} */
export enum LayoutGridPattern {
  /** Vertical grid */
  COLUMNS = 'COLUMNS',

  /** Horizontal grid */
  ROWS = 'ROWS',

  /** Square grid */
  GRID = 'GRID',
}

export interface AbstractGrid {
  /** Orientation of the grid as a string enum */
  pattern: LayoutGridPattern

  /** Width of column grid or height of row grid or square grid spacing */
  sectionSize: number

  /** Is the grid currently visible? */
  visible: boolean

  /** Color of the grid */
  color: Color
}

/** Positioning of grid as a string enum, see {@link DirectionalGrid} */
export enum DirectionalGridAlignment {
  /** Grid starts at the left or top of the frame */
  MIN = 'MIN',

  /** Grid is stretched to fit the frame */
  STRETCH = 'STRETCH',

  /** Grid is center aligned */
  CENTER = 'CENTER'
}

/** COLUMNS or ROWS */
export interface DirectionalGrid extends AbstractGrid {
  /** Positioning of grid as a string enum */
  alignment: DirectionalGridAlignment

  /** Spacing in between columns and rows */
  gutterSize: number

  /** Spacing before the first column or row */
  offset: number

  /** Number of columns or rows */
  count: number
}

export interface ColumnsLayoutGrid extends DirectionalGrid {
  pattern: LayoutGridPattern.COLUMNS
}

export interface RowsLayoutGrid extends DirectionalGrid {
  pattern: LayoutGridPattern.ROWS
}

export interface GridLayoutGrid extends AbstractGrid {
  pattern: LayoutGridPattern.GRID
}

/** Guides to align and place objects within a frame */
export type LayoutGrid = ColumnsLayoutGrid | RowsLayoutGrid | GridLayoutGrid
