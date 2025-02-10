import React from "react";
import { MdCreate, MdDelete } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Import heart icons
import moment from "moment";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  onEdit,
  onDelete,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className="note-card p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-md font-semibold text-gray-800">{title}</h6>
          <span className="text-xs text-gray-500">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>
        <button
          onClick={onToggleFavorite}
          className="text-xl hover:text-red-500 transition-colors duration-200"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" /> // Filled heart for favorite
          ) : (
            <FaRegHeart className="text-gray-500" /> // Outline heart for not favorite
          )}
        </button>
      </div>
      <p className="text-sm text-gray-700 mt-2">
        {content ? content.slice(0, 60) + "..." : "No content available"}
      </p>
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-gray-500">
          {tags && tags.length > 0
            ? tags.map((item) => `#${item}`).join(" ")
            : "No tags"}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="icon-btn text-gray-600 hover:text-green-600 transition-colors duration-200"
          >
            <MdCreate />
          </button>
          <button
            onClick={onDelete}
            className="icon-btn text-gray-600 hover:text-red-600 transition-colors duration-200"
          >
            <MdDelete />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
