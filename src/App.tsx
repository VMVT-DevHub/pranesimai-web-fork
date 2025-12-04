import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import FullscreenLoader from './components/other/FullscreenLoader';
import { routes, slugs } from './utils';
import { api } from './utils/api';

function App() {
  const {
    data: session,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['currentSession'],
    queryFn: () => api.getCurrentSession(),
    retry: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!isSuccess) return;

    navigate({ pathname: slugs.survey, search: `pageId=${session.lastResponse}` });
  }, [isSuccess]);

  if (isLoading) return <FullscreenLoader />;

  return (
    <Routes>
      <Route>
        {routes.map((route, index) => (
          <Route key={`route-${index}`} path={route.slug} element={route.component} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to={slugs.surveys} />} />
    </Routes>
  );
}

export default App;
