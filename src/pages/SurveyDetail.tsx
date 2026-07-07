import { Link, useNavigate, useParams } from 'react-router-dom';
import Default from '../layouts/Default';
import { api, formatDate } from '../utils';
import { useUser } from '../utils/hooks';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { device } from '../styles';
import StatusTag from '../components/fields/StatusTag';

const statusLabels = {
  SUBMITTED: 'Pateiktas',
  DRAFT: 'Juodraštis',
  REJECTED: 'Atmestas',
  APPROVED: 'Patvirtintas',
  FINISHED: 'Pabaigtas',
  PHYSICALCHECK: 'Fizinis tikrinimas',
  ADMINCHECK: 'Administracinis tikrinimas',
  WATCHCHECK: 'Vykdoma stebėsena',
  NONACTIVE: 'Neaktualus',
};

const filteredOutSpFields = ['Anonimas', 'pran_elpastas'];
const filteredOutTypes = ['FILES', 'CHECKBOX'];

export const SurveyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();

  const { data, isLoading } = useQuery({
    queryKey: ['surveyDetail', id],
    queryFn: () => api.getDetailedReport(id || ''),
    enabled: !!id,
  });

  if (!user) navigate('/');

  const answers =
    data?.answers?.filter(
      (item) =>
        !filteredOutTypes.includes(item.type) &&
        !filteredOutSpFields.includes(item.spField) &&
        item.answer,
    ) ?? [];

  const renderAnswer = (item) => {
    if (item.type === 'MULTISELECT') return item.answer.join(', ');
    if (item.type === 'DATE') return formatDate(item.answer);
    if (item.type === 'ADDRESS') return item.answer.fullName;
    return item.answer;
  };

  return (
    <Default title={`Pranešimas Nr. ${id}`} description="">
      <BackLink to="/mano">
        <span aria-hidden="true">←</span> Grįžti
      </BackLink>

      {isLoading && <LoadingState>Kraunama...</LoadingState>}

      {!isLoading && data && (
        <>
          <SummaryCard>
            <Field>
              <FieldLabel>PRAŠYMO NR.</FieldLabel>
              <FieldValue>{data?.id}</FieldValue>
            </Field>
            <Divider />
            <Field>
              <FieldLabel>Pateikimo data</FieldLabel>
              <FieldValue>{formatDate(data?.finishedAt)}</FieldValue>
            </Field>
            <Divider />
            <Field>
              <FieldLabel>Tipas</FieldLabel>
              <FieldValue>{data?.survey?.title}</FieldValue>
            </Field>
            <Divider />
            <Field>
              <FieldLabel>Statusas</FieldLabel>
              <FieldValue>{statusLabels[data?.status]}</FieldValue>
            </Field>
          </SummaryCard>

          <SectionTitle>Pranešimo klausimai</SectionTitle>

          {answers.length === 0 ? (
            <EmptyState>Šiam pranešimui klausimų nėra.</EmptyState>
          ) : (
            <AnswerList>
              {answers.map((item, index) => (
                <AnswerRow key={item.id ?? `${item.title}-${index}`}>
                  <Question>
                    <QuestionIndex>{index + 1}</QuestionIndex>
                    {item.title}
                  </Question>
                  <Answer>{renderAnswer(item)}</Answer>
                </AnswerRow>
              ))}
            </AnswerList>
          )}
        </>
      )}
    </Default>
  );
};

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 20px;

  &:hover {
    color: rgb(9, 26, 90);
  }
`;

const LoadingState = styled.div`
  color: #6b7280;
  font-size: 14px;
  padding: 24px 0;
`;

const EmptyState = styled.div`
  color: #9ca3af;
  font-size: 14px;
  padding: 16px 20px;
  background: #fafafc;
  border-radius: 6px;
  width: 90%;

  @media ${device.mobileL}, ${device.mobileM} {
    width: 100%;
  }
`;

const SummaryCard = styled.div`
  display: flex;
  align-items: stretch;
  gap: 24px;
  background-color: rgb(245, 246, 254);
  padding: 20px 24px;
  border-radius: 4px;
  width: 90%;
  margin-bottom: 32px;

  @media ${device.mobileL}, ${device.mobileM} {
    width: 100%;
    flex-direction: column;
    gap: 16px;
  }
`;

const Divider = styled.div`
  width: 1px;
  background-color: rgba(76, 79, 224, 0.15);

  @media ${device.mobileL}, ${device.mobileM} {
    width: 100%;
    height: 1px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const FieldLabel = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #8b8fb8;
`;

const FieldValue = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: rgb(9, 26, 90);
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: rgb(9, 26, 90);
  margin: 32px 0 16px;
`;

const AnswerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 90%;

  @media ${device.mobileL}, ${device.mobileM} {
    width: 100%;
  }
`;

const AnswerRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 18px;
  border-radius: 4px;
  border: 1px solid rgba(76, 79, 224, 0.08);
`;

const Question = styled.p`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  color: #6b7280;
  font-size: 13px;
`;

const QuestionIndex = styled.span`
  font-weight: 700;
`;

const Answer = styled.p`
  margin: 0;
  padding: 8px 16px;
  background-color: rgb(245, 246, 254);
  border-radius: 4px;
  color: #1f2430;
  font-size: 15px;
  line-height: 1.5;
`;
