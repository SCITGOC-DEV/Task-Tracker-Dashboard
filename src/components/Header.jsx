import React from 'react';

const Header = ({ category, title }) => (
  <div className="mb-5">
    <p className="text-lg text-gray-400">{category}</p>
    <p className="text-3xl dark:text-white font-extrabold tracking-tight secondary-dark-bg">
      {title}
    </p>
  </div>
);

export default Header;
