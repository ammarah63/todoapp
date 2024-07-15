import { List } from "@/components";

export default function Home() {
  return (
    <>
    <div className="border-b border-gray-700 grid grid-cols-4 items-center">
      <div className="">
      <p className="m-5  text-4xl tracking-wider">
        My <span className="bg-[#BE9F56] text-black">Todos</span>
      </p>
      </div>
    <div className="col-span-2 p-5">  <List/>  </div>
      </div>
      <div></div>
    </>
  );
}
