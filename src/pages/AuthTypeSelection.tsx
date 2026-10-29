import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import InfoCard from '../components/cards/InfoCard';
import Icon from '../components/other/Icons';
import Default from '../layouts/Default';
import { buttonLabels, descriptions, IconName, titles, AuthTypes } from '../utils';
import { api } from '../utils/api';

const AuthTypeSelection = () => {
  const [selectedSurveyAuthType, setSelectedSurveyAuthType] = useState<boolean | undefined>(
    undefined,
  );
  const [searchParams] = useSearchParams();
  const surveyId = searchParams.get('surveyId') || '';
  const [buttonLoading, setButtonLoading] = useState(false);
  const { data: surveys } = useQuery({
    queryKey: ['surveys'],
    queryFn: () => api.getAllSurveys(),
  });
  const survey = surveys?.find((item) => item.id === Number(surveyId));
  const showAnonymousOption =
    survey?.authType === AuthTypes.OPTIONAL && survey?.anonymousAuthAvailable !== false;

  useEffect(() => {
    if (survey && !showAnonymousOption) {
      setSelectedSurveyAuthType(true);
    }
  }, [showAnonymousOption, survey]);

  const info = [
    {
      title: titles.anonym,
      description: descriptions.anonym,
      icon: <Icon name={IconName.anonym} />,
      value: false,
    },
    {
      title: titles.authenticated,
      description: descriptions.authenticated,
      icon: <Icon name={IconName.user} />,
      value: true,
    },
  ].filter((item) => showAnonymousOption || item.value);

  return (
    <Default title={titles.surveyType} description={descriptions.surveyType}>
      <form action={`/api/sessions/start`} method="POST">
        <input type="hidden" name="survey" value={surveyId} />
        <input type="hidden" name="auth" value={`${selectedSurveyAuthType}`} />
        <Container>
          <ContentContainer $isSingle={info.length === 1}>
            {info?.map((item) => (
              <InfoCard
                key={item.title}
                info={item}
                onClick={() => setSelectedSurveyAuthType(item.value)}
                isActive={selectedSurveyAuthType == item.value}
              />
            ))}
          </ContentContainer>
          <ButtonContainer>
            <Button
              onClick={() => setButtonLoading(true)}
              loading={buttonLoading}
              disabled={typeof selectedSurveyAuthType === 'undefined'}
              type="submit"
            >
              {buttonLabels.next}
            </Button>
          </ButtonContainer>
        </Container>
      </form>
    </Default>
  );
};

const ContentContainer = styled.div<{ $isSingle: boolean }>`
  display: grid;
  justify-content: center;
  grid-template-columns: ${({ $isSingle }) =>
    $isSingle ? 'minmax(250px, 420px)' : 'repeat(auto-fill, minmax(250px, 1fr))'};
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
  width: 100%;
`;

export default AuthTypeSelection;
