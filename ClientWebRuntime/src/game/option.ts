/** @public */
export type GameOption = {
  key: string;
} & (
  | {
      type: 'string';
      value: string | number;
    }
  | {
      type: 'boolean';
      value: boolean;
    }
);
