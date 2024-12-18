import axios from "axios";
import { startTransition, useState } from "react";
import toast from "react-hot-toast";
import { CiUser } from "react-icons/ci";
import { GoGraph } from "react-icons/go";
import {
  IoBagHandleOutline,
  IoChatboxEllipsesOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { MdLeaderboard } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";
import { RiDashboardFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Dialog from "@dialog";

const Sidebar = () => {
  const navigate = useNavigate();

  const [logoutDialog, setLogoutDialog] = useState<boolean>(false);

  const handleNavigation = (path: string) => {
    startTransition(() => {
      navigate(path);
    });
  };

  const token = Cookies.get("token");

  const handleSignOut = async () => {
    const pendingToast = toast.loading("Logging out...");
    try {
      const response = await axios.get("/api/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status) {
        toast.dismiss(pendingToast);
        setLogoutDialog(false);
        toast.success("Logged out!");
        Cookies.remove("token");
        handleNavigation("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errroMessage = error.response?.data.message;
        toast.dismiss(pendingToast);
        toast.error(errroMessage);
      }
    }
  };

  return (
    <div
      className="font-poppins  w-60 text-lg flex flex-col justify-center items-center gap-1"
      style={{
        height: "calc(100vh - 100px)",
      }}
    >
      <div
        onClick={() => handleNavigation("/")}
        className={`
        ${
          location.pathname === "/"
            ? "bg-primary text-[#fff] "
            : "bg-[#111111] text-secondary"
        }
        p-4 w-60 rounded-xl flex items-center justify-center gap-1 active:bg-[#dd353d] cursor-pointer
        `}
      >
        <div className="flex justify-start items-center w-1/4  ">
          <RiDashboardFill className="text-3xl" />
        </div>
        <div className="flex justify-start items-center w-3/4  ">
          <p>Dashboard</p>
        </div>
      </div>
      <div
        onClick={() => handleNavigation("/leaderboard")}
        className={`
        ${
          location.pathname === "/leaderboard"
            ? "bg-primary text-[#fff] "
            : "bg-[#111111] text-secondary hover:bg-[#292929] transition-all duration-150 active:bg-[#464646]"
        }
        p-4 w-60 rounded-xl flex items-center gap-1 justify-center cursor-pointer
        `}
      >
        <div className="flex justify-start items-center w-1/4  ">
          <MdLeaderboard className="text-3xl" />
        </div>
        <div className="flex justify-start items-center w-3/4  ">
          <p>Leaderboard</p>
        </div>
      </div>
      <div
        onClick={() => handleNavigation("/content")}
        className={`
        ${
          location.pathname === "/content"
            ? "bg-primary text-[#fff] "
            : "bg-[#111111] text-secondary hover:bg-[#292929] transition-all duration-150 active:bg-[#464646]"
        }
        p-4 w-60 rounded-xl flex items-center gap-1 justify-center cursor-pointer
        `}
      >
        <div className="flex justify-start items-center w-1/4 ">
          <CiUser className="text-3xl" />
        </div>
        <div className="flex justify-start items-center w-3/4 ">
          <p>Content</p>
        </div>
      </div>
      <div
        onClick={() => handleNavigation("/courses")}
        className={`
        ${
          location.pathname === "/courses"
            ? "bg-primary text-[#fff] "
            : "bg-[#111111] text-secondary hover:bg-[#292929] transition-all duration-150 active:bg-[#464646]"
        }
        p-4 w-60 rounded-xl flex items-center gap-1 justify-center cursor-pointer
        `}
      >
        <div className="flex justify-start items-center w-1/4 ">
          <IoBagHandleOutline className="text-3xl" />
        </div>
        <div className="flex justify-start items-center w-3/4 ">
          <p>Courses</p>
        </div>
      </div>
      <div
        onClick={() => handleNavigation("/verify-report")}
        className={`
        ${
          location.pathname === "/verify-report"
            ? "bg-primary text-[#fff] "
            : "bg-[#111111] text-secondary hover:bg-[#292929] transition-all duration-150 active:bg-[#464646]"
        }
        p-4 w-60 rounded-xl flex items-center gap-1 justify-center cursor-pointer
        `}
      >
        <div className="flex justify-start items-center w-1/4 ">
          <GoGraph className="text-3xl" />
        </div>
        <div className="flex justify-start items-center w-3/4 ">
          <p>Verify Report</p>
        </div>
      </div>
      <div
        onClick={() => handleNavigation("/mails/Inbox")}
        className={`
        ${
          location.pathname === "/mails/Inbox"
            ? "bg-primary text-[#fff]"
            : "bg-[#111111] text-secondary hover:bg-[#292929] transition-all duration-150 active:bg-[#464646]"
        }
        p-4 w-60 rounded-xl flex items-center gap-1 justify-center cursor-pointer
        `}
      >
        <div className="flex justify-start items-center w-1/4 ">
          <IoChatboxEllipsesOutline className="text-3xl" />
        </div>
        <div className="flex justify-start items-center w-3/4 ">
          <p>Messages</p>
        </div>
      </div>
      <div
        onClick={() => handleNavigation("/settings")}
        className={`
        ${
          location.pathname === "/settings"
            ? "bg-primary text-[#fff] "
            : "bg-[#111111] text-secondary hover:bg-[#292929] transition-all duration-150 active:bg-[#464646]"
        }
        p-4 w-60 rounded-xl flex items-center gap-1 justify-center cursor-pointer
        `}
      >
        <div className="flex justify-start items-center w-1/4 ">
          <IoSettingsOutline className="text-3xl" />
        </div>
        <div className="flex justify-start items-center w-3/4 ">
          <p>Settings</p>
        </div>
      </div>
      <div
        className={`
        ${
          location.pathname === "/sign-out"
            ? "bg-primary text-[#fff] "
            : "bg-[#111111] text-secondary hover:bg-[#292929] transition-all duration-150 active:bg-[#464646]"
        }
        p-4 w-60 rounded-xl flex gap-1 items-center justify-center cursor-pointer
        `}
      >
        <div className="flex justify-start items-center w-1/4 ">
          <PiSignOutBold className="text-3xl" />
        </div>
        <div
          onClick={() => setLogoutDialog(true)}
          className="flex justify-start items-center w-3/4 "
        >
          <p>Sign Out</p>
        </div>
        <Dialog open={logoutDialog} width={400} onClose={() => null}>
          <div className="w-full relative z-50 h-full flex flex-col gap-4">
            <p className="text-xl font-medium text-[#fff]">
              Are you sure you want to{" "}
              <span className="text-primary font-semibold">Signout?</span>
            </p>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setLogoutDialog(false)}
                className="bg-primary text-[#fff] rounded-md p-2 pl-6 pr-6"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="border text-[#fff] rounded-md p-2 pl-6 pr-6"
              >
                Sign Out
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Sidebar;
