import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUsers, removeUser, setPage } from "../store/usersSlice";
import Loader from "../components/Loader"; 
import UserRow from "../components/UserRow";
import UserCard from "../components/UserCard";
import { useNavigate } from "react-router-dom";
import {AiOutlineTable,AiOutlineSearch,AiOutlineClose} from "react-icons/ai";
import { BsCardList } from "react-icons/bs";
import { logout } from "../store/authSlice";
import { IoMdLogOut } from "react-icons/io";

const UsersPage = () => {
const dispatch = useDispatch();
const navigate = useNavigate();
const { ids, entities, isLoadingList, isProcessingAction, page, total, per_page } = useSelector(
 (state) => state.users
);
const [view, setView] = useState("table");
const [searchQuery, setSearchQuery] = useState("");
const [processingItemId, setProcessingItemId] = useState(null);
const totalPages = useMemo(() => {
 if (!per_page) return 1; 
 return Math.ceil(total / per_page);
}, [total, per_page]);

useEffect(() => {
 dispatch(loadUsers(page));
}, [dispatch, page]);
const handleAction = async (action, userId) => {
 setProcessingItemId(userId);
 await dispatch(action(userId));
 setProcessingItemId(null);
};

const handleDelete = (userId) => {
 if (window.confirm("Delete this user?")) {
 handleAction(removeUser, userId);
 }
};

const handleEdit = (userId) => {
 navigate(`/edit/${userId}`);
};

const handleLogout = () => {
 dispatch(logout());
};

const handleClearSearch = () => {
 setSearchQuery("");
};

const userList = useMemo(
 () => ids.map((id) => entities[id]).filter(Boolean),
 [ids, entities]
);

const filteredUsers = userList.filter((user) => {
 const query = searchQuery.toLowerCase();
 return (
 !query ||
 user.email?.toLowerCase().includes(query) ||
 user.first_name?.toLowerCase().includes(query) ||
 user.last_name?.toLowerCase().includes(query)
 );
});

const pageNumbers = useMemo(() => {
 const pages = [];
 const maxPageButtons = 5; 
 const startPage = Math.max(1, page - Math.floor(maxPageButtons / 2));
 const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
 
 for (let i = startPage; i <= endPage; i++) {
 pages.push(i);
 }
 return pages;
}, [page, totalPages]);

return (
 <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
 {isLoadingList && <Loader />}
 <div className="bg-white rounded shadow-sm dark:bg-gray-800">
  <div className="p-8 border-b border-gray-200 dark:border-gray-700">
  <div className="flex justify-between items-center mb-6">
   <h2 className="text-2xl font-semibold dark:text-white">Users</h2>
   <button
   onClick={handleLogout}
   className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-150"
   >
   <IoMdLogOut size="20px" />
   </button>
  </div>
  <div className="flex flex-row items-center justify-between">
   <div className="view-toggle flex space-x-4">
   <button
    onClick={() => setView("table")}
    className={`p-2.5 rounded border ${
    view === "table"
     ? "bg-blue-100 border-blue-300 text-blue-600 dark:bg-blue-900 dark:border-blue-600 dark:text-white"
     : "border-gray-200 bg-transparent text-gray-600 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400"
    }`}
   >
    <span className="flex justify-center items-center gap-2">
    <AiOutlineTable size="25px" />
    <span className="flex items-center text-base">Table</span>
    </span>
   </button>
   <button
    onClick={() => setView("card")}
    className={`p-2.5 rounded border ${
    view === "card"
     ? "bg-blue-100 border-blue-300 text-blue-600 dark:bg-blue-900 dark:border-blue-600 dark:text-white"
     : "border-gray-200 bg-transparent text-gray-600 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-400"
    }`}
   >
    <span className="flex justify-center items-center gap-2">
    <BsCardList size="25px" />
    <span className="flex items-center text-base">Card</span>
    </span>
   </button>
   </div>
   <div className="search-create flex items-center space-x-4 ml-auto">
   <div className="relative">
    <input
    placeholder="input search text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="p-3 pl-4 pr-10 rounded border border-gray-200 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
    />
    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
    {searchQuery && (
     <button
     onClick={handleClearSearch}
     className="text-gray-400 mr-2 dark:text-gray-300"
     >
     <AiOutlineClose size="20px" />
     </button>
    )}
    <AiOutlineSearch size="20px" className="text-gray-400 dark:text-gray-300" />
    </div>
   </div>
   <button
    className="bg-blue-600 text-white border-none p-3 px-4 rounded transition duration-150 hover:bg-blue-700"
    onClick={() => navigate("/create")}
   >
    Create User
   </button>
   </div>
  </div>
  </div>
  <div className="p-6 px-8">
  {filteredUsers.length === 0 && !isLoadingList && (
   <p className="text-center text-gray-500 py-10 dark:text-white">No users found.</p>
  )}
  {!isLoadingList && filteredUsers.length > 0 && view === "table" && (
   <table className="w-full border-collapse">
   <thead>
    <tr>
    <th className="bg-gray-50 p-4 px-6 text-left text-gray-500 w-[20%] dark:bg-gray-700 dark:text-white"></th>
    <th className="bg-gray-50 p-4 px-6 text-left text-gray-500 w-[20%] dark:bg-gray-700 dark:text-white">
     Email
    </th>
    <th className="bg-gray-50 p-4 px-6 text-left text-gray-500 w-[20%] dark:bg-gray-700 dark:text-white">
     First Name
    </th>
    <th className="bg-gray-50 p-4 px-6 text-left text-gray-500 w-[20%] dark:bg-gray-700 dark:text-white">
     Last Name
    </th>
    <th className="bg-gray-50 p-4 px-6 text-left text-gray-500 w-[20%] dark:bg-gray-700 dark:text-white">
     Action
    </th>
    </tr>
   </thead>
   <tbody>
    {filteredUsers.map((user) => (
    <UserRow
     key={user.id}
     user={user}
     onDelete={handleDelete}
     onEdit={handleEdit}
     loading={isProcessingAction && processingItemId === user.id}
    />
    ))}
   </tbody>
   </table>
  )}
  {!isLoadingList && filteredUsers.length > 0 && view === "card" && (
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
   {filteredUsers.map((user) => (
    <UserCard
    key={user.id}
    user={user}
    onDelete={handleDelete}
    onEdit={handleEdit}
    loading={isProcessingAction && processingItemId === user.id}
    />
   ))}
   </div>
  )}
  </div>
  <div className="p-4 border-t border-gray-200 flex justify-end dark:border-gray-700">
  <div className="flex gap-4 items-center">
   <button
   disabled={page <= 1}
   onClick={() => dispatch(setPage(page - 1))}
   className="p-1.5 px-2 rounded border border-gray-300 bg-white text-sm disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
   >
   ‹
   </button>
   {/* Optimization: Render dynamic pagination buttons */}
   {pageNumbers.map((pageNumber) => (
   <button
    key={pageNumber}
    onClick={() => dispatch(setPage(pageNumber))}
    className={`p-1.5 px-2 rounded border text-sm ${
    pageNumber === page
     ? "bg-blue-600 text-white border-blue-600"
     : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
    }`}
   >
    {pageNumber}
   </button>
   ))}
   <button
   disabled={page >= totalPages}
   onClick={() => dispatch(setPage(page + 1))}
   className="p-1.5 px-2 rounded border border-gray-300 bg-white text-sm disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
   >
   ›
   </button>
  </div>
  </div>
 </div>
 </div>
);
};

export default UsersPage;