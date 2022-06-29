import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-edit-structure',
  templateUrl: './edit-structure.component.html',
  styleUrls: ['./edit-structure.component.scss'],
})
export class EditStructureComponent implements OnInit {
  @Input() placeHolder: string;
  @Input() inputType: string;
  @Input() content;

  @Output() updatedData = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  sendUpdatedData() {
    this.updatedData.emit(this.content);
  }
}
