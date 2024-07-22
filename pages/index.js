import { List, TodoNotes } from "@/components";
import { db } from "@/firebaseConfig";
import { setNotes } from "@/redux/slices/NotesSlice";
import { ref, get, onValue, remove, query } from "firebase/database";
import { onSnapshot, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const newdoc = ref(db, "mytodos");
    onValue(newdoc, (snapshot) => {
      handleGetData();
    });
  }, []);

  const handleGetData = async (e) => {
    try {
      const newdoc = ref(db, "mytodos");
      const snapshot = await get(newdoc);
      if (snapshot) {
        setData(Object.values(snapshot.val()));
        dispatch(setNotes(Object.values(snapshot.val())));
        console.log(data);
      }

      setIsSubmitted(true);
      setIsError(false);
    } catch (error) {
      console.log("Error adding document: ", error);
      setIsSubmitted(false);
      setIsError(true);
    }
  };

  const handleDeleteTodoNotes = (todoNoteToDelete) => {
    const updatedData = data.filter((item) => item !== todoNoteToDelete);
    setData(updatedData);
  };

  return (
    <>
      <div className="border-b border-gray-700 grid grid-cols-3 lg:grid-cols-4 items-center">
        <div className="">
          <p className="m-5 text-xl whitespace-nowrap  md:text-4xl 3xl:text-6xl tracking-wider">
            My <span className="bg-[#BE9F56] text-black">Todos</span>
          </p>
        </div>
        <div className="col-span-2 p-5">
          <List handleGetData={handleGetData} />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 md:grid-cols-4 h-full gap-4 p-4">
        {data.length > 0 &&
          data.map((item) => (
            <TodoNotes
              data={item}
              onDelete={handleDeleteTodoNotes}
              key={item.id}
              handleGetData={handleGetData}
            />
          ))}
      </div>
    </>
  );
}
