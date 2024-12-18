export interface TranslationType {
  [key: string]: string | {
    [key: string]: string | {
      [key: string]: string;
    };
  };
}

export interface NestedTranslations {
  [key: string]: string | NestedTranslations;
}