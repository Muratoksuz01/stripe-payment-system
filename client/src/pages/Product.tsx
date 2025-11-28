import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { config } from "../../config";
import { ProductProps } from "../../type";
import { getData } from "../lib";
import Loading from "../ui/Loading";
import Container from "../ui/Container";
import _ from "lodash";
import { TiStarFullOutline } from "react-icons/ti";
import { FaRegEye } from "react-icons/fa";
import FormattedPrice from "../components/FormattedPrice";
import { IoClose } from "react-icons/io5";
import ProductCard from "../components/ProductCard";
import AddToCartBtn from "../components/AddToCartBtn";
import PriceTag from "../components/PriceTag";
import CategoryFilters from "../components/CategoryFilters";

const Product = () => {
  const [productData, setProductData] = useState<ProductProps | null>(null);

  // infinite scroll states
  const [allProducts, setAllProducts] = useState<ProductProps[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [color, setColor] = useState("");
  const { id } = useParams();

  const endpoint = id
    ? `${config?.baseUrl}/products/${id}`
    : `${config?.baseUrl}/products?page=${page}&limit=20`;

  // ürün detay veya liste alma
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getData(endpoint);

        if (id) {
          // product detail
          setProductData(data);
          setAllProducts([]);
        } else {
          // product list
          if (data.length < 20) setHasMore(false);
          setAllProducts((prev) => [...prev, ...data.data]);
          setProductData(null);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, endpoint]);

  // detay sayfası için varsayılan image-color
  useEffect(() => {
    if (productData) {
      setImgUrl(productData.images[0]);
      setColor(productData.colors[0]);
    }
  }, [productData]);

  // infinite scroll event
  useEffect(() => {
    if (id) return; // detay sayfasında scroll çalışmasın

    const onScroll = () => {
      if (!hasMore || loading) return;

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading, hasMore, id]);

  return (
    <div>
      {loading && page === 1 ? (
        <Loading />
      ) : (
        <Container>
          {/* PRODUCT DETAIL */}
          {!!id && productData && _.isEmpty(allProducts) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-start">
                <div>
                  {productData?.images?.map((item, index) => (
                    <img
                      src={item}
                      alt="img"
                      key={index}
                      className={`w-24 cursor-pointer opacity-80 hover:opacity-100 duration-300 ${
                        imgUrl === item &&
                        "border border-gray-500 rounded-sm opacity-100"
                      }`}
                      onClick={() => setImgUrl(item)}
                    />
                  ))}
                </div>
                <div>
                  <img src={imgUrl} alt="mainImage" />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold">{productData?.name}</h2>
                <div className="flex items-center justify-between">
                  <PriceTag
                    regularPrice={productData?.regularPrice}
                    discountedPrice={productData?.discountedPrice}
                    className="text-xl"
                  />
                  <div className="flex items-center gap-1">
                    <div className="text-base text-lightText flex items-center">
                      <span>{productData?.rating}</span>
                      <TiStarFullOutline color="#FFD700" />
                    </div>
                    <p className="text-base font-semibold">
                      ({productData?.reviews} reviews)
                    </p>
                  </div>
                </div>

                <p className="flex items-center">
                  <FaRegEye className="mr-1" />{" "}
                  <span className="font-semibold mr-1">
                    {productData?.reviews}
                  </span>
                  peoples are viewing this right now
                </p>

                <p>
                  You are saving{" "}
                  <span className="text-base font-semibold text-green-500">
                    <FormattedPrice
                      amount={
                        productData?.regularPrice! -
                        productData?.discountedPrice!
                      }
                    />
                  </span>{" "}
                  upon purchase
                </p>

                <div>
                  {color && (
                    <p>
                      Color:{" "}
                      <span
                        className="font-semibold capitalize"
                        style={{ color: color }}
                      >
                        {color}
                      </span>
                    </p>
                  )}

                  <div className="flex items-center gap-x-3">
                    {productData?.colors.map((item) => (
                      <div
                        key={item}
                        className={`${
                          item === color
                            ? "border border-black p-1 rounded-full"
                            : "border-transparent"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-full cursor-pointer"
                          style={{ backgroundColor: item }}
                          onClick={() => setColor(item)}
                        />
                      </div>
                    ))}
                  </div>

                  {color && (
                    <button
                      onClick={() => setColor("")}
                      className="font-semibold mt-1 flex items-center gap-1 hover:text-red-600 duration-200"
                    >
                      <IoClose /> Clear
                    </button>
                  )}
                </div>

                <p>
                  Brand: <span className="font-medium">{productData?.brand}</span>
                </p>
                <p>
                  Category:{" "}
                  <span className="font-medium">{productData?.category}</span>
                </p>

                <AddToCartBtn
                  product={productData}
                  className="bg-black/80 py-3 text-base text-gray-200 hover:scale-100 hover:text-white duration-200"
                />
              </div>
            </div>
          ) : (
            /* PRODUCT LIST + INFINITE SCROLL */
            <div className="flex items-start gap-10">
              <CategoryFilters id={id} />

              <div>
                <p className="text-4xl font-semibold mb-5 text-center">
                  Products Collection
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {allProducts?.map((item: ProductProps) => (
                    <ProductCard item={item} key={item?._id} />
                  ))}
                </div>

                {loading && (
                  <p className="text-center py-4">Loading more...</p>
                )}

                {!hasMore && (
                  <p className="text-center py-4 text-gray-500">
                    No more products
                  </p>
                )}
              </div>
            </div>
          )}
        </Container>
      )}
    </div>
  );
};

export default Product;
