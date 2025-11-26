import { useState } from "react";
import { MdPhotoLibrary } from "react-icons/md";
import Login from "./Login";
import axios from "axios";
import { API_PATH } from "../lib/API_PATH";
import { store } from "../lib/store";
import Label from "../ui/Label";

export default function Registration() {
  const [login, setLogin] = useState(true);
  const {getUserInfo} =store()

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [avatar, setAvatar] = useState({ file: null, url: "" });

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleAvatar = (e: any) => {
    if (e.target.files[0]) {
      setAvatar({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleRegistration = async (e: any) => {
    e.preventDefault();
    setErrMsg("");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);

      if (avatar.file) {
        formData.append("avatar", avatar.file);  // dosya direkt burada
      }

      const res = await axios.post(API_PATH.register, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);

      if (res.data.success) {
        alert("giriş yapıldı");
         localStorage.setItem("token",res.data.data.token)
      getUserInfo()
      } else {
        setErrMsg(res.data.error);
      }
    } catch (err) {
      setErrMsg("Hata oluştu");
    } finally {
      setLoading(false);
    }


};


return (
  <div className="bg-gray-950 rounded-lg">
    <form onSubmit={handleRegistration} className="max-w-5xl mx-auto pt-10 px-10 lg:px-0 text-white">
      <div className="border-b border-b-white/10 pb-5">
        <h2 className="text-lg font-semibold uppercase leading-7">Registration Form</h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">Provide required information to register.</p>
      </div>

      <div className="border-b border-b-white/10 pb-5">
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Label title="First name" htmlFor="firstName" />
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="block w-full rounded-md bg-white/5 py-1.5 px-4 mt-2 outline-none ring-1 ring-white/10" />
          </div>

          <div className="sm:col-span-3">
            <Label title="Last name" htmlFor="lastName" />
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="block w-full rounded-md bg-white/5 py-1.5 px-4 mt-2 outline-none ring-1 ring-white/10" />
          </div>

          <div className="sm:col-span-4">
            <Label title="Email address" htmlFor="email" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md bg-white/5 py-1.5 px-4 mt-2 outline-none ring-1 ring-white/10" />
          </div>

          <div className="sm:col-span-4">
            <Label title="Password" htmlFor="password" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md bg-white/5 py-1.5 px-4 mt-2 outline-none ring-1 ring-white/10" />
          </div>

          
        </div>
      </div>

      {errMsg && <p className="bg-white/90 text-red-600 text-center py-1 mt-2 rounded-md font-semibold">{errMsg}</p>}

      <button disabled={loading} type="submit" className={`mt-5 w-full py-2 uppercase font-bold rounded-md ${loading ? "bg-gray-500" : "bg-indigo-700 hover:bg-indigo-600"}`}>
        {loading ? "Loading..." : "Send"}
      </button>
    </form>

    <p className="text-sm text-gray-400 text-center py-10">
      Already have an account?
      <button onClick={() => window.location.href="/login"} className="text-gray-200 font-semibold underline ml-1">Login</button>
    </p>
  </div>
);
}