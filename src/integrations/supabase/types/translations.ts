export type TranslationType = {
  [key: string]: string | {
    [key: string]: string | {
      [key: string]: string;
    };
  };
};

export type FlatTranslationType = {
  [key: string]: string;
};