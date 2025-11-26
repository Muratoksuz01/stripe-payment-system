import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ChangePassword() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="bg-white text-gray-800 rounded-lg p-8 max-w-2xl">

      <h2 className="text-xl font-semibold mb-6 border-b pb-2">Şifre değişikliği</h2>

      <p className="text-sm text-gray-600 mb-8 leading-6">
        Şifreniz en az bir harf, rakam veya özel karakter içermeli. Ayrıca şifreniz en az 8 karakterden oluşmalı.
      </p>

      {/* Mevcut Şifre */}
      <div className="mb-6">
        <label className="block text-sm mb-2 font-medium">Mevcut şifre</label>
        <div className="relative">
          <input
            type={showOld ? "text" : "password"}
            placeholder="Mevcut şifre"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-gray-100"
          />
          <button
            type="button"
            onClick={() => setShowOld(!showOld)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showOld ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      {/* Yeni Şifre */}
      <div className="mb-4">
        <label className="block text-sm mb-2 font-medium">Yeni şifre</label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            placeholder="Yeni şifre"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-gray-100"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showNew ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      {/* Mini uyarı */}
      <div className="flex items-start gap-2 text-xs text-gray-500 mb-6">
        <span className="text-lg">ℹ</span>
        <p>
          Güvenliğiniz için adınızı, soyadınızı ve doğum tarihinizi içermeyen bir şifre belirleyin.
        </p>
      </div>

      {/* Güncelle Butonu */}
      <button
        disabled
        className="w-full bg-gray-300 text-gray-500 rounded-lg py-3 font-semibold cursor-not-allowed"
      >
        Güncelle
      </button>

    </div>
  );
}
