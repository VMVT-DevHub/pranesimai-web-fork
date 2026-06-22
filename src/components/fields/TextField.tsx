import { useState } from 'react';
import FieldWrapper from './components/FieldWrapper';
import TextFieldInput from './components/TextFieldInput';
export interface TextFieldProps {
  value?: string | number;
  name?: string;
  error?: string;
  showError?: boolean;
  label?: string;
  icon?: JSX.Element;
  className?: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  padding?: string;
  onChange?: (option?: any) => void;
  bottomLabel?: string;
  disabled?: boolean;
  height?: number;
  readOnly?: boolean;
  onInputClick?: () => void;
  subLabel?: string;
  placeholder?: string;
  type?: string;
  secondLabel?: JSX.Element;
  selectedValue?: boolean;
}

const TextField = ({
  value,
  name,
  error,
  showError = true,
  readOnly = false,
  label,
  className,
  leftIcon,
  rightIcon,
  padding,
  onChange,
  subLabel,
  placeholder,
  bottomLabel,
  type,
  disabled,
  height,
  secondLabel,
  onInputClick,
}: TextFieldProps) => {
  const [errorMessage, setErrorMessage] = useState('');
  const handleBlur = () => {
    if (placeholder == '+37000000000') {
      const ltPhoneRegex = /^(?:\+370|0)\d{8}$/;
      if (value && !ltPhoneRegex.test(value.toString()))
        setErrorMessage('Netinkamas telefono numerio formatas.');
      else setErrorMessage('');
    }
  };
  return (
    <FieldWrapper
      handleBlur={handleBlur}
      padding={padding}
      className={className}
      label={label}
      subLabel={subLabel}
      secondLabel={secondLabel}
      error={errorMessage}
      showError={showError}
    >
      <TextFieldInput
        value={value}
        name={name}
        error={errorMessage}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        onChange={onChange}
        disabled={disabled}
        height={height}
        readOnly={readOnly}
        onInputClick={onInputClick}
        placeholder={placeholder}
        type={type}
      />
    </FieldWrapper>
  );
};

export default TextField;
