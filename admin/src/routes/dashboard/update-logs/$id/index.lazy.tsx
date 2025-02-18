import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import IOSGrey from "@/assets/platform/ios-grey.svg";
import androidGrey from "@/assets/platform/android-grey.svg";
import { useAppVersionDetails } from "@/hooks/fetch/platform";
import { cn } from "@/lib/utils";
import { formatDate } from "@/helpers/date-time";

export const Route = createLazyFileRoute("/dashboard/update-logs/$id/")({
  component: Page,
});

function Page() {
  const { id } = useParams({
    strict: false,
  });

  const { data } = useAppVersionDetails({
    id: String(id),
  });

  const textColor = "text-black/70 text-sm";

  return (
    <div className="space-y-10 pt-10">
      <h1 className="font-cairo font-bold text-xl">Log Details</h1>

      <div className="p-5 rounded-xl bg-white border space-y-5">
        <h1 className="font-cairo text-sm font-bold">View log</h1>

        <div className="space-y-5">
          <div className="space-y-1">
            <span className={cn(textColor)}>Platform</span>

            <div className="w-full p-2 rounded-lg border flex items-center space-x-3">
              <img
                src={data?.platform === "ios" ? IOSGrey : androidGrey}
                className={cn(data?.platform === "ios" && "mb-0.5")}
              />
              <span className={cn(textColor)}>
                {data?.platform === "ios" ? "IOS" : "Android"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className={cn(textColor)}>Version</span>

            <div className="w-full p-2 rounded-lg border flex items-center space-x-3">
              <span className={cn(textColor)}>
                Version {data?.currentVersion || ""}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className={cn(textColor)}>Date/time</span>

            <div className="w-full p-2 rounded-lg border flex items-center space-x-3">
              <span className={cn(textColor)}>
                {formatDate(String(data?.createdAt)) || ""}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className={cn(textColor)}>Logs</span>

            {data?.features.map((feature, index) => (
              <div
                className="w-full p-2 rounded-lg border flex items-center space-x-3"
                key={index}
              >
                <span className={cn(textColor)}>
                  {index + 1}. {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
