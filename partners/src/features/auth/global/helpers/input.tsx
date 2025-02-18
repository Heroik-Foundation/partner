import { AuthForm } from "@/stores/auth";
import { ChangeEvent } from "react";

export function handleInputChangeEvent(
  event: ChangeEvent<HTMLInputElement>,
  state: AuthForm,
  setState: (form: AuthForm) => void
) {
  setState({
    ...state,
    [event.target.name]: (event.target as HTMLInputElement).value,
  });
}
