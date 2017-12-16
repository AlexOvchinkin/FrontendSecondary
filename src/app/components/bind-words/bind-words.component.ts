import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ITrainingWord } from '../../types';
import { BindWordsService, IWord } from '../../services/bind-words.service';
import { TrainingService } from '../../services/training.service';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';



@Component({
  selector: 'app-bind-words',
  templateUrl: './bind-words.component.html',
  styleUrls: ['./bind-words.component.css'],
  providers: [BindWordsService]
})
export class BindWordsComponent implements OnInit, OnChanges, AfterViewChecked {

  @Input() words: ITrainingWord[];
  @Input() randomNumber: number;

  foreignWords: IWord[] = [];
  nativeWords: IWord[] = [];

  wasError: boolean;


  constructor(private bindWordsService: BindWordsService,
    private trainingService: TrainingService) { }


  ngOnInit() { }


  ngOnChanges(changes: SimpleChanges): void {
    this.foreignWords = this.bindWordsService.getForeignWords(this.words);
    this.nativeWords = this.bindWordsService.getNativeWords(this.words);
    this.wasError = false;
  }

  ngAfterViewChecked(): void {
    /*const elements = document.body.querySelectorAll('.bind-words__word');

    for (let element of <Node[]><any>elements) {
      this.trainingService.wrap(element);
    }*/
  }


  foreignWordClick(word: IWord): void {
    this.markWord(this.foreignWords, word);
    this.check(word);
  }


  nativeWordClick(word: IWord): void {
    this.markWord(this.nativeWords, word);
    this.check(word);
  }


  markWord(arrayOfWords: IWord[], word: IWord): void {
    arrayOfWords.forEach(item => item.marked = item.id === word.id);
  }


  check(word: IWord): void {
    if (this.arrayMarked(this.foreignWords)
      && this.arrayMarked(this.nativeWords)) {

      if (this.isAnswerRight(this.foreignWords, this.nativeWords)) {

        this.hideWords();

        if (this.allHided()) {
          this.trainingService
            .changeAlgorithmStream.next(this.wasError);
        }

      } else {

        this.setErrorWords();
        this.wasError = true;
      }
    }
  }


  allHided(): boolean {
    for (let word of this.foreignWords) {
      if (!word.hide) return false;
    }

    for (let word of this.nativeWords) {
      if (!word.hide) return false;
    }

    return true;
  }


  setErrorWords(): void {
    const foreignWord: IWord = this.getMarkedWord(this.foreignWords);
    const nativeWord: IWord = this.getMarkedWord(this.nativeWords);

    if (foreignWord && nativeWord) {
      foreignWord.error = true;
      nativeWord.error = true;

      foreignWord.marked = false;
      nativeWord.marked = false;

      setTimeout(() => {
        foreignWord.error = false;
        nativeWord.error = false;
      }, 500);
    }
  }


  hideWords(): void {
    const foreignWord: IWord = this.getMarkedWord(this.foreignWords);
    const nativeWord: IWord = this.getMarkedWord(this.nativeWords);

    if (foreignWord && nativeWord) {
      foreignWord.hide = true;
      nativeWord.hide = true;

      foreignWord.marked = false;
      nativeWord.marked = false;
    }
  }


  isAnswerRight(leftArray: IWord[], rightArray: IWord[]): boolean {
    const leftWord: IWord = this.getMarkedWord(leftArray);
    const rightWord: IWord = this.getMarkedWord(rightArray);

    if (rightWord && leftWord) return rightWord.id === leftWord.id;

    return false;
  }


  getMarkedWord(arrayOfWords: IWord[]): IWord {
    for (let word of arrayOfWords) {
      if (word.marked) return word;
    }

    return undefined;
  }


  arrayMarked(arrayOfWords: IWord[]): boolean {
    for (let word of arrayOfWords) {
      if (word.marked) return true;
    }

    return false;
  }

}
