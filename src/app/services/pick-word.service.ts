import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { ITrainingWord, IPickWord } from '../types';
import { TrainingService } from './training.service';

@Injectable()
export class PickWordService {

  constructor(private trainingService: TrainingService) { }

  getPickWords(word: any): IPickWord[] {
    let pickWords: IPickWord[] = [];

    word.pickWords.forEach(item => {
      pickWords.push({
        id: item.id,
        foreign: item.foreign,
        native: [item.native] as string[],
        isError: false
      });
    });

    pickWords.push({
      id: word.id,
      foreign: word.foreign,
      native: [word.native] as string[],
      isError: false
    });

    return this.trainingService.getShuffledArray(pickWords);
  }


  hideWord(words: IPickWord[], word: IPickWord): IPickWord[] {
    return words.filter(item => {
      return item.id !== word.id;
    });
  }


  isRightKey(key: string): boolean {
    return ['1', '2', '3', '4', '5'].includes(key);
  }


  getWord(arrayOfWords: IPickWord[], key: string): IPickWord {
    let pos: number = Number.parseInt(key);

    if (arrayOfWords.length >= pos) return arrayOfWords[--pos];
    
    return undefined;
  }

}
