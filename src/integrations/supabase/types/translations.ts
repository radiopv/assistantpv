export type TranslationType = {
  [key: string]: string | TranslationType;
};

export type FlatTranslationType = {
  [key: string]: string;
};