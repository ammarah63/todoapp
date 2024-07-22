import React, { useState, useEffect, useRef } from "react";
import Todo from "./Todo";
import AddlistButton from "./AddlistButton";
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { Database, push, ref, set } from "firebase/database";

const List = ({ handleGetData }) => {
  const [expanded, setExpanded] = useState(false);
  const [rows, setRows] = useState(1);
  const [notes, setNotes] = useState();
  const [title, setTitle] = useState();
  const [todo, setTodo] = useState([]);
  const [donetodo, setDonetodo] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const listRef = useRef(null);

  const handleSubmitNote = async (e) => {
    try {
      const newdoc = await push(ref(db, "mytodos"));
      const newDocId = newdoc.key;
      console.log(newDocId);
      await set(newdoc, {
        ID: newDocId,
        Title: title || "",
        Notes: notes || "",
        Todos: todo || [],
        DoneTodos: donetodo || [],
      });

      handleGetData();

      setIsSubmitted(true);
      setIsError(false);
    } catch (error) {
      console.log("Error adding document: ", error);
      setIsSubmitted(false);
      setIsError(true);
    } finally {
      console.log("finally");
    }
  };

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
      }
    } else {
      const itemToMoveBack = donetodo.find((item) => item.id === id);
      if (itemToMoveBack) {
        setTodo([...todo, { ...itemToMoveBack, isChecked: false }]);
        setDonetodo(donetodo.filter((item) => item.id !== id));
      }
    }
  };

  const updateTodoNote = (updatedTodo) => {
    const updatedTodos = todo.map((item) =>
      item.id === updatedTodo.id ? updatedTodo : item
    );
    setTodo(updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodoList = todo.filter((item) => item.id !== id);
    setTodo(updatedTodoList);
  };

  const deletedoneTodo = (id) => {
    const updatedTodoList = donetodo.filter((item) => item.id !== id);
    setDonetodo(updatedTodoList);
  };

  const toggleExpand = () => {
    setExpanded(true);
    setRows(2);
  };

  const CloseExpanded = () => {
    setExpanded(false);
    setTodo([]);
    setRows(1);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        console.log(todo, donetodo, title, notes);
        handleSubmitNote();
        setExpanded(false);
        setRows(1);
        setNotes("");
        setTitle("");
        setTodo([]);
        setDonetodo([]);
      }
    };
    if (expanded && (notes || todo.length > 0)) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (expanded && (notes || todo.length > 0)) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [handleSubmitNote]);

  return (
    <>
      <div
        ref={listRef}
        className="border-[#BE9F56] 3xl:text-lg 4xl:text-xl border shadow-xl rounded-md flex-col space-y-2 p-1"
        onClick={toggleExpand}
        style={{ cursor: "pointer" }}
      >
        {expanded ? (
          <div className="">
            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
              value={title}
              className="input 3xl:placeholder:text-xl  4xl:placeholder:text-2xl placeholder:font-semibold placeholder:tracking-wider input-ghost bg-transparent w-full focus:outline-none"
            />
          </div>
        ) : (
          <div>
            <input
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
              value={title}
              className="input 3xl:placeholder:text-xl 4xl:placeholder:text-2xl placeholder:font-semibold placeholder:tracking-wider input-ghost bg-transparent w-full focus:outline-none"
              style={{ display: "none" }}
            />
          </div>
        )}
        <div>
          {todo.length > 0 || donetodo.length > 0 ? (
            <></>
          ) : (
            <textarea
              onChange={(e) => setNotes(e.target.value)}
              className="textarea 3xl:placeholder:text-lg 4xl:placeholder:text-xl placeholder:font-semibold bg-transparent placeholder:tracking-wider w-full focus:outline-none"
              placeholder="Take a note..."
              value={notes}
              rows={rows}
            ></textarea>
          )}
          {expanded ? (
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
              {donetodo.length > 0 ? (
                <p className="text-sm text-primary">Done todo(s) item</p>
              ) : (
                <></>
              )}
              {/* done todos here */}
              {donetodo.map((item) => (
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
                    CloseExpanded();
                    e.stopPropagation();
                  }}
                >
                  Close
                </p>
              </div>
            </>
          ) : (
            <>
              <AddlistButton onClick={Addtodo} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default List;
