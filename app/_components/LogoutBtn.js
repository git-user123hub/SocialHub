import { signoutUser } from "@/app/_lib/actions";
import toast from "react-hot-toast";

function LogoutBtn({ setMenuClicked }) {
  async function handleSignOutCurUser(e) {
    if (setMenuClicked) {
      setMenuClicked(false);
    }
    const result = await signoutUser();

    if (result) {
      if (result.success) {
        localStorage.setItem("logout", "true");
        window.location.href = "/auth/login?signup=success";
      }
      if (!result.success) {
        toast.error("Something Went Wrong, Please Try Again");
      }
    }
  }

  return (
    <button
      onClick={handleSignOutCurUser}
      className="hover:rounded-lg w-full h-full hover:bg-primaryHvrClr flex py-3 px-4 gap-2 items-center"
    >
      <span className="text-strokeClr">Log out</span>
    </button>
  );
}

export default LogoutBtn;
