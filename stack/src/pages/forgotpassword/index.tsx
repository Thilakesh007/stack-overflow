import { useState } from "react";
import axiosInstance from "@/lib/axiosinstance";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post(
        "/user/forgotpassword",
        {
          identifier,
        }
      );

      toast.success(res.data.message);

      if (res.data.password) {
        alert(
          "Your new password is: " +
            res.data.password
        );
      }

    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6">
        Forgot Password
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Enter Email or Phone"
          value={identifier}
          onChange={(e) =>
            setIdentifier(e.target.value)
          }
          className="border p-2 w-full rounded text-white"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Generate New Password
        </button>
      </form>
    </div>
  );
}