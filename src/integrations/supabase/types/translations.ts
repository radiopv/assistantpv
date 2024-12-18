export type TranslationType = {
  [key: string]: string | {
    [key: string]: string | {
      [key: string]: string;
    };
  };
};