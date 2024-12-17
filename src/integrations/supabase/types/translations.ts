export interface TranslationType {
  [key: string]: string | {
    [key: string]: string | {
      [key: string]: string;
    };
  };
}