// src/components/Loader.jsx

import React from "react";
import loadingGif from "../Assets/loadingGif.gif"; // Adjust path as needed

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 ">
      <img src={loadingGif} alt="Loading..." className="h-24 w-24" />
    </div>
  );
};

export default Loader;