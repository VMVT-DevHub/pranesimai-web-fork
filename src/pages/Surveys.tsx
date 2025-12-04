import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import InfoCard from '../components/cards/InfoCard';
import FullscreenLoader from '../components/other/FullscreenLoader';
import Default from '../layouts/Default';
import { Survey } from '../types';
import { AuthTypes, buttonLabels, descriptions, slugs, titles } from '../utils';
import { api } from '../utils/api';

const Surveys = () => {
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | undefined>(undefined);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { data: surveys, isLoading } = useQuery({
    queryKey: ['surveys'],
    queryFn: () => api.getAllSurveys(),
  });

  const navigate = useNavigate();

  const isOptionalSurvey = selectedSurvey?.authType === AuthTypes.OPTIONAL;

  return (
    <Default maxWidth={1200} title={titles.surveyType} description={descriptions.surveyType}>
      <Container>
        {isLoading && <FullscreenLoader />}
        <form action={`/api/sessions/start`} method="POST">
          <input type="hidden" name="survey" value={selectedSurvey?.id} />
          <ContentContainer>
            {surveys?.map((survey) => (
              <InfoCard
                key={survey.id}
                info={survey}
                onClick={() => setSelectedSurvey(survey)}
                isActive={selectedSurvey?.id === survey.id}
              />
            ))}
          </ContentContainer>
          <ButtonContainer>
            <Button
              loading={buttonLoading}
              disabled={!selectedSurvey}
              onClick={() => {
                setButtonLoading(true);

                if (!isOptionalSurvey) return;

                navigate({ pathname: slugs.auth, search: `surveyId=${selectedSurvey?.id}` });
              }}
              type={isOptionalSurvey ? 'button' : 'submit'}
            >
              {buttonLabels.next}
            </Button>
          </ButtonContainer>
        </form>
      </Container>
    </Default>
  );
};

const ContentContainer = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 32px;
  width: 100%;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1;
  align-items: center;
  gap: 32px;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
`;

export default Surveys;
