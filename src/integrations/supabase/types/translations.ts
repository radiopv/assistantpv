export interface TranslationType {
  [key: string]: string | {
    [key: string]: string | {
      [key: string]: string;
    };
  };
}

export interface FlatTranslationType {
  [key: string]: string;
}