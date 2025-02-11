import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import NoteCard from "../../components/Cards/NoteCard.jsx";
import { useNavigate } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes.jsx";
import Modal from "react-modal";
import axiosInstance from "../../utils/axiosInstance.js";
import { useSnackbar } from "notistack";
import { FaRegFrown } from "react-icons/fa";

const API_ENDPOINTS = {
  GET_USER: "/get-user",
  GET_ALL_NOTES: "/get-all-notes",
  DELETE_NOTE: (noteId) => `/delete-note/${noteId}`,
  UPDATE_NOTE: (noteId) => `/update-note/${noteId}`,
  SEARCH_NOTES: "/search-notes",
};

const Home = () => {
  const [modalState, setModalState] = useState({ isOpen: false, type: "add", data: null });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setModalState({ isOpen: true, data: noteDetails, type: "edit" });
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_USER);
      setUserInfo(response.data.user || null);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchAllNotes = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_ALL_NOTES);
      setAllNotes(response.data.notes || []);
    } catch (error) {
      console.error("Failed to fetch notes. Please try again.");
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.DELETE_NOTE(noteId));
      fetchAllNotes();
      enqueueSnackbar("Note deleted successfully!", { variant: "success" });
    } catch (error) {
      handleError(error);
    }
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;
    await deleteNote(noteToDelete._id);
    setShowConfirmModal(false);
    setNoteToDelete(null);
  };

  const toggleFavorite = async (note) => {
    const updatedNote = { ...note, isFavorite: !note.isFavorite };
    try {
      await axiosInstance.put(API_ENDPOINTS.UPDATE_NOTE(note._id), updatedNote);
      fetchAllNotes();
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const searchNotes = async (query) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SEARCH_NOTES, { params: { query } });
      setIsSearch(true);
      setSearchResults(response.data.notes || []);
    } catch (error) {
      console.error("Error searching notes:", error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    fetchAllNotes();
  };

  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.error("Error:", error.response.data);
      }
    } else {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    fetchAllNotes();
    fetchUserInfo();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onLogout={() => { localStorage.clear(); navigate("/login"); }}
        onSearchNote={searchNotes}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto px-4 bg-light-cream">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {isSearch && searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center col-span-full bg-gray-100 p-6 rounded-lg shadow-md mt-4">
              <FaRegFrown className="text-6xl text-gray-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Match Found</h2>
              <p className="text-gray-600">Please try a different search term.</p>
            </div>
          ) : allNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center col-span-full bg-gray-100 p-6 rounded-lg shadow-md mt-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">No Notes Available</h2>
              <p className="text-gray-600">Click the button below to add your first note!</p>
            </div>
          ) : (
            (isSearch ? searchResults : allNotes).map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                onEdit={() => handleEdit(item)}
                onDelete={() => { setNoteToDelete(item); setShowConfirmModal(true); }}
                isFavorite={item.isFavorite}
                onToggleFavorite={() => toggleFavorite(item)}
              />
            ))
          )}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-sage-green hover:bg-green-600 absolute right-10 bottom-10"
        onClick={() => { setModalState({ isOpen: true, type: "add", data: null }); }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={modalState.isOpen}
        onRequestClose={() => setModalState({ isOpen: false, type: "add", data: null })}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={modalState.type}
          noteData={modalState.data}
          onClose={() => setModalState({ isOpen: false, type: "add", data: null })}
          getAllNotes={fetchAllNotes}
        />
      </Modal>

     
      <Modal
        isOpen={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
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
