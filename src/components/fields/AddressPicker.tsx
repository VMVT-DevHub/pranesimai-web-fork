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
  gatId: number | null;
  gatName?: string;
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
    gatId: null,
    gatName: undefined,
    adrId: null,
    adrName: undefined,
  };

  const [gyvSearch, setGyvSearch] = useState('');
  const [gatSearch, setGatSearch] = useState('');
  const [adrSearch, setAdrSearch] = useState('');

  const [openGyv, setOpenGyv] = useState(false);
  const [openGat, setOpenGat] = useState(false);
  const [openAdr, setOpenAdr] = useState(false);

  useEffect(() => {
    if (!value) {
      setGyvSearch('');
      setGatSearch('');
      setAdrSearch('');
      return;
    }

    if (value.gyvName) {
      setGyvSearch(value.gyvName);
    }

    if (value.gatName) {
      setGatSearch(value.gatName);
    }

    if (value.adrName) {
      setAdrSearch(value.adrName);
    }
  }, [value]);

  const formatLabel = (item?: AddressSearchItem) =>
    item ? `${item.pavad}${item.vietove ? `, ${item.vietove}` : ''}` : '';

  const formatAltLabel = (item?: AddressSearchItem) => (item ? `${item.pavad}` : '');

  // ----------------- GYV (miestas/kaimas) -----------------
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
      gatId: null,
      gatName: undefined,
      adrId: null,
      adrName: undefined,
    });

    setGyvSearch(label);
    setGatSearch('');
    setAdrSearch('');

    setOpenGyv(false);
    setOpenGat(false);
    setOpenAdr(false);
  };

  // ----------------- GAT (gatvė) -----------------

  const { data: gatList = [], isLoading: gatLoading } = useQuery({
    queryKey: ['addrFindGat', current.gyvId, gatSearch],
    enabled: !!current.gyvId,
    queryFn: () => api.searchGat(current.gyvId!, gatSearch.trim()),
    retry: false,
  });

  const gatOptions = gatList.map(formatAltLabel);

  const handleGatSelect = (item: AddressSearchItem) => {
    const label = formatAltLabel(item);

    onChange({
      ...current,
      gatId: item.id,
      gatName: label,
      adrId: null,
      adrName: undefined,
    });

    setGatSearch(label);
    setAdrSearch('');
    setOpenGat(false);
    setOpenAdr(false);
  };

  // ----------------- ADR (pilnas adresas) -----------------
  const { data: adrList = [], isLoading: adrLoading } = useQuery({
    queryKey: ['addrFindAdr', current.gyvId, current.gatId, adrSearch],
    enabled: !!current.gyvId,
    queryFn: () => api.findAdr(current.gyvId!, adrSearch.trim(), current.gatId || undefined),
    retry: false,
  });

  const adrOptions = adrList.map(formatAltLabel);

  const handleAdrSelect = (item: AddressSearchItem) => {
    const label = formatAltLabel(item);

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
        setOpenGat(false);
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
          {/* Gyvenvietė */}
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
                    if (!t.trim()) {
                      onChange({
                        gyvId: null,
                        gyvName: undefined,
                        gatId: null,
                        gatName: undefined,
                        adrId: null,
                        adrName: undefined,
                      });
                      setGatSearch('');
                      setAdrSearch('');
                    }
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

          {/* Gatvė */}
          <Column>
            <SubLabel>Gatvė (neprivalomas laukas)</SubLabel>
            <SelectWrapper>
              <InputClickArea
                onClick={() => {
                  if (!disabled && current.gyvId) setOpenGat(true);
                }}
              >
                <TextFieldInput
                  value={gatSearch}
                  onChange={(t) => {
                    setGatSearch(t);
                    setOpenGat(true);

                    if (!t.trim()) {
                      onChange({
                        ...current,
                        gatId: null,
                        gatName: undefined,
                        adrId: null,
                        adrName: undefined,
                      });
                      setAdrSearch('');
                    }
                  }}
                  placeholder="Įrašykite gatvės pavadinimą"
                  error={undefined}
                  leftIcon={undefined}
                  rightIcon={<StyledIcon name={IconName.dropdownArrow} />}
                  disabled={disabled || !current.gyvId}
                />
              </InputClickArea>

              <OptionsContainer
                loading={gatLoading}
                values={openGat ? gatOptions : []}
                getOptionLabel={(label: string) => label}
                showSelect={openGat && (!!gatOptions.length || !!current.gyvId)}
                handleClick={(label: string) => {
                  const item = gatList.find((i) => formatAltLabel(i) === label);
                  if (item) handleGatSelect(item);
                }}
                isAddress
              />
            </SelectWrapper>
          </Column>

          {/* Adresas */}
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
                  placeholder="Įrašykite adresą (namo nr.)"
                  error={undefined}
                  leftIcon={undefined}
                  rightIcon={<StyledIcon name={IconName.dropdownArrow} />}
                  disabled={disabled || !current.gyvId}
                />
              </InputClickArea>

              <OptionsContainer
                loading={adrLoading}
                values={openAdr ? adrOptions : []}
                getOptionLabel={(label: string) => label}
                showSelect={openAdr && (!!adrOptions.length || !!current.gyvId)}
                handleClick={(label: string) => {
                  const item = adrList.find((i) => formatAltLabel(i) === label);
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
  font-size: 1.4rem;
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
