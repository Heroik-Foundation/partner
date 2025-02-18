import { Search } from "lucide-react";

export function PageTitle({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) {
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <h1 className="font-cairo font-bold text-2xl">{title}</h1>
        <p className="text-sm font-cairo text-[#333333]">{subTitle}</p>
      </div>
      <div className="hidden sm:flex items-center px-4 py-3 space-x-2 bg-white rounded-full sm:w-[300px]">
        <Search strokeWidth={1} size={16} />
        <input
          type="text"
          placeholder="Search"
          className="font-cairo placeholder:text-black appearance-none outline-none border-none w-full"
        />
      </div>
    </div>
  );
}
