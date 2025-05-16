import { Component, input, computed, signal, model } from "@angular/core";
import { Folder } from "../domain/folder.type";
import { Item } from "../domain/item.type";
import { SelectableItem } from "./selectable-item.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';


/**
 * A collapsable folder which can recursively render nested folders and items and be selected.
 * @param {number} id Folder id
 * @param {string} title Folder title
 * @param {<Folder>[]} folders All folders
 * @param {<Item>[]} items All items
 */
@Component({
  selector: 'collapsable-folder',
  imports: [SelectableItem, FontAwesomeModule],
  template: `
    <div [style.padding-left.px]="16 * (nestingDepth() + 1)">
      <input type="checkbox" [name]="title()+id()" [indeterminate]="isIndeterminate()" [checked]="isSelected()" (click)="toggleSelected()"/>
      <label [for]="title()+id()" (click)="toggleSelected()">{{ title() }}</label> 
      <fa-icon [icon]="getIcon()" (click)="toggleCollapse()" size="xs" />
    </div>
    @if (!collapsed()) {
      @for (folder of childFolders(); track folder.id) {
        <collapsable-folder [id]="folder.id" [title]="folder.title" [folders]="folders()" [items]="items()" [(selection)]="selection" [nestingDepth]="nestingDepth() + 1"/>
      }
      @for (item of childItems(); track item.id) {
        <selectable-item [id]="item.id" [title]="item.title"  [(selection)]="selection" [nestingDepth]="nestingDepth() + 1"/>
      }
    }
  `,
  styles: `
    div {
      display: flex;
      justify-content: space-between; 
      align-items: center;

      font-family: sans-serif;
      font-weight: 600;
      font-size: 14px;
      line-height: 141%;
      letter-spacing: 0%;

      height: 34px;
      padding: 0 16px;

      cursor: pointer;

      &:hover {
        background: #F5F5F5;
      }

      label {
        width: 100%;
        margin-left: 5px;
        cursor: pointer;
        user-select: none; 
      }
    }

    input {
      width: 20px;
      height: 20px;   
      cursor: pointer;
    }

  `
})
export class CollapsableFolder {
  id = input.required<number>();
  title = input.required<string>();
  folders = input<Folder[]>([]);
  items = input<Item[]>([]);
  selection = model<number[]>([]);
  collapsed = signal(false)
  nestingDepth = input(0)

  // Icons
  faChevronUp = faChevronUp
  faChevronDown = faChevronDown

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

  getIcon = computed(() => {
    return this.collapsed() ? faChevronDown : faChevronUp
  })

  toggleSelected = () => {
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