import styled from 'styled-components';
import FieldWrapper from '../fields/components/FieldWrapper';
import { Survey } from '../../types';
import { api, getIconUrl } from '../../utils';
import { useQuery } from '@tanstack/react-query';

export interface ToggleButtonProps {
  options: any[];
  onChange: (option?: any) => void;
  isSelected: (option?: any) => boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  getOptionLabel?: (option: any) => string;
  error?: string;
  showError?: boolean;
}

const InfoCardButtonsGroup = ({
  options,
  onChange,
  disabled,
  isSelected,
  className,
  label,
  getOptionLabel,
  error,
  showError = false,
}: ToggleButtonProps) => {
  const { data: session } = useQuery({
    queryKey: ['currentSession'],
    queryFn: () => api.getCurrentSession(),
    retry: false,
  });

  return (
    // <FieldWrapper error={error} showError={showError} label={label}>
    <InfoCardContainer>
      {options.map((option, index) => {
        let indexOfAuth = -1;
        if (session.auth == false && option.requiresAuth == true) {
          indexOfAuth = index;
        }
        return (
          <StyledButton
            $requiresAuth={indexOfAuth == index}
            type="button"
            disabled={disabled || option?.disabled}
            key={`group-button${index}`}
            left={index === 0}
            right={index === options.length - 1}
            selected={isSelected(option)}
            error={!!error}
            onClick={() => (disabled ? {} : onChange(option))}
          >
            <Circle />
            <Title>{getOptionLabel ? getOptionLabel(option) : option.title}</Title>
            <Description>{option.description}</Description>
          </StyledButton>
        );
      })}
    </InfoCardContainer>

    // </FieldWrapper>
  );
};
const InfoCardContainer = styled.div`
  display: grid;
  justify-content: center;
  gap: 32px;
  width: 100%;
`;
const AppIcon = styled.img`
  height: 54px;
`;

const Circle = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  position: absolute;
  top: 8px;
  left: 8px;
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 1.8rem;
  text-align: start;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Description = styled.div`
  font-weight: 400;
  font-size: 1.4rem;
  line-height: 24px;
  text-align: start;
  color: ${({ theme }) => theme.colors.label};
`;

const StyledButton = styled.button<{
  left: boolean;
  right: boolean;
  selected: boolean;
  disabled?: boolean;
  error?: boolean;
  $requiresAuth?: boolean;
}>`
  padding: 28px 16px 16px 28px;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-direction: column;
  border-radius: 4px;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  display: ${({ $requiresAuth }) => ($requiresAuth ? 'none' : 'flex')};
  ${({ selected, theme }) =>
    selected &&
    `
    background-color: #f5f6fe;
    border: 1px solid ${theme.colors.primary};

    ${Circle} {
      border: 4px solid  ${theme.colors.primary}};
  }

  `};

  :hover {
    background-color: #f5f6fe;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:hover ${Circle} {
    border: ${({ theme }) => `4px solid  ${theme.colors.primary}`};
  }
`;

export default InfoCardButtonsGroup;
