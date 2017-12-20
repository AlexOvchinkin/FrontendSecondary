import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup-question-window',
  templateUrl: './popup-question-window.component.html',
  styleUrls: ['./popup-question-window.component.css']
})
export class PopupQuestionWindowComponent implements OnInit {

  @Output() result = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  buttonClick(res: boolean): void {
    this.result.emit(res);
  }

}
