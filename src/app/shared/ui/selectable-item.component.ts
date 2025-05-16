import { Component, input, model, computed } from "@angular/core";
import { Folder } from "../domain/folder.type";
import { Item } from "../domain/item.type";

/**
 * A selectable item.
 * @param {<number>} id Item id
 * @param {<string>} title Item title
 */
@Component({
  selector: 'selectable-item',
  template: `
    <div [style.padding-left.px]="16 * (nestingDepth() + 1)">
      <input type="checkbox" [name]="title()+id()" [checked]="isSelected()" (click)="toggleSelected()"/>
      <label [for]="title()+id()" (click)="toggleSelected()">{{ title() }}</label>
    </div>
  `,
  styles: `
    div {
      display: flex;
      align-items: center;

      font-family: sans-serif;
      font-size: 14px;
      line-height: 141%;
      letter-spacing: 0%;

      height: 34px;

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
export class SelectableItem {
  id = input.required<number>();
  title = input.required<string>();
  selection = model<number[]>([]);
  nestingDepth = input(0)

  isSelected = computed((): boolean => {
    return this.selection().includes(this.id())
  })

  toggleSelected = () => {
    if (this.isSelected()) {
      this.selection.update((currentValue) => currentValue.filter(value => value !== this.id()))
    } else {
      this.selection.update((currentValue) => currentValue.concat([this.id()]))
    }
  }
}