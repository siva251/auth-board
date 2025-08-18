import React, { memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const UserRow = memo(({ user, onDelete }) => {
  const avatarSrc = user.avatar ? user.avatar : `https://i.pravatar.cc/150?u=${user.id}`;
  const [imgSrc, setImgSrc] = React.useState(avatarSrc);

  const handleImageError = () => {
    setImgSrc(`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random&color=fff`);
  };

  return (
    // On small screens, this will act as a block element
    // On medium and larger screens, it will be a table row
    <tr className="border-b border-gray-200 dark:border-gray-700 block md:table-row mb-4 md:mb-0">
      {/* Container for user details on mobile */}
      <td className="p-4 block md:table-cell w-full md:w-[20%]">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img
            src={imgSrc}
            alt={`Profile picture of ${user.first_name} ${user.last_name}`}
            className="w-24 h-24 rounded-full"
            onError={handleImageError}
          />
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-xl font-bold dark:text-white">{user.first_name} {user.last_name}</span>
            <a
              href={`mailto:${user.email}`}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {user.email}
            </a>
          </div>
        </div>
      </td>

      {/* Empty cells to maintain desktop table structure */}
      <td className="hidden md:table-cell p-4 w-[20%]"></td>
      <td className="hidden md:table-cell p-4 w-[20%] dark:text-white">{user.first_name}</td>
      <td className="hidden md:table-cell p-4 w-[20%] dark:text-white">{user.last_name}</td>

      {/* Action buttons */}
      <td className="p-4 block md:table-cell w-full md:w-[20%]">
        <div className="flex justify-center md:justify-start items-center h-full gap-2">
          <Link
            to={`/edit/${user.id}`}
            className="bg-blue-600 text-white p-2 px-4 rounded text-sm hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            type="button"
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

UserRow.displayName = 'UserRow';

export default UserRow;