import styled from 'styled-components';
export interface TextFieldProps {
  value?: string | number;
  name?: string;
  error?: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  onChange?: (option?: any) => void;
  disabled?: boolean;
  height?: number;
  readOnly?: boolean;
  onInputClick?: () => void;
  placeholder?: string;
  type?: string;
  inputMode?: any;
  selectedValue?: boolean;
  onFocus?: any;
  maxLength?: number;
}

const TextFieldInput = ({
  value,
  name,
  error,
  readOnly = false,
  leftIcon,
  rightIcon,
  onChange,
  placeholder,
  type = 'text',
  disabled,
  height = 40,
  selectedValue = false,
  onInputClick,
  inputMode = 'text',
  onFocus = () => {},
  maxLength = 255,
  ...rest
}: TextFieldProps) => {
  return (
    <InputContainer $error={!!error} $height={height || 40} $disabled={disabled || false}>
      {leftIcon}
      <StyledTextInput
        $selectedValue={selectedValue}
        onClick={() => (onInputClick ? onInputClick() : null)}
        readOnly={readOnly}
        type={type}
        name={name}
        autoComplete="off"
        value={value || ''}
        onChange={(e) => onChange && onChange(e?.target?.value || '')}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={onFocus}
        inputMode={inputMode}
        maxLength={maxLength}
        {...rest}
      />
      {rightIcon}
    </InputContainer>
  );
};

const InputContainer = styled.div<{
  $error: boolean;
  $height: number;
  $disabled: boolean;
}>`
  display: flex;
  height: ${({ $height }) => `${$height}px`};
  background-color: white;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.border)};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'text')};
  :focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const StyledTextInput = styled.input<{
  readOnly: boolean;
  $selectedValue: boolean;
}>`
  border: none;
  padding: 0 12px;
  width: 100%;
  height: 100%;

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'text')};

  background-color: white;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text.input};

  &:focus {
    outline: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-input-placeholder {
    color: ${({ theme, $selectedValue }) =>
      theme.colors.text.input + `${!$selectedValue ? '8F' : ''}`};
    font-size: 1.4rem;
  }
  ::-moz-placeholder {
    color: ${({ theme, $selectedValue }) =>
      theme.colors.text.input + `${!$selectedValue ? '8F' : ''}`};
    font-size: 1.4rem;
  }
  ::-ms-placeholder {
    color: ${({ theme, $selectedValue }) =>
      theme.colors.text.input + `${!$selectedValue ? '8F' : ''}`};
    font-size: 1.4rem;
  }
  ::placeholder {
    color: ${({ theme, $selectedValue }) =>
      theme.colors.text.input + `${!$selectedValue ? '8F' : ''}`};
    font-size: 1.4rem;
  }
`;

export default TextFieldInput;
