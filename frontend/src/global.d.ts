declare global {
  interface Window {
    jsyaml?: any;
    ajv7?: any;
    require?: any;
    navigation?: any;
  }
  const navigation: any;
  type NavigateEvent = any;
  type Navigation = any;
}

export {};
