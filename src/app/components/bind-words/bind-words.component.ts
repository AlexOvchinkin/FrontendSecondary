import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ITrainingWord } from '../../types';
import { BindWordsService, IWord } from '../../services/bind-words.service';
import { TrainingService } from '../../services/training.service';



@Component({
  selector: 'app-bind-words',
  templateUrl: './bind-words.component.html',
  styleUrls: ['./bind-words.component.css'],
  providers: [BindWordsService]
})
export class BindWordsComponent implements OnInit, OnChanges {

  @Input() words: ITrainingWord[];
  @Input() randomNumber: number;

  foreignWords: IWord[] = [];
  nativeWords: IWord[] = [];
  mergedArray: IWord[] = [];

  wasError: boolean;


  constructor(private bindWordsService: BindWordsService,
    private trainingService: TrainingService) { }


  ngOnInit() { }


  ngOnChanges(changes: SimpleChanges): void {
    this.foreignWords = this.bindWordsService.getForeignWords(this.words);
    this.nativeWords = this.bindWordsService.getNativeWords(this.words);
    this.mergedArray = this.mergeArrays(this.foreignWords, this.nativeWords);
    this.wasError = false;
  }


  mergeArrays(foreignArray: IWord[], nativeArray: IWord[]): IWord[] {
    const mergedArray: IWord[] = [];

    for (let i = 0; i < foreignArray.length; i++) {
      mergedArray.push(foreignArray[i]);
      mergedArray.push(nativeArray[i]);
    }

    return mergedArray;
  }


  nativeWordClick(word: IWord): void {
    this.markWord(this.nativeWords, word);
    this.check(word);
  }


  foreignWordClick(word: IWord): void {
    this.markWord(this.foreignWords, word);
    this.check(word);
  }


  mergedWordClick(word: IWord): void {
    if (this.fromArray(this.foreignWords, word)) {
      this.foreignWordClick(word);
    } else {
      this.nativeWordClick(word);
    }
  }


  makeArraysEqual(mainArray: IWord[], array: IWord[]): void {
    mainArray.forEach(item => {
      const foundWord = array.find(word => {
        return word.id === item.id && word.value === item.value;
      });

      if (foundWord) {
        foundWord.marked = item.marked;
        foundWord.error = item.error;
      }
    });
  }


  fromArray(array: IWord[], word: IWord): boolean {
    for (let item of array) {
      if (item.id === word.id && item.value === word.value) return true;
    }

    return false;
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

      this.makeArraysEqual(this.foreignWords, this.mergedArray);
      this.makeArraysEqual(this.nativeWords, this.mergedArray);

      setTimeout(() => {
        foreignWord.error = false;
        nativeWord.error = false;

        this.makeArraysEqual(this.foreignWords, this.mergedArray);
        this.makeArraysEqual(this.nativeWords, this.mergedArray);
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

      this.makeArraysEqual(this.foreignWords, this.mergedArray);
      this.makeArraysEqual(this.nativeWords, this.mergedArray);
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
