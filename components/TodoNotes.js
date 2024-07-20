import React, { useState, useEffect, useRef } from "react";
import Todo from "./Todo";
import NotesPopup from "./NotesPopup";
import { db } from "@/firebaseConfig";
import { ref, remove, child } from "firebase/database";

const TodoNotes = ({ data, onDelete, handleGetData }) => {
  const [expanded, setExpanded] = useState(false);
  const [showpopup, setShowpopup] = useState(false);
  const [rows, setRows] = useState(1);
  const [notes, setNotes] = useState();
  const [title, setTitle] = useState();
  const [todo, setTodo] = useState([]);
  const [donetodo, setDonetodo] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    console.log("todo data", data);
  });

  const handleDelete = async () => {
    try {
      remove(child(ref(db, "/mytodos"), data.ID));
      handleGetData();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <>
      <div
        ref={listRef}
        className="border-[#BE9F56] border cursor-pointer shadow-xl rounded-md flex-col space-y-1 p-2"
        //onClick={() => setShowpopup(true)}
        style={{ cursor: "pointer" }}
      >
        <div className="flex justify-end">
          <div className=" cursor-pointer" onClick={handleDelete}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#ffffff"
              width="20px"
              height="20px"
              className="ml-auto cursor-pointer"
              viewBox="0 0 24 24"
            >
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </div>
          <div className=" cursor-pointer" onClick={() => setShowpopup(true)}>
            <svg
              fill="#ffffff"
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3.293,20.707a1,1,0,0,1,0-1.414L17.586,5H12a1,1,0,0,1,0-2h8a1,1,0,0,1,1,1v8a1,1,0,0,1-2,0V6.414L4.707,20.707a1,1,0,0,1-1.414,0Z" />
            </svg>
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <div>
              <input
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder={data.Title}
                className="input 3xl:placeholder:text-xl 4xl:placeholder:text-2xl placeholder:font-semibold placeholder:tracking-wider input-ghost bg-transparent w-full focus:outline-none"
              />
            </div>
          </div>
          {data.Todos ? (
            <>
              {data.Todos.map((item) => (
                <Todo key={item.id} todo={item} />
              ))}
            </>
          ) : (
            <textarea
              onChange={(e) => setNotes(e.target.value)}
              className="textarea 3xl:placeholder:text-lg 4xl:placeholder:text-xl placeholder:font-semibold bg-transparent placeholder:tracking-wider w-full focus:outline-none"
              placeholder={data.Notes}
              rows={rows}
            ></textarea>
          )}
        </div>
      </div>
      {showpopup && (
        <NotesPopup
          data={data}
          setShowpopup={setShowpopup}
          showpopup={showpopup}
          handleGetData={handleGetData}
        />
      )}
    </>
  );
};

export default TodoNotes;
