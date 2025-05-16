import { Component, input, computed, model } from "@angular/core";
import { Folder } from "../domain/folder.type";
import { Item } from "../domain/item.type";
import { CollapsableFolder } from "./collapsable-folder.component";

/**
 * A structured list with selectable items.
 * @param {<Folder>[]} folders Folders to display
 * @param {<Item>[]} items Items to display
 */
@Component({
  selector: 'structured-list',
  standalone: true,
  imports: [CollapsableFolder],
  template: `
    <div>   
      @for (folder of topLevelFolders(); track folder.id) {
        <collapsable-folder [id]="folder.id" [title]="folder.title" [folders]="folders()" [items]="items()" [(selection)]="selection" />
      }

    </div>
  `,
  styles: `
    div {
      border: 1px solid #E3E3E3;
      border-radius: 3px;
      width: 275px;
    }
  `
})
export class StructuredList {
  folders = input<Folder[]>([])
  items = input<Item[]>([])
  selection = model<number[]>([]);

  topLevelFolders = computed(() => {
    return this.folders().filter((folder) => folder.parent_id == null)
  })
}