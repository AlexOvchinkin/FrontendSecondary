export interface IPickWord {
  id: string,
  foreign: string,
  native: string[],
  isError: boolean
}

export interface ITrainingWord {
  id: string,
  foreign: string,
  native: string | string[],
  pickWords?: IPickWord[]
}

export interface IAlgorithm {
  algorithm: string,
  word?: ITrainingWord,
  words?: ITrainingWord[]
}