import React from 'react';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
/**
 * Renders a dropdown menu with a toggle button and a menu.
 * The menu is only visible when the toggle button is clicked.
 * @param {object} props
 * @returns {JSX.Element}
 */
const DropdownMenu = ({ children, ...props }) => {
    const [showMenu, setShowMenu] = useState(false);
    const BUTTON_CLASS = clsx(
        `group inline-flex justify-center rounded-2xl
        border border-gray-200 px-4 py-2
        text-sm font-medium text-gray-700
        hover:border-gray-400 hover:text-gray-900
        transition ease-in-out duration-300`,
        props.buttonClassName
    );
    const DROPDOWN_CLASS = clsx(
        `absolute sm:right-0 z-10 mt-2 w-40
        sm:origin-top-right
        rounded-md bg-white
        shadow-2xl ring-1 ring-black ring-opacity-5
        focus:outline-none`,
        props.dropdownClassName
    );

    const dropdownRef = React.useRef(null);
    useEffect(() => {
      /**
       * Close the dropdown menu if the user clicks outside of it
       * @param {MouseEvent} event The click event
       */
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setShowMenu(false);
        }
      };

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);

      // Unbind the event listener on cleanup
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [dropdownRef]);

    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <div>
          <button
            type="button"
            className={BUTTON_CLASS}
            id="menu-button"
            aria-expanded="false"
            aria-haspopup="true"
            onClick={() => setShowMenu(!showMenu)}
          >
            {props.buttonText}
            <svg className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-700 group-hover:text-gray-900  transition ease-in-out duration-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Dropdown menu, show/hide based on menu state. */}
        <div className={
          `${showMenu ?
              "transition ease-out duration-100 transform opacity-100 scale-100" :
              "pointer-events-none transition ease-in duration-75 transform opacity-0 scale-95"
          } ${DROPDOWN_CLASS}`}
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      </div>
    )
};

export default DropdownMenu;