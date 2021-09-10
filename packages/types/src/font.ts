/** Text casing applied to the node, default is the original casing, see {@link TypeStyle} */
export enum TextCase {
  UPPER = 'UPPER',
  LOWER = 'LOWER',
  TITLE = 'TITLE',
  SMALL_CAPS = 'SMALL_CAPS',
  SMALL_CAPS_FORCED = 'SMALL_CAPS_FORCED'
}

/** Text decoration applied to the node, default is none */
export enum TextDecoration {
  STRIKETHROUGH = 'STRIKETHROUGH',
  UNDERLINE = 'UNDERLINE',
  NONE = 'NONE'
}

/** Dimensions along which text will auto resize, default is that the text does not auto-resize. */
export enum TextAutoResize {
  HEIGHT = 'HEIGHT',
  WIDTH_AND_HEIGHT = 'WIDTH_AND_HEIGHT',
  NONE = 'NONE'
}

export enum TextAlignHorizontal {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  CENTER = 'CENTER',
  JUSTIFIED = 'JUSTIFIED'
}

export enum TextAlignVertical {
  TOP = 'TOP',
  CENTER = 'CENTER',
  BOTTOM = 'BOTTOM'
}

export enum LineHeightUnit {
  PIXELS = 'PIXELS',
  FONT_SIZE_PERCENTAGE = 'FONT_SIZE_%',
  INTRINSIC_PERCENTAGE = 'INTRINSIC_%',
}

/** Metadata for character formatting */
export interface TypeStyle {
  /** Font family of text (standard name) */
  fontFamily: string

  /** PostScript font name */
  fontPostScriptName: string

  /** Space between paragraphs in px, 0 if not present */
  paragraphSpacing: number

  /** Paragraph indentation in px, 0 if not present */
  paragraphIndent: number

  /** Whether or not text is italicized */
  italic: boolean

  /** Numeric font weight */
  fontWeight: number

  /** Font size in px */
  fontSize: number

  /** Text casing applied to the node, default is the original casing */
  textCase: TextCase

  /** Text decoration applied to the node, default is none */
  textDecoration: TextDecoration

  /** Dimensions along which text will auto resize, default is that the text does not auto-resize. */
  textAutoResize: TextAutoResize

  /** Horizontal text alignment as string enum */
  textAlignHorizontal: TextAlignHorizontal

  /** Vertical text alignment as string enum */
  textAlignVertical: TextAlignVertical

  /** Space between characters in px */
  letterSpacing: number

  /** Link to a URL or frame */
  hyperlink: Hyperlink

  /** Line height in px */
  lineHeightPx: number

  /** Line height as a percentage of the font size. Only returned when lineHeightPercent is not 100. */
  lineHeightPercentFontSize: number

  /** The unit of the line height value specified by the user. */
  lineHeightUnit: LineHeightUnit
}

export enum HyperlinkType {
  URL = 'URL',
  NODE = 'NODE'
}

export interface UrlHyperlink {
  type: HyperlinkType.URL
  url: string
}

export interface NodeHyperlink {
  type: HyperlinkType.NODE
  nodeID: string
}

export type Hyperlink = UrlHyperlink | NodeHyperlink
