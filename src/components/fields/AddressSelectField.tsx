import styled from 'styled-components';
import Icon from '../other/Icons';
import FieldWrapper from './components/FieldWrapper';
import OptionsContainer from './components/OptionsContainer';
import TextFieldInput from './components/TextFieldInput';
import { useSelectData } from './utils/hooks';
import { inputLabels } from '../../utils/texts';
import { api_reg, IconName } from '../../utils';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface SelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value?: any;
  placeholder?: string;
  error?: string;
  showError?: boolean;
  options?: any[];
  left?: JSX.Element;
  padding?: string;
  onChange: (option: any) => void;
  disabled?: boolean;
  getOptionLabel: (option: any) => string;
  className?: string;
  bottomLabel?: string;
}

const AddressSelectField = ({
  label,
  value,
  name,
  error,
  showError = true,
  options,
  className,
  bottomLabel,
  left,
  padding,
  placeholder = inputLabels.chooseOption,
  getOptionLabel,
  onChange,
  disabled,
}: SelectFieldProps) => {
  const {
    suggestions,
    input,
    handleToggleSelect,
    showSelect,
    handleBlur,
    handleClick,
    handleAddressClick,
    handleOnChange,
  } = useSelectData({ options, disabled, onChange, getOptionLabel });

  // - needs vpn to work currently -
  // sort of works, the data sets normally, but ui doesn't remember the value if we go back a step,
  // i think because we're setting the value here instead of backend?

  const [gyv, setGyv] = useState('');
  const [addressOptions, setAddressOptions] = useState(['']);
  const { data, isLoading } = useQuery({
    queryKey: ['gyv', gyv],
    queryFn: () => api_reg.getGyv(gyv),
    retry: false,
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const test = data?.map((item) => `${item.pavad}, ${item.vietove}`);
      setAddressOptions(test);
    }
  }, [data]);

  const handleChange = (input: string) => {
    handleOnChange(input);
    setGyv(input);
  };

  return (
    <FieldWrapper
      onClick={handleToggleSelect}
      padding={padding}
      className={className}
      label={label}
      error={error}
      showError={showError}
      bottomLabel={bottomLabel}
    >
      <TextFieldInput
        value={input}
        name={name}
        error={error}
        leftIcon={left}
        rightIcon={<StyledIcon name={IconName.dropdownArrow} />}
        onChange={handleChange}
        disabled={disabled}
        placeholder={(value && getOptionLabel(value)) || placeholder}
        selectedValue={value}
      />
      <OptionsContainer
        loading={isLoading}
        values={addressOptions}
        getOptionLabel={getOptionLabel}
        isAddress={true}
        showSelect={showSelect}
        handleClick={handleAddressClick}
      />
    </FieldWrapper>
  );
};

const StyledIcon = styled(Icon)`
  color: #cdd5df;
  font-size: 2.4rem;
  margin-right: 12px;
`;

export default AddressSelectField;
