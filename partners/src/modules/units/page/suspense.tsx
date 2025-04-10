export const SuspenseLoader = () => {
  return (
    <div
      style={{
        margin: "0px",
      }}
      className="fixed inset-0 top-0 bottom-0 left-0 right-0 w-full h-screen flex justify-center items-center bg-black/10 z-[9999]"
    >
      <div className="bg-gray-50 p-5 rounded-xl border">
        <img src="/loader/loading.gif" alt="" className="w-10 h-10" />
      </div>
    </div>
  );
};

export const Fallback = () => {
  return (
    <div
      style={{
        margin: "0px",
      }}
      className="fixed inset-0 top-0 bottom-0 left-0 right-0 w-full h-screen flex justify-center items-center bg-black/10 z-[9999]"
    >
      <div className="bg-gray-50 p-5 rounded-xl border">
        <img src="/loader/loading.gif" alt="" className="w-10 h-10" />
      </div>
    </div>
  );
};
