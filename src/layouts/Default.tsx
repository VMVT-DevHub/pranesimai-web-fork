import styled from 'styled-components';
import BackButton from '../components/buttons/BackButton';
import { device } from '../styles';
import { Header } from '../components/Header';

const Default = ({
  children,
  title,
  description,
  maxWidth = 900,
  topComponent,
  backUrl,
}: {
  title: string;
  backUrl?: string;
  description: string;
  children?: any;
  maxWidth?: number;
  topComponent?: JSX.Element;
}) => {
  return (
    <>
      <Header />
      <MainContainer>
        <Container maxWidth={maxWidth}>
          <BackButton backUrl={backUrl} />
          <InnerContainer>
            {topComponent}
            <Title>{title}</Title>
            <SubTitle>{description}</SubTitle>
            {children}
          </InnerContainer>
        </Container>
      </MainContainer>
    </>
  );
};
export default Default;

const SubTitle = styled.div`
  color: ${({ theme }) => theme.colors.title};
  margin-bottom: 32px;
  text-align: center;
`;
const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 12px;
  margin: 12px;
  position: fixed;
`;

const Container = styled.div<{ maxWidth: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  width: ${({ maxWidth }) => `${maxWidth}px`};
  margin: auto;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;

  padding: 56px;
  @media ${device.mobileM} {
    padding: 56px 12px;
  }
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.title};
  font-size: 3.2rem;
  font-weight: 700;
  margin-bottom: 4px;
  text-align: center;
`;
