import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TrainingComponent } from './components/training/training-component';
import { TrainingService } from './services/training.service';
import { PickWordComponent } from './components/pick-word/pick-word.component';
import { PickWordNativeComponent } from './components/pick-word-native/pick-word-native.component';
import { PickLetterComponent } from './components/pick-letter/pick-letter.component';
import { PrintWordComponent } from './components/print-word/print-word.component';
import { BindWordsComponent } from './components/bind-words/bind-words.component';

const routes: Routes = [
  { path: 'training', component: TrainingComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    TrainingComponent,
    PickWordComponent,
    PickWordNativeComponent,
    PickLetterComponent,
    PrintWordComponent,
    BindWordsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [TrainingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
