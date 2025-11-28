import { useEffect, useState } from "react";
import axios from "axios";
import { ProductProps } from "../../type";
import ProductCard from "../components/ProductCard";
import { config } from "../../config";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);

  // 1 saniyelik debounce
  useEffect(() => {
    if (!searchText) {
      setFilteredProducts([]);
      return;
    }

    const delay = setTimeout(() => {
      fetchSearch();
    }, 1000);

    return () => clearTimeout(delay);
  }, [searchText]);

  const fetchSearch = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${config.baseUrl}/product/search?q=${searchText}`
      );
      setFilteredProducts(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="hidden md:inline-flex max-w-3xl w-full mx-2 relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <input
        type="text"
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
        placeholder="Search products..."
        onFocus={() => setIsOpen(true)}
        className="w-full flex-1 rounded-full text-gray-900 text-lg 
          placeholder:text-base shadow-sm ring-1 ring-gray-300 
          focus:ring-darkText sm:text-sm px-4 py-2"
      />

      {/* Arama sonuçları */}
      {searchText && isOpen && (
        <div
          className="absolute left-0 top-14 w-full max-h-[500px] 
            px-10 py-5 bg-white z-20 overflow-y-scroll text-black 
            shadow-lg scrollbar-hide"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
        >
          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {filteredProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  item={item}
                  setSearchText={setSearchText}
                />
              ))}
            </div>
          ) : (
            <div className="py-10 bg-gray-50 w-full flex items-center justify-center border border-gray-600 rounded-md">
              <p className="text-xl font-normal">
                Nothing matches:{" "}
                <span className="underline text-red-500 font-semibold">
                  {searchText}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
