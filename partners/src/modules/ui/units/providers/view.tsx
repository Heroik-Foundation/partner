export const ViewProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="max-w-lg mx-auto p-5 overflow-y-hidden overflow-x-hidden ">
      {children}
    </main>
  );
};
