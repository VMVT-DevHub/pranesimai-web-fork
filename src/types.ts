import { AuthTypes, PageType, QuestionType } from './utils';

export interface CommonFields {
  id: number;
  createdAt: string;
}

export interface Survey extends CommonFields {
  title: string;
  authType: AuthTypes;
  anonymousAuthAvailable?: boolean;
  description: string;
  icon: string;
  firstPage: number;
  lastPage: number;
}

export interface Question extends CommonFields {
  required: boolean;
  riskEvaluation: boolean;
  spField: string;
  type: QuestionType;
  title: string;
  description: string;
  customLogic: string;
  condition: {
    question: number;
    value: string;
  }[];
  hint: string;
  options: Option[];
}

export interface Option extends CommonFields {
  title: string;
  [key: string]: any;
}

export interface Page extends CommonFields {
  type: PageType;
  title: string;
  description: string;
}

export interface Response extends CommonFields {
  page: Page;
  progress: {
    current: number;
    total: number;
  };
  questions: Question[];
  previousResponse: number;
  session: number;
  values: { [key: string]: any };
}

export type FileProps = {
  url: string;
  name: string;
  size: number;
};

export type FeatureCollection = {
  type: 'FeatureCollection';
  features: Feature[];
};

type GenericObject = {
  [key: string]: any;
};

type Feature = {
  type: 'Feature';
  geometry: Geometry;
  properties?: GenericObject;
};

type Geometry = {
  type: string;
  coordinates: CoordinatesTypes;
};
type CoordinatesPoint = number[];
type CoordinatesMultiPoint = CoordinatesPoint[];
type CoordinatesLineString = CoordinatesPoint[];
type CoordinatesMultiLineString = CoordinatesLineString[];
type CoordinatesPolygon = CoordinatesLineString[];
type CoordinatesMultiPolygon = CoordinatesPolygon[];

type CoordinatesTypes =
  | CoordinatesPoint
  | CoordinatesLineString
  | CoordinatesPolygon
  | CoordinatesMultiPoint
  | CoordinatesMultiLineString
  | CoordinatesMultiPolygon;
