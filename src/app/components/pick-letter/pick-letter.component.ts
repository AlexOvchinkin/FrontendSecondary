import { Component, OnInit, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { ITrainingWord } from '../../types';
import { PickLetterService, IWord, ILetter } from '../../services/pick-letter.service';
import { TrainingService } from '../../services/training.service';

@Component({
  selector: 'app-pick-letter',
  templateUrl: './pick-letter.component.html',
  styleUrls: ['./pick-letter.component.css'],
  providers: [PickLetterService]
})
export class PickLetterComponent implements OnInit, OnChanges {

  @Input() mainWord: ITrainingWord;
  @Input() randomNumber: number;

  checkWords: IWord[] = [];
  pickLetters: ILetter[] = [];

  currentPosition: number = 0;
  isError: boolean;

  constructor(private pickLetterService: PickLetterService,
    private trainingService: TrainingService) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentPosition = 0;
    this.isError = false;

    this.checkWords = this.pickLetterService.splitPhrase(this.mainWord.foreign);
    this.pickLetters = this.pickLetterService.getPhraseLetters(this.mainWord.foreign);
  }


  @HostListener('document:keyup', ['$event'])
  documentClick(event: KeyboardEvent): void {
    const currentLetter = this.pickLetterService.getLetterByValue(this.pickLetters, event.key);
    if (currentLetter) {
      this.onPickLetterClick(currentLetter);
    } else {
      if (event.keyCode !== 32) this.isError = true;
    }
  }


  onPickLetterClick(letter: ILetter): void {
    const currentLetter: ILetter = this.pickLetterService
      .getCurrentLetter(this.checkWords, this.currentPosition);

    if (!currentLetter) return;

    if (letter.value === currentLetter.value) {
      this.pickLetterService.showLetter(this.checkWords, this.currentPosition);
      this.pickLetters = this.pickLetterService.hideLetter(this.pickLetters, letter.id);
      this.currentPosition++;

      if (this.pickLetterService.allLettersHided(this.pickLetters)) {
        this.trainingService.changeAlgorithmStream
          .next(this.isError);
      }

      return;
    }

    this.isError = true;
    letter.error = true;

    setTimeout(() => {
      letter.error = false;
    }, 500);
  }

}
