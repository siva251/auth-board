import React from "react";
import { GrEdit } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

const UserCard = ({ user, onDelete, onEdit, loading }) => {
 return (
  <div className=" relative flex flex-col items-center p-6 border border-gray-200 rounded-lg bg-white shadow-md group overflow-hidden dark:bg-gray-800 dark:border-gray-700">
   {/* User Avatar */}
   <img
    alt="avatar"
    src={
     user.avatar || `https://i.pravatar.cc/120?u=${user.email || user.id}`
    }
    className="w-24 h-24 rounded-full object-cover flex-shrink-0 mb-4"
   />

   {/* User Information */}
   <div className="text-center">
    <div className="font-bold text-lg dark:text-white">
     {user.first_name} {user.last_name}
    </div>
    <div className="text-gray-500 text-sm dark:text-gray-400">{user.email}</div>
   </div>

   {/* Buttons - Hidden by default, visible on hover */}
   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <div className="flex gap-4">
     <button
      onClick={() => onEdit(user.id)}
      className="p-4 bg-blue-600 text-white rounded-full transition-all duration-200 hover:bg-blue-700 active:scale-95 border-2 border-transparent hover:border-white"
      disabled={loading}
     >
      <GrEdit size="30px" />
     </button>
     <button
      className="p-4 bg-red-600 text-white rounded-full transition-all duration-200 hover:bg-red-700 active:scale-95 border-2 border-transparent hover:border-white"
      onClick={() => onDelete(user.id)}
      disabled={loading}
     >
      <MdDelete size="30px" />
     </button>
    </div>
   </div>
  </div>
 );
};

export default UserCard;