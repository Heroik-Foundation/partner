import { createLazyFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IOSGrey from "@/assets/platform/ios-grey.svg";
import androidGrey from "@/assets/platform/android-grey.svg";
import { Check, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSetAppMutation } from "@/hooks/mutation/platform";
import { useAppVersion } from "@/hooks/fetch/platform";

export const Route = createLazyFileRoute("/dashboard/update-logs/create/")({
  component: Page,
});

export interface CreateLogForm {
  platform: "ios" | "android" | any;
  version: string;
  logs: string[];
}

function Page() {
  const [form, setForm] = useState<CreateLogForm>({
    platform: "ios",
    version: "",
    logs: [],
  });

  const { data } = useAppVersion({
    platform: form.platform,
  });

  const [logCount, setLogCount] = useState<number>(1);

  const { mutate, isPending, isSuccess } = useSetAppMutation({
    payload: { ...form, currentVersion: data ? data[0]?.currentVersion : "" },
  });

  useEffect(() => {
    if (isSuccess) {
      const defaultLog: string[] = [];
      setForm({
        platform: form.platform,
        logs: defaultLog,
        version: "",
      });
    }

    return () => {};
  }, [isSuccess]);

  const textColor = "text-black/70 text-sm";

  return (
    <div className="space-y-10 pt-10">
      <h1 className="font-cairo font-bold text-xl">Create new log</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
        className="p-5 rounded-xl bg-white border space-y-5"
      >
        <div className="space-y-1">
          <span className={cn(textColor)}>Platform</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 py-2 rounded-lg border flex items-center text-sm font-medium space-x-2 w-full">
                <img
                  src={form.platform === "ios" ? IOSGrey : androidGrey}
                  alt=""
                />
                <span>{form.platform === "ios" ? "IOS" : "Android"}</span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[170px]">
              {["IOS", "Android"].map((option, index) => (
                <DropdownMenuItem
                  className={cn(
                    "text-sm font-medium flex items-center justify-between cursor-pointer",
                    option.toLowerCase() === form.platform && "bg-neutral-100"
                  )}
                  key={index}
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      platform: option.toLowerCase(),
                    }));
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={
                        option.toLowerCase() === "ios" ? IOSGrey : androidGrey
                      }
                      alt=""
                    />
                    <span>{option}</span>
                  </div>

                  {option.toLowerCase() === form.platform && (
                    <Check size={10} className="stroke-blue-500" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1">
          <span className={cn(textColor)}>Version name</span>

          <Input
            required
            value={form.version}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                version: e.target.value,
              }));
            }}
          />
        </div>

        <div className="space-y-1">
          <span className={cn(textColor)}>Logs</span>

          <div className="space-y-2 w-full">
            {Array.from({ length: logCount }).map((_, index) => (
              <Input
                required
                value={form.logs[index]}
                onChange={(e) => {
                  const updatedLog = [...form.logs];
                  updatedLog[index] = e.target.value;

                  setForm((prev) => ({
                    ...prev,
                    logs: updatedLog,
                  }));
                }}
              />
            ))}

            <Button
              type="button"
              variant={"outline"}
              className="mx-auto inline-flex items-center space-x-2"
              onClick={() => {
                setLogCount((prev) => prev + 1);
              }}
            >
              <PlusCircle size={15} />
              <span>Add new input</span>
            </Button>
          </div>
        </div>

        <Button isLoading={isPending} className="w-full" type="submit">
          Submit log
        </Button>
      </form>
    </div>
  );
}
