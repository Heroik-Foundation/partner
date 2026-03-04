import { AxiosError } from "axios";
import { toast } from "sonner";

export type ErrorResponse = AxiosError<{
  error: {
    details: {
      message: string;
    };
  };
}>;

export function handleUserResponseToError(error: ErrorResponse) {
  const message = error.response?.data?.error.details.message;

  if (message) {
    toast.error(message);
  } else {
    toast.error("An error occured, please try again");
  }
}
