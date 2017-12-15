import { Injectable } from '@angular/core';
import { ITrainingWord } from '../types';
import { TrainingService } from './training.service';

export interface IWord {
  id: string,
  value: string,
  hide: boolean,
  error: boolean,
  marked: boolean
}

@Injectable()
export class BindWordsService {

  constructor(private trainingService: TrainingService) { }


  getForeignWords(wordsArray: ITrainingWord[]): IWord[] {
    const foregnWords: IWord[] = [];

    wordsArray.forEach(item => {
      foregnWords.push({
        id: item.id,
        value: item.foreign,
        hide: false,
        error: false,
        marked: false
      });
    });

    return this.trainingService.getShuffledArray(foregnWords);
  }


  getNativeWords(wordsArray: ITrainingWord[]): IWord[] {
    const nativeWords: IWord[] = [];

    wordsArray.forEach(item => {
      nativeWords.push({
        id: item.id,
        value: item.native as string,
        hide: false,
        error: false,
        marked: false
      });
    });

    return this.trainingService.getShuffledArray(nativeWords);
  }
}
