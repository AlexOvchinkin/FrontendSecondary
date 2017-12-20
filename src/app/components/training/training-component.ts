import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../../services/training.service';
import { ITrainingWord, IAlgorithm } from '../../types';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-training-component',
  templateUrl: './training-component.html',
  styleUrls: ['./training-component.css']
})
export class TrainingComponent implements OnInit {
  algorithms: IAlgorithm[] = [];
  currentAlgorithm: IAlgorithm = { algorithm: 'none' };
  arrayOfTrainingWords: ITrainingWord[];
  randomNumber: number;
  allowExit: boolean = false;
  subject: Subject<boolean> = new Subject();
  popupHide: boolean = true;
  popupTimeoutID: any;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.randomNumber = 0;
    this.showNewWords();
    this.trainingService.changeAlgorithmStream
      .subscribe(data => {
        this.changeCurrentAlgorithm(data);
      });
  }


  showNewWords(): void {
    this.trainingService
      .getTrainingWords()
      .subscribe(data => {
        if (data) {
          this.arrayOfTrainingWords = this.trainingService.getArrayOfWords(data);

          if (data.length > 0) {
            this.algorithms = this.trainingService.getArrayOfAlgorithms(this.arrayOfTrainingWords);
            this.changeCurrentAlgorithm(false);
          }
        }
      });
  }


  changeCurrentAlgorithm(isError: boolean): void {
    this.randomNumber++;

    if (!isError) {
      this.currentAlgorithm = this.algorithms.shift();
      return;
    }

    this.algorithms.push(this.currentAlgorithm);
    this.currentAlgorithm = this.algorithms.shift();
  }


  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    this.popupHide = false;

    this.popupTimeoutID = setTimeout(() => {
      this.popupHide = true;
      this.subject.next(this.allowExit);
    }, 3000);

    return this.subject;
  }

  popupHandler(res): void {
    this.popupHide = true;
    this.allowExit = res;
    clearTimeout(this.popupTimeoutID);
    this.subject.next(res);
  }
}
