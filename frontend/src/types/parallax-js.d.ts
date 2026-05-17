declare module 'parallax-js' {
  export interface ParallaxOptions {
    relativeInput?: boolean;
    hoverOnly?: boolean;
    clipRelativeInput?: boolean;
  }

  export default class Parallax {
    constructor(element: HTMLElement, options?: ParallaxOptions);
    destroy(): void;
  }
}
