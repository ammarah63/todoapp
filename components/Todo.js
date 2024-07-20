import { useState } from "react";


const Todo = ({ todo, onDelete, onUpdateNote, onToggle }) => {
 const [note, setNote] = useState(todo.note);
 const [isChecked, setIsChecked] = useState(todo.isChecked);

 const handleNoteChange = (e) => {
   setNote(e.target.value);
   onUpdateNote({
     ...todo,
     note: e.target.value,
   });
 };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    onToggle(todo.id, e.target.checked); 
  };

  return (
    <>
      <div className="flex justify-between items-center space-x-0 md:space-x-2">
        <div className="flex items-center space-x-1 md:space-x-3 my-2 flex-grow">
          <input
            type="checkbox"
            onChange={handleCheckboxChange}
            checked={isChecked}
            className="checkbox checkbox-sm [--chkbg:theme(colors.primary)]"
          />
          <span
            className={`label-text flex-grow ${
              isChecked ? "text-[#999] line-through" : ""
            }`}
          >
            <input
              type="text"
              value={note}
              onChange={handleNoteChange}
              placeholder={todo.note}
              className={`input input-ghost 3xl:text-lg 4xl:text-xl input-xs w-6/12 md:min-w-full ${
                isChecked ? "text-[#999] line-through" : ""
              }`}
              style={{ flex: "1" }}
            />
          </span>
        </div>
        <div>
          <button onClick={onDelete}>
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z"
                fill="#BE9F56"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L6.53035 18.5303C6.23745 18.8232 5.76258 18.8232 5.46969 18.5303C5.17679 18.2374 5.17679 17.7626 5.46968 17.4697L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967Z"
                fill="#BE9F56"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Todo;
