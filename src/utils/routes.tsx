import AuthTypeSelection from '../pages/AuthTypeSelection';
import End from '../pages/End';
import { MySurveys } from '../pages/MySurveys';
import Survey from '../pages/Survey';
import Surveys from '../pages/Surveys';

export const slugs = {
  surveys: '/',
  auth: '/autentifikacija',
  survey: '/pranesimas',
  mySurveys: '/mano',
  end: '/pabaiga',
};

export const routes = [
  {
    slug: slugs.surveys,
    component: <Surveys />,
  },
  {
    slug: slugs.auth,
    component: <AuthTypeSelection />,
  },
  {
    slug: slugs.survey,
    component: <Survey />,
  },
  {
    slug: slugs.end,
    component: <End />,
  },
  {
    slug: slugs.mySurveys,
    component: <MySurveys />,
  },
];
