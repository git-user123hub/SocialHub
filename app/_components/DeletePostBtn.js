"use Client";

function DeletePostBtn({ setMenuClicked, setIsMiniModalOpened }) {
  async function handleDelPost(e) {
    e.preventDefault();
    setMenuClicked(false);
    setIsMiniModalOpened(true);
  }

  return (
    <>
      <button
        className="hover:rounded-lg w-full h-full hover:bg-primaryHvrClr flex py-3 px-4 gap-2 items-center text-red-500"
        onClick={handleDelPost}
      >
        <span>Delete</span>
      </button>
    </>
  );
}

export default DeletePostBtn;
