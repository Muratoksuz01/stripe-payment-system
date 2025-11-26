import { useState } from "react";
import { API_PATH } from "../lib/API_PATH";
import axios from "axios";
import { store } from "../lib/store";
import Label from "../ui/Label";
import Loading from "../ui/Loading";


const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [email, setEmail] = useState("capalyx@mailinator.com");
  const [password, setPassword] = useState("Pa$$w0rd!");
  const {getUserInfo} =store()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);

    try {
      const response = await axios.post(API_PATH.login, { email, password });
      const data =response.data;
      console.log("Login successful:", data);
      localStorage.setItem("token",response.data.data.token)
      getUserInfo()
      // Gerekirse token veya kullanıcı bilgisini localStorage / context ile kaydet
    } catch (err: any) {
      setErrMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 rounded-lg">
      <form
        onSubmit={handleLogin}
        className="max-w-5xl mx-auto pt-10 px-10 lg:px-0 text-white"
      >
        <div className="border-b border-b-white/10 pb-5">
          <h2 className="text-lg font-semibold uppercase leading-7">
            Login
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Enter your credentials to login.
          </p>
        </div>

        <div className="border-b border-b-white/10 pb-5">
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Label title="Email address" htmlFor="email" />
              <input
                type="text"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
              />
            </div>
            <div className="sm:col-span-3">
              <Label title="Password" htmlFor="password" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
              />
            </div>
          </div>
        </div>

        {errMsg && (
          <p className="bg-white/90 text-red-600 text-center py-1 rounded-md tracking-wide font-semibold">
            {errMsg}
          </p>
        )}

        <button
          type="submit"
          className="mt-5 bg-indigo-700 w-full py-2 uppercase text-base font-bold tracking-wide text-gray-300 rounded-md hover:text-white hover:bg-indigo-600 duration-200"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <p className="text-sm leading-6 text-gray-400 text-center -mt-2 py-10">
        Does not have an Account{" "}
        <button
          onClick={()=>window.location.href="/register"}
          className="text-gray-200 font-semibold underline underline-offset-2 decoration-[1px] hover:text-white duration-200"
        >
          Register
        </button>
      </p>
      {loading && <Loading />}
    </div>
  );
};

export default Login;
