import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import FieldWrapper from './components/FieldWrapper';
import TextFieldInput from './components/TextFieldInput';
import OptionsContainer from './components/OptionsContainer';
import Icon from '../other/Icons';
import { IconName } from '../../utils';
import { api, AddressSearchItem } from '../../utils/api';

export interface AddressValue {
  gyvId: number | null;
  gyvName?: string;
  adrId: number | null;
  adrName?: string;
}

interface AddressPickerProps {
  label?: string;
  bottomLabel?: string;
  error?: string;
  showError?: boolean;
  disabled?: boolean;
  value?: AddressValue;
  onChange: (value: AddressValue) => void;
}

const AddressPicker = ({
  label,
  bottomLabel,
  error,
  showError = true,
  disabled,
  value,
  onChange,
}: AddressPickerProps) => {
  const current: AddressValue = value ?? {
    gyvId: null,
    gyvName: undefined,
    adrId: null,
    adrName: undefined,
  };

  const [gyvSearch, setGyvSearch] = useState('');
  const [adrSearch, setAdrSearch] = useState('');

  const [openGyv, setOpenGyv] = useState(false);
  const [openAdr, setOpenAdr] = useState(false);

  useEffect(() => {
    if (!value) {
      setGyvSearch('');
      setAdrSearch('');
      return;
    }

    if (value.gyvName) {
      setGyvSearch(value.gyvName);
    }

    if (value.adrName) {
      setAdrSearch(value.adrName);
    }
  }, [value]);

  const formatLabel = (item?: AddressSearchItem) =>
    item ? `${item.pavad}${item.vietove ? `, ${item.vietove}` : ''}` : '';

  const hasMinGyvChars = gyvSearch.trim().length >= 2;

  const { data: gyvList = [], isLoading: gyvLoading } = useQuery({
    queryKey: ['addrFindGyv', gyvSearch],
    enabled: hasMinGyvChars,
    queryFn: () => api.findGyv(gyvSearch.trim()),
    retry: false,
  });

  const gyvOptions = hasMinGyvChars ? gyvList.map(formatLabel) : [];

  const handleGyvSelect = (item: AddressSearchItem) => {
    const label = formatLabel(item);

    onChange({
      gyvId: item.id,
      gyvName: label,
      adrId: null,
      adrName: undefined,
    });

    setGyvSearch(label);
    setAdrSearch('');
    setOpenGyv(false);
  };

  const hasMinAdrChars = adrSearch.trim().length >= 2;

  const { data: adrList = [], isLoading: adrLoading } = useQuery({
    queryKey: ['addrFindAdr', current.gyvId, adrSearch],
    enabled: !!current.gyvId && hasMinAdrChars,
    queryFn: () => api.findAdr(current.gyvId!, adrSearch.trim()),
    retry: false,
  });

  const adrOptions = hasMinAdrChars ? adrList.map(formatLabel) : [];

  const handleAdrSelect = (item: AddressSearchItem) => {
    const label = formatLabel(item);

    onChange({
      ...current,
      adrId: item.id,
      adrName: label,
    });

    setAdrSearch(label);
    setOpenAdr(false);
  };

  // Turn dropdowns off if clicked outside
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpenGyv(false);
        setOpenAdr(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <FieldWrapper label={label} bottomLabel={bottomLabel} error={error} showError={showError}>
      <Wrapper ref={rootRef}>
        <Row>
          <Column>
            <SubLabel>Gyvenvietė</SubLabel>
            <SelectWrapper>
              <InputClickArea
                onClick={() => {
                  if (!disabled) setOpenGyv(true);
                }}
              >
                <TextFieldInput
                  value={gyvSearch}
                  onChange={(t) => {
                    setGyvSearch(t);
                    setOpenGyv(true);
                  }}
                  placeholder="Įrašykite miesto arba kaimo pavadinimą"
                  error={undefined}
                  leftIcon={undefined}
                  rightIcon={<StyledIcon name={IconName.dropdownArrow} />}
                  disabled={disabled}
                />
              </InputClickArea>

              <OptionsContainer
                loading={gyvLoading}
                values={
                  openGyv ? (hasMinGyvChars ? gyvOptions : ['Įrašykite bent 2 simbolius']) : []
                }
                getOptionLabel={(label: string) => label}
                showSelect={openGyv && (!!gyvOptions.length || !hasMinGyvChars)}
                handleClick={(label: string) => {
                  if (!hasMinGyvChars) return;
                  const item = gyvList.find((i) => formatLabel(i) === label);
                  if (item) handleGyvSelect(item);
                }}
                isAddress
              />
            </SelectWrapper>
          </Column>

          <Column>
            <SubLabel>Adresas</SubLabel>
            <SelectWrapper>
              <InputClickArea
                onClick={() => {
                  if (!disabled && current.gyvId) setOpenAdr(true);
                }}
              >
                <TextFieldInput
                  value={adrSearch}
                  onChange={(t) => {
                    setAdrSearch(t);
                    setOpenAdr(true);
                  }}
                  placeholder="Įrašykite gatvės pavadinimą"
                  error={undefined}
                  leftIcon={undefined}
                  rightIcon={<StyledIcon name={IconName.dropdownArrow} />}
                  disabled={disabled || !current.gyvId}
                />
              </InputClickArea>

              <OptionsContainer
                loading={adrLoading}
                values={
                  openAdr ? (hasMinAdrChars ? adrOptions : ['Įrašykite bent 2 simbolius']) : []
                }
                getOptionLabel={(label: string) => label}
                showSelect={
                  openAdr && (!!adrOptions.length || (!hasMinAdrChars && !!current.gyvId))
                }
                handleClick={(label: string) => {
                  if (!hasMinAdrChars) return;
                  const item = adrList.find((i) => formatLabel(i) === label);
                  if (item) handleAdrSelect(item);
                }}
                isAddress
              />
            </SelectWrapper>
          </Column>
        </Row>
      </Wrapper>
    </FieldWrapper>
  );
};

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SubLabel = styled.div`
  margin-top: 12px;
  color: #667085;
`;

const StyledIcon = styled(Icon)`
  color: #cdd5df;
  font-size: 2.4rem;
  margin-right: 12px;
`;

const Wrapper = styled.div`
  width: 100%;
`;

const InputClickArea = styled.div`
  width: 100%;
`;

export default AddressPicker;
