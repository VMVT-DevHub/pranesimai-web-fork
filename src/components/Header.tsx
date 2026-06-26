import styled from 'styled-components';
import Icon from './other/Icons';
import { api, IconName } from '../utils';
import { useUser } from '../utils/hooks';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from './buttons/Button';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, isLoading, isLoggedIn } = useUser();
  const navigate = useNavigate();
  const [showSelect, setShowSelect] = useState(false);

  const queryClient = useQueryClient();

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSelect(false);
    }
  };

  const logoutMutation = useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries();
      window.location.reload();
    },
    onError: (error) => {
      console.error('Logout failed', error);
    },
  });

  const loginMutation = useMutation({
    mutationFn: () => api.login(),
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  return (
    <HeaderContainer>
      <Container tabIndex={1} onBlur={handleBlur}>
        <Select onClick={() => setShowSelect(!showSelect)}>
          <SelectContainer>
            <Name>{`${user?.firstName || ''} ${user?.lastName || ''}`}</Name>
          </SelectContainer>
          <DropdownIcon name={IconName.userLogo} />

          <DropdownIcon name={IconName.dropdownArrow} />
        </Select>
        {user && showSelect && (
          <DropDownContainer>
            <BottomRow
              onClick={() => {
                navigate('/');
              }}
            >
              <StyledLogoutIcon name={'edit'} />
              <Name>Pildyti pranešimą</Name>
            </BottomRow>
            <BottomRow
              onClick={() => {
                navigate('/mano');
              }}
            >
              <StyledLogoutIcon name={'mail'} />
              <Name>Mano pranešimai</Name>
            </BottomRow>
            <BottomRow onClick={() => logoutMutation.mutate()}>
              <StyledLogoutIcon name={'logout'} />
              <Name>Atsijungti</Name>
            </BottomRow>
          </DropDownContainer>
        )}
        {!user && showSelect && (
          <form action="/api/auth/start" method="POST">
            <StyledButton type="submit">
              <DropDownContainer>
                <BottomRow
                  onClick={() => {
                    navigate('/');
                  }}
                >
                  <StyledLogoutIcon name={'edit'} />
                  <Name>Pildyti pranešimą</Name>
                </BottomRow>
                <BottomRow>
                  <StyledLogoutIcon name={'login'} />
                  <Name>Prisijungti</Name>
                </BottomRow>
              </DropDownContainer>
            </StyledButton>
          </form>
        )}
      </Container>
    </HeaderContainer>
  );
};

const StyledButton = styled.button`
  all: unset;
  display: block;
  width: 100%;
  cursor: pointer;
`;
const StyledLogoutIcon = styled(Icon)`
  font-size: 2rem;
  color: #2671d9;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #121926;
  gap: 14.5px;
  &:hover {
    background-color: #2671d93e;
  }
  padding: 8px;
  border-radius: 4px;
`;

const Container = styled.div`
  max-width: fit-content;
  position: relative;
  min-width: 200px;
  &:focus {
    outline: none;
  }
`;

const DropdownIcon = styled(Icon)`
  cursor: pointer;
  font-size: 1.6rem;
`;

const Select = styled.div`
  cursor: pointer;
  min-width: 100%;
  height: 31px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: end;
  margin-right: 10px;
`;

const Name = styled.div`
  font-size: 1.4rem;
  line-height: 17px;
`;

const Email = styled.div`
  font-size: 1.2rem;
  color: #4b5565;
`;

const DropDownContainer = styled.div`
  z-index: 3;
  position: absolute;
  right: 0;
  padding: 16px 8px;
  top: 40px;
  background-color: white;
  box-shadow: 0px 4px 15px #12192614;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  width: 262px;
`;
const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  padding: 8px;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
