import { Component, input, model, computed } from "@angular/core";
import { Folder } from "../domain/folder.type";
import { Item } from "../domain/item.type";

/**
 * A selectable item.
 * @param {<Item>} item Selectable child items
 */
@Component({
  selector: 'selectable-item',
  template: `
    <div><input type="checkbox" [checked]="isSelected()" (click)="toggleSelected()"/> {{ title() }} </div>
  `,
})
export class SelectableItem {
  id = input.required<number>();
  title = input.required<string>();
  item = input<Item>
  selection = model<number[]>([]);

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