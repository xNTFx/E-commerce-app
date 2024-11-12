import { QueryClient, QueryClientProvider } from 'react-query';

import { NotificationProvider } from '../context/NotificationContext';
import { UserProvider } from '../context/UserContext';

const queryClient = new QueryClient();

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
