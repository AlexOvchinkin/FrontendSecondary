import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
/*
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/forkJoin';
*/
import { ITrainingWord, IAlgorithm } from '../types';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';




@Injectable()
export class TrainingService {

  changeAlgorithmStream: Subject<boolean> = new Subject();

  constructor() { }


  getWordsFromServer(): Observable<ITrainingWord[]> {
    return Observable.of([
      {
        id: '1',
        foreign: 'hello',
        native: 'привет'
      },
      {
        id: '2',
        foreign: 'conggggggrrrrratulations',
        native: 'принимайте поздравления'
      },
      {
        id: '3',
        foreign: 'happy new year',
        native: 'счастливого нового года'
      },
      {
        id: '4',
        foreign: 'santa claus',
        native: 'санта-клаус'
      },
      {
        id: '5',
        foreign: 'village',
        native: 'деревня'
      }
    ]);
  }


  // получить 20 случайных слов, исключая тренируемые
  getPickWordsFromServer(): Observable<ITrainingWord[]> {
    return Observable.of([
      {
        id: '6',
        foreign: 'laying',
        native: ['наложение']
      },
      {
        id: '7',
        foreign: 'wiped',
        native: ['вытертый']
      },
      {
        id: '8',
        foreign: 'turnstile',
        native: ['турникет']
      },
      {
        id: '9',
        foreign: 'dinner',
        native: ['обед']
      },
      {
        id: '10',
        foreign: 'taxi',
        native: ['такси']
      },
      {
        id: '11',
        foreign: 'quivering',
        native: ['дрожащий']
      },
      {
        id: '12',
        foreign: 'fond',
        native: ['нежный']
      },
      {
        id: '13',
        foreign: 'brawl',
        native: ['уличный скандал']
      },
      {
        id: '14',
        foreign: 'repent',
        native: ['раскаиваться']
      },
      {
        id: '15',
        foreign: 'criminal',
        native: ['преступник']
      },
      {
        id: '16',
        foreign: 'cent',
        native: ['цент']
      },
      {
        id: '17',
        foreign: 'bureau',
        native: ['контора']
      },
      {
        id: '18',
        foreign: 'aware',
        native: ['сознающий']
      },
      {
        id: '19',
        foreign: 'await',
        native: ['ждать']
      },
      {
        id: '20',
        foreign: 'schoolmaster',
        native: ['учитель']
      },
      {
        id: '21',
        foreign: 'recruit',
        native: ['вербовать']
      },
      {
        id: '22',
        foreign: 'make',
        native: ['производить']
      },
      {
        id: '23',
        foreign: 'seats',
        native: ['места']
      },
      {
        id: '24',
        foreign: 'surroundings',
        native: ['окрестности']
      },
      {
        id: '25',
        foreign: 'presented',
        native: ['представленный']
      }
    ]);
  }

  
  getTrainingWords(): Observable<any> {
    const firstStream = this.getWordsFromServer();
    const secondStream = this.getPickWordsFromServer();

    return firstStream
    .flatMap(firstArray => {
      return secondStream
        .flatMap(secondArray => {
          return Observable.of([firstArray, secondArray]);
        });
    })
  }


  public getShuffledArray(array: any): any {
    const newArray = [];
    let max = 0;

    while (array.length > 0) {
      max = array.length;
      const item = array.splice(this.getRandomInt(0, max), 1)[0];
      newArray.push(item);
    }

    return newArray;
  }


  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }


  getAlgorithmNames(): string[] {
    return [
      'pick-word',
      'pick-word-native',
      'pick-letter',
      'print-word'
    ];
  }


  getArrayOfAlgorithms(words: ITrainingWord[]): IAlgorithm[] {
    const names = this.getAlgorithmNames();
    const algorithms: IAlgorithm[] = [];

    for (let name of names) {
      for (let word of words) {
        algorithms.push({
          algorithm: name,
          word: word
        });
      }
    }

    algorithms.unshift({
      algorithm: 'bind-words',
      words: words
    });
    
    return algorithms;
  }


  getArrayOfWords(dataFromServer: any): ITrainingWord[] {
    if (!dataFromServer || !dataFromServer[0] || !dataFromServer[1]) {
      return [];
    }

    const words = dataFromServer[0];
    const pickWords = dataFromServer[1];

    if (!Array.isArray(words) || !Array.isArray(pickWords)
      || words.length === 0 || pickWords.length !== words.length * 4) {
      return [];
    }

    const combinedArray: ITrainingWord[] = [];
    let counter = 0;

    for (let word of words) {
      combinedArray.push({
        id: word.id,
        foreign: word.foreign,
        native: word.native,
        pickWords: pickWords.slice(counter, counter + 4)
      });

      counter += 4;
    }

    return combinedArray;

  }

/*
  wrap(divElement: any): void {
    const childElement = divElement.children[0];
    const text: string = childElement.innerText;
    const newText: string[] = [];
  
    if (childElement.clientWidth < divElement.clientWidth - 10) return;

    for (let letter of text) {
      newText.push(letter);
      childElement.innerText = newText.join("");
  
      if (childElement.clientWidth > divElement.clientWidth - 20 && letter !== '-') {
        const last = newText.pop();
        const beforeLast = newText.pop();
        newText.push('-');
        newText.push(beforeLast);
        newText.push(last);
        childElement.innerText = newText.join("");
      }
    }
  }
*/
}
