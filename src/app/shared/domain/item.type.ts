export type Item = {
  id: number;
  title: string;
  parent_id: number;
};

/** Null object pattern for the Item type */
export const NULL_ITEM: Item = {
  id: 0,
  title: '',
  parent_id: 0
};