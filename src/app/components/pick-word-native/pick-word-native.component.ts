import { Component, OnInit, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { ITrainingWord, IPickWord } from '../../types';
import { PickWordService } from '../../services/pick-word.service';
import { TrainingService } from '../../services/training.service';


@Component({
  selector: 'app-pick-word-native',
  templateUrl: './pick-word-native.component.html',
  styleUrls: ['./pick-word-native.component.css'],
  providers: [PickWordService]
})
export class PickWordNativeComponent implements OnInit, OnChanges {

  @Input() mainWord: ITrainingWord;
  @Input() randomNumber: number;
  
  pickWords: IPickWord[] = [];
  isError: boolean;

  constructor(private pickWordService: PickWordService,
    private trainingService: TrainingService) { }


  ngOnInit() { }


  ngOnChanges(changes: SimpleChanges): void {
    this.isError = false;
    this.pickWords = this.pickWordService.getPickWords(this.mainWord);
  }


  @HostListener('document:keyup', ['$event'])
  documentClick(event: KeyboardEvent): void {
    if (this.pickWordService.isRightKey(event.key)) {
      const word = this.pickWordService.getWord(this.pickWords, event.key);
      if (word) this.onWordClick(word);
    }
  }


  onWordClick(word: ITrainingWord): void {
    if (word.id === this.mainWord.id) {
      this.trainingService.changeAlgorithmStream
        .next(this.isError);
      return;
    }

    this.isError = true;

    this.pickWords
      .forEach(item => {
        if (item.id === word.id) item.isError = true;
      });

    setTimeout(() => {
      this.pickWords
        .forEach(item => item.isError = false)
    }, 500);
  }

}
