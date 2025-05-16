export type Folder = {
  id: number;
  title: string;
  parent_id: number;
};

/** Null object pattern for the Folder type */
export const NULL_FOLDER: Folder = {
  id: 0,
  title: '',
  parent_id: 0
};