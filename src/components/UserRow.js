import React, { memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Recommended for type checking

const UserRow = memo(({ user, onDelete }) => {
 // Graceful fallback for the avatar image
 const avatarSrc = user.avatar ? user.avatar  : `https://i.pravatar.cc/150?u=${user.id}`;
 
 // State to manage image load errors
 const [imgSrc, setImgSrc] = React.useState(avatarSrc);

 const handleImageError = () => {
  // Fallback to a generic avatar on error
  setImgSrc(`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random&color=fff`);
 };

 return (
  <tr className="border-b border-gray-200 dark:border-gray-700">
   <td className="p-4 w-[20%]">
    <img
     src={imgSrc}
     alt={`Profile picture of ${user.first_name} ${user.last_name}`}
     className="w-24 h-24 rounded-full"
     onError={handleImageError}
    />
   </td>
   <td className="p-4 w-[20%]">
    <a
     href={`mailto:${user.email}`}
     className="text-blue-600 hover:underline dark:text-blue-400"
    >
     {user.email}
    </a>
   </td>
   <td className="p-4 w-[20%] dark:text-white">{user.first_name}</td>
   <td className="p-4 w-[20%] dark:text-white">{user.last_name}</td>
   <td className="p-4 w-[20%]">
    <div className="flex items-center h-full gap-2">
     <Link
      to={`/edit/${user.id}`}
      className="bg-blue-600 text-white p-2 px-4 rounded text-sm hover:bg-blue-700"
     >
      Edit
     </Link>
     <button
      type="button" // Use type="button" to prevent form submission behavior
      className="bg-red-600 text-white p-2 px-4 rounded text-sm hover:bg-red-700"
      onClick={() => onDelete(user.id)}
     >
      Delete
     </button>
    </div>
   </td>
  </tr>
 );
});

// Adding PropTypes for robustness and type safety
UserRow.propTypes = {
 user: PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  email: PropTypes.string.isRequired,
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired,
  avatar: PropTypes.string,
 }).isRequired,
 onDelete: PropTypes.func.isRequired,
};

// Provide a default fallback for the component's name
UserRow.displayName = 'UserRow';

export default UserRow;