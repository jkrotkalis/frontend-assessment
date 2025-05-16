import { Component, input, computed, signal, model } from "@angular/core";
import { Folder } from "../domain/folder.type";
import { Item } from "../domain/item.type";
import { SelectableItem } from "./selectable-item.component";

/**
 * A collapsable folder which can recursively render nested folders and items and be selected.
 * @param {number} id Folder id
 * @param {string} title Folder title
 * @param {<Folder>[]} folders Child folders
 * @param {<Item>[]} items Selectable child items
 * @emits selected
 */
@Component({
  selector: 'collapsable-folder',
  imports: [SelectableItem],
  template: `
    <div><input type="checkbox" [indeterminate]="isIndeterminate()" [checked]="isSelected()" (click)="toggleSelected($event)"/>{{ title() }} <button (click)="toggleCollapse()">collapse</button></div>
    @if (!collapsed()) {
      @for (folder of childFolders(); track folder.id) {
        <collapsable-folder [id]="folder.id" [title]="folder.title" [folders]="folders()" [items]="items()" [(selection)]="selection"/>
      }
      @for (item of childItems(); track item.id) {
        <selectable-item [id]="item.id" [title]="item.title"  [(selection)]="selection"/>
      }
    }
  `,
})
export class CollapsableFolder {
  id = input.required<number>();
  title = input.required<string>();
  folders = input<Folder[]>([]);
  items = input<Item[]>([]);
  selection = model<number[]>([]);
  collapsed = signal(false)

  // Gets folders that are direct children
  childFolders = computed(() => {
    return this.folders().filter((folder) => folder.parent_id === this.id());
  })

  // Gets items that are direct children
  childItems = computed(() => {
    return this.items().filter((item) => item.folder_id === this.id());
  })

  getAllChildFolderIds = computed(() => {
    let ids = [this.id()]
    // Recursively get all folder children ids
    let searchForChildren = (ids: number[]) => {
      let newIds = this.folders().filter((folder) => !ids.includes(folder.id) && ids.includes(folder.parent_id)).map((folder) => folder.id)

      if (newIds.length > 0) {
        newIds = newIds.concat(searchForChildren(newIds))
      }

      return ids.concat(newIds)
    }
    
    return searchForChildren(ids)
  })

  getAllChildItemIds = computed(() => {
    let folderIds = this.getAllChildFolderIds()

    return this.items().filter((item) => folderIds.includes(item.folder_id)).map(item => item.id)
  })

  isSelected = computed((): boolean => {
    if (this.selection().length == 0) return false;


    return this.getAllChildItemIds().every((id) => this.selection().includes(id));
  })

  isIndeterminate = computed((): boolean => {
    if (this.selection().length == 0 || this.isSelected()) return false;

    return this.getAllChildItemIds().some((id) => this.selection().includes(id));
  })

  toggleSelected = (event: Event) => {
    console.log(this.getAllChildFolderIds(), this.getAllChildItemIds())
    event.preventDefault()
    if (this.isSelected()) {
      this.selection.update((currentValue) => currentValue.filter(value => !this.getAllChildItemIds().includes(value)))
    } else {
      this.selection.update((currentValue) => currentValue.concat(this.getAllChildItemIds()));
    }
  }

  toggleCollapse = () => {
    this.collapsed.set(!this.collapsed())
  }
}