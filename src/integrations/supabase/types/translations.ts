export interface TranslationType {
  [key: string]: string | TranslationType;
}

export interface FlatTranslationType {
  [key: string]: string;
}