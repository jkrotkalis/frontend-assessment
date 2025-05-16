import { Component, input, output, computed } from "@angular/core";
import { Folder } from "../domain/folder.type";
import { Item } from "../domain/item.type";
import { CollapsableFolder } from "./collapsable-folder.component";

/**
 * A structured list with selectable items.
 * @param {<Array<Folder>>} folders Folders to display
 * @param {<Array<Item>>} items Selectable items to show in folders
 * @emits valueChanged Returns an array of selected ids
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
      <!-- Current selection: {{ selection.toString() }}
      <button (click)="clearSelection()">Clear</button> -->
  `
})
export class StructuredList {
  folders = input<Folder[]>([])
  items = input<Item[]>([])
  selection = []

  topLevelFolders = computed(() => {
    return this.folders().filter((folder) => folder.parent_id == null)
  })

  clearSelection = () => {
    this.selection = []
  }
}