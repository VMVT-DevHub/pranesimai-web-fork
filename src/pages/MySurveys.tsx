import { useNavigate, useSearchParams } from 'react-router-dom';
import Default from '../layouts/Default';
import { api, descriptions, formatDate } from '../utils';
import { useUser } from '../utils/hooks';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import Table from '../components/fields/components/Table';
import { device } from '../styles';
import StatusTag from '../components/fields/StatusTag';

const labels = {
  id: 'Prašymo nr.',
  submittedAt: 'Pateikimo data',
  name: 'Tipas',
  status: 'Statusas',
};

const status = {
  SUBMITTED: 'Pateiktas',
  DRAFT: 'Juodraštis',
  REJECTED: 'Atmestas',
  APPROVED: 'Patvirtintas',
  FINISHED: 'Pabaigtas',
  PHYSICALCHECK: 'Fizinis tikrinimas',
  ADMINCHECK: 'Administracinis tikrinimas',
  WATCHCHECK: 'Vykdoma stebėsena',
  NONACTIVE: 'Neaktualus',
};

const statusColors = {
  SUBMITTED: 'yellow',
  DRAFT: 'grey',
  REJECTED: 'red',
  APPROVED: 'green',
  FINISHED: 'dark green',
  PHYSICALCHECK: 'dark blue',
  ADMINCHECK: 'dark blue',
  WATCHCHECK: 'dark blue',
  NONACTIVE: 'grey',
};
export const MySurveys = () => {
  const navigate = useNavigate();
  const { user, isLoading, isLoggedIn } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const useAllReports = () => {
    return useQuery({
      queryKey: ['reports'],
      queryFn: () => api.getAllReports(),
      staleTime: 5 * 60 * 1000,
    });
  };

  const handleDetailedReport = (id: string) => {
    navigate(`/mano/${id}`);
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
        status: <StatusTag label={status[item?.status]} color={statusColors[item?.status]} />,
      };
    });

  return (
    <Default
      title="Mano Pranešimai"
      description="Čia galite rasti savo pateiktus pranešimus bei jų vykdymo statusą"
    >
      <StyledTable
        loading={isLoading}
        onClick={(item: any) => {
          handleDetailedReport(item.id);
        }}
        tableData={mappedData}
        labels={labels}
      ></StyledTable>
    </Default>
  );
};

const StyledTable = styled(Table)`
  max-width: 100%;
  width: 800px;
  th {
    min-width: auto !important;
    background-color: rgb(245, 246, 254);
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
