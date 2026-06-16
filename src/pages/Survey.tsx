import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import Checkbox from '../components/buttons/Checkbox';
import Datepicker from '../components/fields/DatePicker';
import DragAndDropUploadField from '../components/fields/DragAndDropUploadField';
import MapField from '../components/fields/MapField';
import MultiSelect from '../components/fields/MultiSelect';
import SelectField from '../components/fields/SelectField';
import TextAreaField from '../components/fields/TextAreaField';
import TextField from '../components/fields/TextField';
import TimePicker from '../components/fields/TimePicker';
import FullscreenLoader from '../components/other/FullscreenLoader';
import { ProgressBar } from '../components/other/ProgressBar';
import Default from '../layouts/Default';
import { device } from '../styles';
import { Option, Question } from '../types';
import { ButtonColors, buttonLabels, isEmpty, QuestionType, slugs } from '../utils';
import { api } from '../utils/api';
import InfoCardButtonsGroup from '../components/buttons/InfoCardButtonsGroup';
import NumericTextField from '../components/fields/NumericTextField';
import AddressPicker, { AddressValue } from '../components/fields/AddressPicker';

const Survey = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageId = searchParams.get('pageId') || '';
  const [values, setValues] = useState<{ [key: number]: any }>({});
  const {
    data: currentResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['currentResponse', pageId],
    queryFn: () => api.getCurrentResponse(pageId),
    retry: false,
  });

  useEffect(() => {
    if (!isError) return;

    navigate(slugs.surveys);
  }, [isError]);

  useEffect(() => {
    if (!currentResponse?.values) return;

    setValues(currentResponse?.values);
  }, [currentResponse?.values]);

  const handleIsHiddenField = (
    allQuestions: Record<number, Question>,
    conditions: Question['condition'],
  ) => {
    if (!allQuestions || !conditions) return false;

    const conditionsArray = Array.isArray(conditions) ? conditions : [conditions];

    if (conditionsArray.length === 0) return false;

    const allConditionsMet = conditionsArray.every((condition) => {
      const conditionQuestion = allQuestions[condition.question];
      if (!conditionQuestion) return false;

      const conditionQuestionValue = values?.[condition.question];

      if (conditionQuestion.type === QuestionType.MULTISELECT) {
        return conditionQuestionValue?.includes(condition.value);
      } else {
        return conditionQuestionValue === condition.value;
      }
    });

    return !allConditionsMet;
  };

  const renderField = (
    conditionQuestions: Record<number, Question>,
    currentQuestion: Question,
    onChange,
    values,
  ) => {
    const { condition, title, hint, options, required, spField, customLogic } = currentQuestion;
    const fieldValue = values?.[currentQuestion.id];
    const maxSelectedValues =
      (customLogic && customLogic.search(/select/i) !== -1 && Number(customLogic.split('_')[1])) ||
      5;
    //customLogic can be select_1 select_3 select_4 etc

    if (handleIsHiddenField(conditionQuestions, condition)) {
      return <></>;
    }

    const getCommonProps = {
      onChange,
      value: fieldValue,
      label: `${title} ${!required ? ' (Neprivalomas) ' : ''}`,
      bottomLabel: hint,
    };
    const geSelectProps = {
      ...getCommonProps,
      getOptionLabel: (option: Option) => option.title,
      description: (option: Option) => option.description,
      options,
    };

    const handleUpload = async (newPhotos: File[]) => {
      const files = await api.uploadFiles(newPhotos);
      const oldValues = fieldValue || [];
      onChange([...oldValues, ...files]);
    };

    switch (currentQuestion.type) {
      case QuestionType.SELECT:
        return (
          <SelectField
            {...geSelectProps}
            value={options.find((option) => option.id === fieldValue)}
            onChange={(value) => onChange(value.id)}
          />
        );
      case QuestionType.MULTISELECT:
        return (
          <MultiSelect
            {...geSelectProps}
            value={options.filter((option) => fieldValue?.includes(option.id))}
            onChange={(values) => onChange(values.map((value) => value.id))}
            maxSelectedValues={maxSelectedValues}
          />
        );
      case QuestionType.INPUT:
        return <TextField {...getCommonProps} />;
      case QuestionType.NUMBER:
        return <NumericTextField {...getCommonProps} />;
      case QuestionType.INFOCARD:
        return (
          <InfoCardButtonsGroup
            {...geSelectProps}
            onChange={(value) => onChange(value.id)}
            isSelected={(options) => options.id === fieldValue}
          />
        );
      case QuestionType.EMAIL:
        return <TextField {...getCommonProps} type="email" />;
      case QuestionType.TEXT:
        return <TextAreaField {...getCommonProps} />;

      case QuestionType.DATE_TIME:
        return (
          <TimeRow>
            <Datepicker {...getCommonProps} />
            <TimePicker {...getCommonProps} label="" />
          </TimeRow>
        );

      case QuestionType.DATE:
        return <Datepicker {...getCommonProps} />;

      case QuestionType.CHECKBOX:
        return <Checkbox {...getCommonProps} />;
      case QuestionType.LOCATION:
        return <MapField {...getCommonProps} />;
      case QuestionType.RADIO:
        return (
          <ButtonsGroup
            {...geSelectProps}
            onChange={(value) => onChange(value.id)}
            isSelected={(options) => options.id === fieldValue}
          />
        );
      case QuestionType.FILES:
        return (
          <DragAndDropUploadField
            {...geSelectProps}
            files={fieldValue}
            onUpload={handleUpload}
            onDelete={(files: any) => onChange(files)}
          />
        );
      case QuestionType.ADDRESS:
        return (
          <AddressPicker
            {...getCommonProps}
            value={fieldValue as AddressValue | undefined}
            onChange={(addr: AddressValue) => onChange(addr)}
          />
        );
      default:
        return null;
    }
  };

  const submitResponseMutation = useMutation({
    mutationFn: (params: { [key: string]: any }) => api.submitResponse(pageId, { values: params }),
    onSuccess: (data) => {
      const nav = data?.nextResponse ? { search: `pageId=${data.nextResponse}` } : slugs.end;

      return navigate(nav);
    },
  });

  const handleSubmit = () => {
    submitResponseMutation.mutateAsync(values);
  };

  if (isLoading || !currentResponse?.page) return <FullscreenLoader />;

  // eslint-disable-next-line no-unsafe-optional-chaining
  const { title, description } = currentResponse?.page;
  const questions = currentResponse?.questions || [];
  const showBackButton = !!currentResponse?.previousResponse;

  const progress = currentResponse?.progress;

  const mappedQuestionsByIds = questions.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});

  const handleIsRequired = (question: Question) => {
    const { condition, required, id, type } = question;
    const v = values[id];

    if (type === QuestionType.ADDRESS) {
      const addr = v as AddressValue | undefined;
      const isEmptyAddress = !addr || !addr.gyvId;
      if (!isEmptyAddress) return false;
    } else {
      if (!isEmpty(v)) return false;
    }

    if (handleIsHiddenField(mappedQuestionsByIds, condition)) return false;

    if (required) return true;
  };

  const isDisabledSubmit = submitResponseMutation.isPending || questions.some(handleIsRequired);

  return (
    <Default
      backUrl={slugs.surveys}
      topComponent={<ProgressBar current={progress.current} total={progress.total} />}
      title={title}
      description={description}
      maxWidth={672}
    >
      <Container>
        {questions?.map((question) =>
          renderField(
            mappedQuestionsByIds,
            question,
            (value) => setValues({ ...values, [question.id]: value }),
            values,
          ),
        )}

        <ButtonsContainer $showBackButton={showBackButton}>
          {showBackButton && (
            <Button
              disabled={submitResponseMutation.isPending}
              variant={ButtonColors.TRANSPARENT}
              onClick={() => {
                navigate({ search: `pageId=${currentResponse?.previousResponse}` });
              }}
            >
              {buttonLabels.back}
            </Button>
          )}
          <Button
            disabled={isDisabledSubmit}
            loading={submitResponseMutation.isPending}
            onClick={() => handleSubmit()}
          >
            {buttonLabels.continueFilling}
          </Button>
        </ButtonsContainer>
      </Container>
    </Default>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1;
  align-items: center;
  gap: 32px;
  width: 100%;
`;

const ButtonsContainer = styled.div<{ $showBackButton: boolean }>`
  display: flex;
  margin-top: 55px;
  flex-wrap: wrap-reverse;
  gap: 10px;
  justify-content: ${({ $showBackButton }) => ($showBackButton ? 'space-between' : 'flex-end')};

  @media ${device.mobileL} {
    flex-wrap: wrap-reverse;
    gap: 10px;
    button {
      width: 100%;
    }
  }
`;

const TimeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: flex-end;
  gap: 12px;
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

export default Survey;
