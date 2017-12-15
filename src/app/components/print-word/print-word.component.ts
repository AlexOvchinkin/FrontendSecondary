import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ITrainingWord } from '../../types';
import { TrainingService } from '../../services/training.service';

@Component({
  selector: 'app-print-word',
  templateUrl: './print-word.component.html',
  styleUrls: ['./print-word.component.css']
})
export class PrintWordComponent implements OnInit, OnChanges {

  @Input() mainWord: ITrainingWord;
  @Input() randomNumber: number;

  printedWord: string;
  checkWord: string;

  isCheckMode: boolean;
  isError: boolean;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.isCheckMode = true;
    this.isError = false;
    this.printedWord = '';
    this.checkWord = this.mainWord.foreign;
    document.getElementById('printed-word').focus();
    console.log(this.checkWord);
  }


  printedWordEnter(): void {
    if (this.isCheckMode) {
      this.check();
      return;
    }

    this.nextClick();
  }


  checkClick(): void {
    this.check();
  }


  check(): void {
    if (!this.isRightAnswer(this.printedWord, this.checkWord)) {
      this.isError = true;
    }

    this.isCheckMode = false;
  }


  nextClick(): void {
    this.trainingService
      .changeAlgorithmStream.next(this.isError);
  }


  private isRightAnswer(value: string, original: string): boolean {
    return value.trim().toLowerCase() === original.toLowerCase();
  }

}
