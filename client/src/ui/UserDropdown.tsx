import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

function UserDropdown({ currentUser, logout }: any) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {/* Trigger */}
      <Menu.Button className="cursor-pointer">
        {currentUser ? (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-800">
            {currentUser.firstName?.[0]?.toUpperCase()}
            {currentUser.lastName?.[0]?.toUpperCase()}
          </div>
        ) : (
          <FiUser className="hover:text-skyText duration-200 mr-1 text-2xl" />
        )}
      </Menu.Button>

      {/* Dropdown */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white rounded-md shadow-lg border focus:outline-none z-50">
          {currentUser ? (
            <>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/profile"
                    className={`${active ? "bg-gray-100" : ""} px-3 py-2 block`}
                  >
                    Profil
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/orders"
                    className={`${active ? "bg-gray-100" : ""} px-3 py-2 block`}
                  >
                    Siparişlerim
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={logout}
                    className={`${active ? "bg-gray-100" : ""} px-3 py-2 w-full text-left`}
                  >
                    Çıkış Yap
                  </button>
                )}
              </Menu.Item>
              
            </>
          ) : (
            <>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/login"
                    className={`${active ? "bg-gray-100" : ""} px-3 py-2 block`}
                  >
                    Giriş Yap
                  </Link>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/register"
                    className={`${active ? "bg-gray-100" : ""} px-3 py-2 block`}
                  >
                    Üye Ol
                  </Link>
                )}
              </Menu.Item>
            </>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default UserDropdown;
