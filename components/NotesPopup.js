import React, { useState, useEffect, useRef } from "react";
import Todo from "./Todo";
import AddlistButton from "./AddlistButton";
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Database, push, ref, set, child, update } from "firebase/database";

const NotesPopup = ({ data, setShowpopup, showpopup, handleGetData }) => {
  const [expanded, setExpanded] = useState(false);
  const [datanotes, setDatanotes] = useState(false);
  const [rows, setRows] = useState(1);
  const [ID, setID] = useState(data.ID);
  const [notes, setNotes] = useState(data.Notes || "");
  const [todo, setTodo] = useState(data.Todos || []);
  const [donetodo, setDonetodo] = useState(data.DoneTodos || []);
  const [title, setTitle] = useState(data.Title || "");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    console.log(data);
  });

  const Addtodo = () => {
    const newTodo = {
      id: todo.length + 1,
      note: "",
      isChecked: false,
    };
    setTodo([...todo, newTodo]);
  };

  const toggleTodo = (id, isChecked) => {
    if (isChecked) {
      const itemToMove = todo.find((item) => item.id === id);
      if (itemToMove) {
        setDonetodo([...donetodo, { ...itemToMove, isChecked: true }]);
        setTodo(todo.filter((item) => item.id !== id));
        console.log(todo);
        console.log(donetodo);
      }
    } else {
      const itemToMoveBack = donetodo.find((item) => item.id === id);
      if (itemToMoveBack) {
        setTodo([...todo, { ...itemToMoveBack, isChecked: false }]);
        setDonetodo(donetodo.filter((item) => item.id !== id));
        console.log(todo);
        console.log(donetodo);
      }
    }
  };

  const updateTodoNote = (updatedTodo) => {
    const updatedTodos = todo.map((item) =>
      item.id === updatedTodo.id ? updatedTodo : item
    );
    setTodo(updatedTodos);
    console.log(todo);
  };

  const deleteTodo = (id) => {
    const updatedTodoList = todo.filter((item) => item.id !== id);
    setTodo(updatedTodoList);
  };

  const deletedoneTodo = (id) => {
    const updatedTodoList = donetodo.filter((item) => item.id !== id);
    setDonetodo(updatedTodoList);
  };

  const overwriteData = async () => {
    try {
      console.log("firebase", todo, donetodo, notes, title, ID);

      //    const todoRef = ;
      await set(child(ref(db, "/mytodos"), data.ID), {
        ID: ID,
        Title: title || "",
        Notes: notes || "",
        Todos: todo || [],
        DoneTodos: donetodo || [],
      });
      handleGetData();
        setShowpopup(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        // console.log(todo, donetodo, title, notes);
        setExpanded(false);
        setRows(1);
      }
    };

    if (showpopup) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'unset'; 
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unset'; 
    };
  }, [showpopup]);
  return (
    <>
      <div className="h-screen bg-black bg-opacity-60 inset-0 absolute flex items-center justify-center">
        <div
          ref={listRef}
          className="border-[#BE9F56] bg-black border w-11/12 h-11/12 md:w-5/12 md:h-9/12 shadow-xl rounded-md flex-col space-y-2 p-3"
          style={{ cursor: "pointer" }}
        >
          <div>
            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
              value={title}
              className="input 3xl:text-2xl 4xl:text-3xl placeholder:font-semibold placeholder:tracking-wider input-ghost bg-transparent w-full focus:outline-none"
            />
          </div>
          <div>
            {todo && todo.length > 0 ? (
              <>
                {todo.map((item) => (
                  <Todo
                    key={item.id}
                    todo={item}
                    onDelete={() => deleteTodo(item.id)}
                    onUpdateNote={updateTodoNote}
                    onToggle={toggleTodo}
                  />
                ))}
              </>
            ) : (
              <textarea
                onChange={(e) => setNotes(e.target.value)}
                className="textarea 3xl:text-xl 4xl:text-2xl placeholder:font-semibold bg-transparent placeholder:tracking-wider w-full focus:outline-none"
                placeholder="Take a note..."
                value={notes}
                rows={rows}
              ></textarea>
            )}

            <>
              {donetodo && donetodo.length > 0 ? (
                <p className="text-sm text-primary">Done todo(s) item</p>
              ) : (
                <></>
              )}
              {/* done todos here */}
              {donetodo &&
                donetodo.map((item) => (
                  <Todo
                    key={item.id}
                    todo={item}
                    onDelete={() => deletedoneTodo(item.id)}
                    onUpdateNote={updateTodoNote}
                    onToggle={toggleTodo}
                  />
                ))}
              <div className="flex space-x-4 justify-end items-center">
                <AddlistButton onClick={Addtodo} />
                <p
                  className=" text-end text-primary"
                  onClick={(e) => {
                    setShowpopup(false);
                    e.stopPropagation();
                  }}
                >
                  Close
                </p>
                <p className=" text-end text-primary" onClick={overwriteData}>
                  Save
                </p>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotesPopup;
