import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import NoteCard from "../../components/Cards/NoteCard.jsx";
import { useNavigate } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes.jsx";
import Modal from "react-modal";
import axiosInstance from "../../utils/axiosInstance.js";
import { useSnackbar } from "notistack";
import { FaHeart, FaRegHeart, FaRegFrown } from "react-icons/fa"; // Import frown icon

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handelEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      } else {
        console.error("User data not found in response:", response.data);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          console.error("An error occurred:", error.response.data);
        }
      } else {
        console.error("Network error or server not reachable:", error);
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("please try again");
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      await axiosInstance.delete("/delete-note/" + noteId);
      getAllNotes();
      enqueueSnackbar("Note deleted successfully!", { variant: "success" });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
      } else {
        console.log("Please try again");
      }
      enqueueSnackbar("Please try again", { variant: "error" });
    }
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;

    const noteId = noteToDelete._id;

    try {
      await deleteNote(noteToDelete);
    } catch (error) {
      console.error("Error deleting note:", error);
    }

    setShowConfirmModal(false); // Close the modal
    setNoteToDelete(null); // Reset the note to delete
  };

  const toggleFavorite = async (note) => {
    try {
      const updatedNote = { ...note, isFavorite: !note.isFavorite };
      await axiosInstance.put(`/update-note/${note._id}`, updatedNote);
      getAllNotes();
    } catch (error) {
      console.log("Error updating favorite status:", error);
    }
  };

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setSearchResults(response.data.notes);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onLogout={onLogout}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto px-4 bg-light-cream">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {isSearch && searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center col-span-full bg-gray-100 p-6 rounded-lg shadow-md mt-4">
              <FaRegFrown className="text-6xl text-gray-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No Match Found
              </h2>
              <p className="text-gray-600">
                Please try a different search term.
              </p>
            </div>
          ) : allNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center col-span-full bg-gray-100 p-6 rounded-lg shadow-md mt-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No Notes Available
              </h2>
              <p className="text-gray-600">
                Click the button below to add your first note!
              </p>
            </div>
          ) : (
            (isSearch ? searchResults : allNotes).map((item) => (
              <div key={item._id} className="relative">
                <NoteCard
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  onEdit={() => handelEdit(item)}
                  onDelete={() => {
                    setNoteToDelete(item);
                    setShowConfirmModal(true);
                  }}
                  isFavorite={item.isFavorite}
                  onToggleFavorite={() => toggleFavorite(item)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-sage-green hover:bg-green-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
        />
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        }}
        contentLabel="Confirm Deletion"
        className="w-[30%] max-h-1/2 bg-white rounded-md mx-auto mt-14 p-5"
      >
        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
        <p>Are you sure you want to delete this note?</p>
        <div className="flex justify-end mt-4">
          <button
            className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={confirmDeleteNote}
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Home;
