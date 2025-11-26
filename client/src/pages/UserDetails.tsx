import React, { useState } from "react";

function UserDetails({ currentUser, onUpdate }:any) {
  const [firstName, setFirstName] = useState(currentUser?.firstName || "");
  const [lastName, setLastName] = useState(currentUser?.lastName || "");
  const [email, setEmail] = useState(currentUser?.email || "");

  return (
    <div className=" max-w-xl p-8">
      <h2 className="text-xl font-semibold mb-6 border-b pb-2">Profil bilgileri</h2>
  
      <div className="mb-5 ">
        <label className="block mb-1 text-sm  ">Ad</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-gray-100"
          placeholder="Adınız"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-1 text-sm  ">Soyad</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-gray-100"
          placeholder="Soyadınız"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-1 text-sm  ">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-gray-100"
          placeholder="E-posta adresiniz"
        />
      </div>

      <button
        onClick={() =>
          onUpdate && onUpdate({ firstName, lastName, email })
        }
        className="bg-orange-600 hover:bg-orange-700 mt-4 px-6 py-2 rounded-md font-semibold"
      >
        Güncelle
      </button>
    </div>
  );
}

export default UserDetails;
