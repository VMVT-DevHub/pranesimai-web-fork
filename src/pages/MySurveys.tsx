import { useNavigate } from 'react-router-dom';
import Default from '../layouts/Default';
import { api, descriptions, formatDate } from '../utils';
import { useUser } from '../utils/hooks';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import Table from '../components/fields/components/Table';
import { device } from '../styles';
import StatusTag from '../components/fields/StatusTag';

const labels = {
  id: 'Prašymo Nr.',
  name: 'Tipas',
  submittedAt: 'Pateikta',
  auth: 'Anoniminis',
  status: 'Statusas',
};

const status = {
  SUBMITTED: 'Pateiktas',
  REJECTED: 'Atmestas',
  APPROVED: 'Patvirtintas',
  FINISHED: 'Pabaigtas',
  PHYSICALCHECK: 'Fizinis tikrinimas',
  ADMINCHECK: 'Administracinis tikrinimas',
  WATCHCHECK: 'Vykdoma stebėsena',
  NONACTIVE: 'Neaktualus',
};

export const MySurveys = () => {
  const navigate = useNavigate();
  const { user, isLoading, isLoggedIn } = useUser();

  const useAllReports = () => {
    return useQuery({
      queryKey: ['reports'],
      queryFn: () => api.getAllReports(),
      staleTime: 5 * 60 * 1000,
    });
  };

  const { data } = useAllReports();
  if (!user) navigate('/');

  const mappedData =
    data &&
    data?.items?.map((item) => {
      return {
        ...item,
        id: item.id,
        name: item?.survey?.title,
        submittedAt: formatDate(item?.createdAt),
        status: <StatusTag label={status[item?.status]} />,
        auth: item?.auth ? 'Ne' : 'Taip',
      };
    });

  return (
    <Default
      title="Mano Pranešimai"
      description="Čia galite rasti savo pateiktus pranešimus bei jų vykdymo statusą"
    >
      <StyledTable onClick={() => {}} tableData={mappedData} labels={labels}></StyledTable>
    </Default>
  );
};

const StyledTable = styled(Table)`
  max-width: 100%;
  width: 800px;
  th {
    min-width: auto !important;
  }
  td:last-child {
    width: auto !important;
  }

  @media ${device.mobileL} {
    width: 100%;
  }
  @media ${device.mobileM} {
    width: 100%;
  }
`;

const Survey = styled.div``;
