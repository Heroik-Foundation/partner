type Children = {
  children: React.ReactNode;
};

export const ViewProvider = ({ children }: Children) => {
  return <main className="max-w-lg p-4 relative mx-auto">{children}</main>;
};
