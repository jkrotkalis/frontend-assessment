import { Folder } from './folder.type'
import { Item } from './item.type'

export type AssessmentData = {
  folders: {
    columns: string[],
    data: Folder[]
  },
  items: {
    columns: string[],
    data: Item[]
  }
};