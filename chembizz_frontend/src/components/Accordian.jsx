import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faArrowRightLong } from '@fortawesome/free-solid-svg-icons';

const Accordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [iconRotation, setIconRotation] = useState(0);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    setIconRotation(iconRotation === 0 ? 180 : 0);
  };

  return (
    <div className="rounded-md mt-5 overflow-hidden shadow-md py-2">
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer bg-white-100"
        onClick={toggleAccordion}
      >
        <h3 className="text-lg font-medium">{title}</h3>

        <FontAwesomeIcon icon={faCaretDown} rotation={iconRotation} />

      </div>
      {isOpen && (
        <div className="p-4 bg-white-50">
          <p className="text-gray-700">{content}</p>
          <div className='flex items-center mt-3 gap-2'>
            <span className=''>Learn more </span><span><FontAwesomeIcon icon={faArrowRightLong} /></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;
