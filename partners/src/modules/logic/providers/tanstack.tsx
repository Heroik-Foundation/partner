import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Children = {
  children: React.ReactNode;
};

export const QueryProvider = ({ children }: Children) => {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
