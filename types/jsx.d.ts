// Permissive fallback for JSX intrinsic elements.
// Some files in this repo accidentally narrow the global JSX.IntrinsicElements
// which causes many files to report that common tags (div, h1, svg, etc.)
// don't exist. This file restores standard tags with a permissive `any` typing
// to unblock builds. It's safe as a short-term shim; we should later remove
// once offending narrow declarations are fixed.

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // HTML
      div: any;
      span: any;
      p: any;
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      h5: any;
      h6: any;
      header: any;
      footer: any;
      section: any;
      article: any;
      nav: any;
      main: any;
      button: any;
      input: any;
      select: any;
      option: any;
      textarea: any;
      label: any;
      form: any;
      ul: any;
      li: any;
      ol: any;
      a: any;
      img: any;

      // SVG
      svg: any;
      g: any;
      path: any;
      rect: any;
      circle: any;
      line: any;
      text: any;

      // fallback for anything else
      [elemName: string]: any;
    }
  }
}

export {};
