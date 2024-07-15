import React, { useState, useEffect, useRef } from "react";
import Todo from "./Todo";
import AddlistButton from "./addlistButton";

const List = () => {
  const [expanded, setExpanded] = useState(false);
  const [rows, setRows] = useState(1);
  const [todo, setTodo] = useState([]);
  const listRef = useRef(null);


  const temporaryTodos = [
    { id: 1, note: "Temporary Todo 1" },
    { id: 2, note: "Temporary Todo 2" },
    { id: 3, note: "Temporary Todo 3" },
    { id: 4, note: "Temporary Todo 4" },
    { id: 5, note: "Temporary Todo 5" },
    { id: 6, note: "Temporary Todo 6" },
    { id: 7, note: "Temporary Todo 7" },
  ];



  const Addtodo = () => {
    const newTodo = {
      id: todo.length + 1,
      note: "",
    };
    setTodo([...todo, newTodo]);
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
        setExpanded(false);
        setRows(1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        ref={listRef}
        className="border-[#BE9F56] border shadow-xl rounded-md flex-col space-y-2 p-1"
        onClick={toggleExpand}
        style={{ cursor: "pointer" }}
      >
        {expanded ? (
          <div className="">
            <input
              type="text"
              placeholder="Title"
              className="input placeholder:font-semibold placeholder:tracking-wider input-ghost bg-transparent w-full focus:outline-none"
            />
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Title"
              className="input placeholder:font-semibold placeholder:tracking-wider input-ghost bg-transparent w-full focus:outline-none"
              style={{ display: "none" }}
            />
          </div>
        )}
        <div>
          <textarea
            className="textarea placeholder:font-semibold bg-transparent placeholder:tracking-wider w-full focus:outline-none"
            placeholder="Take a note..."
            rows={rows}
          ></textarea>
          {expanded ? (
            <>
              {todo.map((item) => (
                <Todo
                  key={item.id}
                  todo={item}
                  onDelete={() => deleteTodo(item.id)}
                  onUpdateNote={updateTodoNote}
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
