import styled from 'styled-components';
import { inputLabels } from '../../../utils/texts';
import FullscreenLoader from '../../other/FullscreenLoader';

export interface SelectOption {
  id?: string;
  label?: string;
  [key: string]: any;
}

export interface OptionsContainerProps {
  values?: any[];
  disabled?: boolean;
  getOptionLabel: (option: any) => string;
  loading?: boolean;
  isAddress?: boolean;
  showSelect: boolean;
  observerRef?: any;
  handleClick: (option: any) => any;
}

const OptionsContainer = ({
  values = [],
  disabled = false,
  getOptionLabel,
  handleClick,
  isAddress = false,
  showSelect,
  loading,
  observerRef,
}: OptionsContainerProps) => {
  const display = showSelect;

  const renderOptions = () => {
    if (!values?.length)
      return loading ? (
        <FullscreenLoader />
      ) : (
        <Option key={inputLabels.noOptions}>{inputLabels.noOptions}</Option>
      );

    return (
      <>
        {values.map((option) => {
          return (
            <Option
              key={JSON.stringify(option)}
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                handleClick(option);
              }}
            >
              {isAddress ? option : getOptionLabel && getOptionLabel(option)}
            </Option>
          );
        })}
        {loading && <FullscreenLoader />}
      </>
    );
  };
  return (
    <OptionContainer display={display}>
      {renderOptions()}
      {observerRef && <ObserverRef display={display} ref={observerRef} />}
    </OptionContainer>
  );
};

const OptionContainer = styled.div<{ display: boolean }>`
  display: ${({ display }) => (display ? 'block' : 'none')};
  position: absolute;
  z-index: 9;
  width: 100%;
  padding: 10px 0px;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  border: none;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 2px 16px #121a5529;

  > * {
    &:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
  }
  > * {
    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
`;

const Option = styled.div<{ disabled?: boolean }>`
  font-size: 1.6rem;
  line-height: 20px;
  padding: 8px 12px;
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    background: #f3f3f7 0% 0% no-repeat padding-box;
  }
`;

const ObserverRef = styled.div<{ display: boolean }>`
  display: ${({ display }) => (display ? 'block' : 'none')};
`;

export default OptionsContainer;
