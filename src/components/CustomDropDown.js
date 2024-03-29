import React, { useState } from 'react';
import { addUpdateDistrict } from '../utitlities/services';
import './Dropdown.css'; // Import CSS file for styling

const CustomDropdown = ({ options, onSelect, isNew }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [newDist, setNewDist]= useState('');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleAdd = () => {
    setIsEditable(true);
  }
  const handleAddNew = (e) => {
    setNewDist(e.target.value);
  }
  const sumbitNewData = () => { 
    if(isNew){
      const district = {
          district: newDist
      }
      addUpdateDistrict(district)
      .then(()=> console.log("done"))
      .catch(e=>console.log("error ",e))
    }

  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false); // Close dropdown after selecting an option
  };

  return (
    <div className="dropdown">
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        {selectedOption ? selectedOption.label : 'Select an option'}
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {isNew &&<div className="dropdown-option" onClick={handleAdd}>Add New...</div>}
          {isEditable &&(
            <React.Fragment>
              <input placeholder={isNew ? "type district":"type kushang" } onChange={handleAddNew}/>
              <button onClick={sumbitNewData}>Submit</button>
           </React.Fragment>
          )
           }
          {options.map((option) => (
            <div
              key={option.value}
              className="dropdown-option"
              onClick={() => handleOptionSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
