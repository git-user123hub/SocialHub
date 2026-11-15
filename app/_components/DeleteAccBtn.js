function DeleteAccBtn({ setMenuClicked, setIsMiniModalOpened }) {
  async function handleDel(e) {
    e.preventDefault();

    setMenuClicked(false);
    setIsMiniModalOpened(true);
  }

  return (
    <button
      onClick={handleDel}
      className="hover:rounded-lg w-full h-full hover:bg-primaryHvrClr flex py-3 px-4 gap-2 items-center"
    >
      <span className="text-red-600 font-semibold">Delete</span>
    </button>
  );
}

export default DeleteAccBtn;
