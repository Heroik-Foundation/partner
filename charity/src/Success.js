import successImg from "./assets/badge-success.png";
import { Link } from "react-router-dom";

export default function Page() {
  const valuesJSON = localStorage.getItem("values");
  const values = JSON.parse(valuesJSON);

  return (
    <div className="h-[100vh] w-full flex justify-center items-center flex-col space-y-5 px-5">
      <h1 className="text-3xl font-bold">Donation Successful</h1>
      <img src={successImg} alt="Success image" className="w-48 h-48" />
      <p className="text-center font-medium">
        You have successfully donated £{values} to <br /> Khaya Foundation and
        secured your spot in this event
      </p>
      <Link
        to="/"
        className="px-10 py-3 bg-purple-700 text-sm font-medium text-white rounded-full"
      >
        Back
      </Link>
    </div>
  );
}
