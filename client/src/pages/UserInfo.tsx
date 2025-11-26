import { useState } from "react";
import Container from "../ui/Container";
import UserDetails from "./UserDetails";
import ChangePassword from "./ChangePassword";
import AddressList from "./AddressList";
import { store } from "../lib/store";



function UserInfo() {
  const [activeComponent, setActiveComponent] = useState("details");
  const {currentUser} =store()
  const onUpdate =() => {

  }
  return (
    <Container className=" text-white">
      <div className="relative isolate overflow-hidden text-black py-5 shadow-2xl sm:rounded-3xl sm:px-16">

        {/* ÜST KISIM (avatar + hoşgeldin) */}
        <p className="text-2xl ">Kullanıcı bilgilerim</p>

        {/* BUTONLAR */}
       <div className="mt-10 flex gap-6 border-b">

  <button
    onClick={() => setActiveComponent("details")}
    className={`pb-3 text-sm font-semibold transition ${
      activeComponent === "details"
        ? "text-orange-600 border-b-2 border-orange-600"
        : "text-gray-400 hover:text-gray-600"
    }`}
  >
    Üyelik Bilgilerim
  </button>

  <button
    onClick={() => setActiveComponent("changePass")}
    className={`pb-3 text-sm font-semibold transition ${
      activeComponent === "changePass"
        ? "text-orange-600 border-b-2 border-orange-600"
        : "text-gray-400 hover:text-gray-600"
    }`}
  >
    Şifre Değiştir
  </button>

  <button
    onClick={() => setActiveComponent("address")}
    className={`pb-3 text-sm font-semibold transition ${
      activeComponent === "address"
        ? "text-orange-600 border-b-2 border-orange-600"
        : "text-gray-400 hover:text-gray-600"
    }`}
  >
    Adreslerim
  </button>

</div>


        {/* ALTTA GÖRECEĞİMİZ COMPONENT */}
        <div className=" px-4">
          {activeComponent === "details" && <UserDetails currentUser={currentUser} onUpdate={onUpdate}/>}
          {activeComponent === "changePass" && <ChangePassword />}
          {activeComponent === "address" && <AddressList />}
        </div>

      </div>
    </Container>
  );
};
export default UserInfo