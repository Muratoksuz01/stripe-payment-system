import "react-multi-carousel/lib/styles.css";
import BannerCategories from "./BannerCategories";
import HomeBanner from "./HomeBanner";
import Hightlights from "./Hightlights";
import Categories from "./Categories";
import ProductList from "./ProductList";
import DiscountedBanner from "./DiscountedBanner";
import Blog from "./Blog";
import { store } from "../../lib/store";
import AıComponent from "../AıComponent";



function Landing() {
  const {currentUser}=store()
  return (
    <main>
      <BannerCategories />
      <HomeBanner />
      <Hightlights />
      <Categories />
      <ProductList />
      <DiscountedBanner />
      <Blog />
      {currentUser && <AıComponent email={currentUser.email}/>}
    </main>
  )
}

export default Landing