import "react-multi-carousel/lib/styles.css";
import BannerCategories from "./BannerCategories";
import HomeBanner from "./HomeBanner";
import Hightlights from "./Hightlights";
import Categories from "./Categories";
import ProductList from "./ProductList";
import DiscountedBanner from "./DiscountedBanner";
import Blog from "./Blog";



function Landing() {
  return (
    <main>
      <BannerCategories />
      <HomeBanner />
      <Hightlights />
      <Categories />
      <ProductList />
      <DiscountedBanner />
      <Blog />
    </main>
  )
}

export default Landing