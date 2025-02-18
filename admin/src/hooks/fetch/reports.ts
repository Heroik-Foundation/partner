import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface Statistics {
  charities: number;
  users: number;
  donations: number;
  totalDonations: number;
  events: number;
  communities: number;
  posts: number;
}

interface FinancialReports {
  revenue: number;
  tax: number;
  totalDonationToCharity: number;
}

export function useReports() {
  return useQuery({
    queryKey: ["analytics-reports"],
    queryFn: async () => {
      const {
        data,
      }: {
        data: Statistics;
      } = await api("/report", {
        authenticated: true,
        admin: true,
        method: "GET",
      });

      const {
        data: financial_reports,
      }: {
        data: {
          report: FinancialReports;
        };
      } = await api("/financial-report", {
        authenticated: true,
        admin: true,
        method: "GET",
      });

      return {
        charities: data.charities,
        users: data.users,
        events: data.events,
        communities: data.communities,
        posts: data.posts,
        totalDonations:
          Number(financial_reports.report.totalDonationToCharity) / 100,
        revenue: Number(financial_reports.report.revenue) / 100,
        tax: Number(financial_reports.report.tax) / 100,
      };
    },
  });
}
