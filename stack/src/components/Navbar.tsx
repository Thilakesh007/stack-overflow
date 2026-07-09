import { useAuth } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// const User = {
//   _id: "1",
//   name: "Alice Johnson",
// };

const Navbar = ({ handleslidein }: any) => {
  const { user, Logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  const handlelogout = () => {
    Logout();
  };
  const handleLanguageChange = async (lang: string) => {
    try {
  
      const res = await axiosInstance.post("/language/send-otp", {
        userId: user?._id,
        language: lang,
      });
  
      const otp = prompt("Enter the OTP:");

      if (!otp) return;

      const verify = await axiosInstance.post("/language/verify-otp", {
        userId: user?._id,
        otp,
      });
      console.log(verify.data);

      alert(verify.data.message);

      i18n.changeLanguage(verify.data.language);
      console.log("Current language:", i18n.language);
  
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=" top-0 z-50 w-full min-h-[53px] bg-white border-t-[3px] border-[#ef8236] shadow-[0_1px_5px_#00000033] flex items-center justify-center">
      <div className="w-[90%] max-w-[1440px] flex items-center justify-between mx-auto py-1">
        <button
          aria-label="Toggle sidebar"
          className="sm:block md:hidden p-2 rounded hover:bg-gray-100 transition"
          onClick={handleslidein}
        >
          <Menu className="w-5 h-5 text-gray-800" />
        </button>
        <div className="flex items-center gap-2 flex-grow">
          <Link href="/" className="px-3 py-1">
            <img src="/logo.png" alt="Logo" className="h-6 w-auto" />
          </Link>

          <div className="hidden sm:flex gap-1">
          {[
            t("about"),
            t("products"),
            t("teams"),
          ].map((item) => (
              <Link
                key={item}
                href="/"
                className="text-sm text-[#454545] font-medium px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                {item}
              </Link>
            ))}
            <Link
              href="/social"
              className="text-sm text-[#454545] font-medium px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              {t("social")}
            </Link>
            <Link 
              href="/subscription"
              className="text-sm text-[#454545] font-medium px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              {t("subscription")}
            </Link>
          </div>
          <form className="hidden lg:block flex-grow relative px-3">
            <input
              type="text"
              placeholder="Search..."
              className="w-full max-w-[600px] pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <Search className="absolute left-4 top-2.5 h-4 w-4 text-gray-600" />
          </form>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="bg-white text-black border border-gray-400 rounded-md px-2 py-1 text-sm focus:outline-none"
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="pt">Portuguese</option>
            <option value="zh">Chinese</option>
            <option value="fr">French</option>
          </select>
          {!hasMounted ? null : !user ? (
            <Link
              href="/auth"
              className="text-sm font-medium text-[#454545] bg-[#e7f8fe] hover:bg-[#d3e4eb] border border-blue-500 px-4 py-1.5 rounded transition"
            >
              {t("login")}
            </Link>
          ) : (
            <>
              <Link
                href={`/users/${user._id}`}
                className="flex items-center justify-center bg-orange-600 text-white text-sm font-semibold w-9 h-9 rounded-full"
              >
                {user.name?.charAt(0).toUpperCase()}
              </Link>
              <button
                onClick={handlelogout}
                className="text-sm font-medium text-[#454545] bg-[#e7f8fe] hover:bg-[#d3e4eb] border border-blue-500 px-4 py-1.5 rounded transition"
              >
                {t("logout")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
