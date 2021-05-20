declare module 'contrast-color' {
  export interface ContrastColorOpts {
    bgColor?: string
    fgDarkColor?: string
    fgLightColor?: string
    defaultColor?: string
    threshold?: number
    customNamedColors?: {
      [key: string]: string
    }
  }

  export function contrastColor(opts: ContrastColorOpts): number

  declare class ContrastColor {
    constructor(opts: ContrastColorOpts)

    namedColors: ContrastColorOpts['customNamedColors']
    contrastColor = contrastColor
  }

  export default ContrastColor
}
