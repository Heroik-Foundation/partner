import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import Payment from "./Payment";
import event from "./assets/event.png";

export default function DonationPage() {
  const [displayModal, setModal] = useState(false);
  const donationOptions = [5, 10, 20, 25, 50, 100];
  const [selectedDonation, setSelectedDonation] = useState(null);

  const handleChange = (event) => {
    setSelectedDonation(parseInt(event.target.value));
    localStorage.setItem(
      "values",
      JSON.stringify(parseInt(event.target.value))
    );
  };

  const formSchema = yup.object({
    name: yup.string().required("Your name is required"),
    email: yup
      .string()
      .email("This email is not valid")
      .required("Your email is required"),
    phone: yup.string().required("Your phone is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", phone: "" },
    validationSchema: formSchema,
    onSubmit: () => {},
  });

  useEffect(() => {
    const openModal = document.getElementById("modal-btn");
    const closeModal = document.getElementById("modal-close");
    const modal = document.getElementById("modal");

    const closeModalTwo = document.getElementById("modal-close2");
    const modalTwo = document.getElementById("modal2");

    const presets = document.getElementById("donation-presets");
    const input = document.getElementById("donation-input");

    openModal?.addEventListener("click", () => {
      modal?.classList.remove("hidden");
      modal?.classList.add("flex");
    });

    closeModal?.addEventListener("click", () => {
      modal?.classList.add("hidden");
      modal?.classList.remove("flex");
    });

    closeModalTwo?.addEventListener("click", () => {
      modalTwo?.classList.add("hidden");
      modalTwo?.classList.remove("flex");
    });

    presets?.addEventListener("click", (event) => {
      const target = event.target;

      if (target.tagName === "BUTTON" && target.dataset.amount) {
        const amount = target.dataset.amount;

        input.value = amount;
      }
    });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center max-w-2xl px-5 mx-auto py-5">
      <h1 className="text-purple-700 text-4xl font-bold">Thank You !</h1>

      <p className="text-center text-base font-medium py-3 text-purple-700">
        For showing Interest in this event <br />{" "}
        <span className="text-xl font-semibold text-purple-700">
          Hiroz Active FC Charity Football
        </span>{" "}
      </p>

      <img src={event} />

      <p className="text-center py-5 font-medium text-purple-700">
        Secure your spot now by making a meaningful donation and join us in
        creating change together &#40;available spots 30&#41;
      </p>

      <div className="w-full flex space-y-3 sm:space-y-0 flex-col sm:flex-row-reverse items-center justify-center">
        <div
          class="px-10 py-3 rounded-lg w-full bg-purple-700 font-medium text-sm text-white appearance-none text-center cursor-pointer"
          id="modal-btn"
        >
          Make Donations
        </div>
      </div>

      <div
        id="modal"
        aria-hidden="true"
        class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden items-center justify-center overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md"
      >
        <div class="relative w-full max-w-md max-h-full bottom-0">
          <div class="relative bg-white rounded-lg shadow">
            <button
              id="modal-close"
              class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
            <div class="px-6 py-6 lg:px-8 space-y-5">
              <h3 class="text-lg font-medium">Make a donation</h3>
              <div className="w-full relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  class="outline-none font-medium border border-purple-600 rounded w-full p-2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={() => formik.setFieldTouched("name", true, true)}
                />
                {formik.touched.name && formik.errors.name && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-xs font-Inter-SemiBold text-[#F25341]"
                    style={{ marginTop: "2px" }}
                  >
                    {formik.errors.name}
                  </motion.div>
                )}
              </div>
              <div className="w-full relative">
                <input
                  type="text"
                  name="email"
                  placeholder="Enter your email"
                  class="outline-none font-medium border border-purple-600 rounded w-full p-2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={() => formik.setFieldTouched("email", true, true)}
                />
                {formik.touched.email && formik.errors.email && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-xs font-Inter-SemiBold text-[#F25341]"
                    style={{ marginTop: "2px" }}
                  >
                    {formik.errors.email}
                  </motion.div>
                )}
              </div>
              <div className="w-full relative">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  class="outline-none font-medium border border-purple-600 rounded w-full p-2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  onFocus={() => formik.setFieldTouched("phone", true, true)}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-xs font-Inter-SemiBold text-[#F25341]"
                    style={{ marginTop: "2px" }}
                  >
                    {formik.errors.phone}
                  </motion.div>
                )}
              </div>

              <select
                className="font-medium border border-purple-500 border-1 text-sm bg-white outline-none p-2 w-full rounded"
                value={selectedDonation}
                onChange={handleChange}
              >
                <option value={null}>Select a donation amount</option>
                {donationOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className={
                      selectedDonation === option ? "bg-neutral-200" : ""
                    }
                  >
                    £{option}
                  </option>
                ))}
              </select>

              <button
                class="px-10 py-3 rounded-lg w-full cursor-pointer bg-purple-700 font-medium text-sm text-white text-center"
                onClick={() => {
                  const modal = document.getElementById("modal");
                  const modalTwo = document.getElementById("modal2");

                  if (!formik.dirty) {
                    return;
                  } else if (!formik.isValid) {
                    return;
                  }

                  setModal(true);

                  modal?.classList.add("hidden");
                  modal?.classList.remove("flex");

                  modalTwo.classList.remove("hidden");
                  modalTwo.classList.add("flex");
                }}
              >
                DONATE
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        id="modal2"
        aria-hidden="true"
        class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden items-center justify-center overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md bottom-0"
      >
        <div class="relative w-full max-w-md max-h-full">
          <div class="relative bg-white rounded-lg shadow">
            <button
              id="modal-close2"
              class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
            <div class="px-6 py-6 lg:px-8 space-y-5">
              <h3 class="text-lg font-medium">Donation Preview</h3>
              {displayModal ? (
                <Payment
                  payload={{
                    name: formik.values.name,
                    email: formik.values.email,
                    phone: formik.values.phone,
                    amount: selectedDonation ? selectedDonation : "10",
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
