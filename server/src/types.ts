type SortOptions = {
  [key: string]: 1 | -1;
};

interface QueryConditions {
  price?: {
    $gt?: number;
    $lt?: number;
  };
  category?: {
    $in?: string[];
  };
}

export { SortOptions, QueryConditions };
