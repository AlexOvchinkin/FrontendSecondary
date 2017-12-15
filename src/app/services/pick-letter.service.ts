import { Injectable, transition } from '@angular/core';
import { TrainingService } from './training.service';

export interface IWord {
  letters: ILetter[]
}

export interface ILetter {
  id: number,
  value: string,
  shown: boolean,
  error?: boolean
}

@Injectable()
export class PickLetterService {


  constructor(private trainingService: TrainingService) { }


  splitPhrase(phrase: string): IWord[] {
    const newPhrase: IWord[] = [];
    const words = phrase.trim().split(' ');

    for (let word of words) {
      const arrayOfLetters = word.split('');
      const letters = [];

      for (let letter of arrayOfLetters) {
        letters.push({
          value: letter,
          shown: false
        });
      }

      newPhrase.push({ letters: letters });
    }

    return newPhrase;
  }


  getPhraseLetters(phrase: string): ILetter[] {
    const words = phrase.trim().split(' ');
    const letters: ILetter[] = [];
    let id = 1;

    for (let word of words) {
      const arrayOfLetters = word.trim().split('');
      arrayOfLetters.forEach(item => {
        letters.push({
          id: id++,
          value: item,
          shown: true,
          error: false
        });
      });
    }

    return this.trainingService.getShuffledArray(letters);
  }


  hideLetter(arrayOfLetters: ILetter[], id: number): ILetter[] {
    return arrayOfLetters.filter(letter => {
      return letter.id !== id;
    });
  }


  getLetterByValue(arrayOfLetters: ILetter[], value: string): ILetter {
    for (let letter of arrayOfLetters) {
      if (letter.value === value) return letter;
    }

    return undefined;
  }


  getCurrentLetter(words: IWord[], position: number): ILetter {
    let wordPosition: number = 0;
    let letterPosition: number = 0;
    let currentPosition: number = 0;


    for (let word of words) {

      for (let letter of word.letters) {

        if (currentPosition === position) {
          return words[wordPosition].letters[letterPosition];
        }

        letterPosition++;
        currentPosition++;
      }

      letterPosition = 0;
      wordPosition++;
    }

    return undefined;
  }


  showLetter(words: IWord[], position: number): void {
    let wordPosition: number = 0;
    let letterPosition: number = 0;
    let currentPosition: number = 0;


    for (let word of words) {

      for (let letter of word.letters) {

        if (currentPosition === position) {
          words[wordPosition].letters[letterPosition].shown = true;
          return;
        }

        letterPosition++;
        currentPosition++;
      }

      letterPosition = 0;
      wordPosition++;
    }
  }


  allLettersHided(letters: ILetter[]): boolean {
    for (let letter of letters) {
      if (letter.shown) return false;
    }
    
    return true;
  }
}
