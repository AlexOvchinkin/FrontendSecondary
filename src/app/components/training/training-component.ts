import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../../services/training.service';
import { ITrainingWord, IAlgorithm } from '../../types';


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


}
