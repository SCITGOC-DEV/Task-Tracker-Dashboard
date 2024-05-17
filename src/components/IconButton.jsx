import clsx from 'clsx';
import React from 'react';

const IconButton = React.forwardRef((props, ref) => {
  const { children, className, component = 'button', ...others } = props;
  
  const classes = clsx(
    'cursor-pointer p-3 rounded-full hover:bg-black disabled:hover:bg-inherit disabled:cursor-not-allowed disabled:text-gray-500 dark:disabled:text-gray-800 hover:bg-opacity-10 focus:ring-4',
    className
  );

  return React.createElement(
    component,
    {
      ...others,
      ref,
      className: classes
    },
    children
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
