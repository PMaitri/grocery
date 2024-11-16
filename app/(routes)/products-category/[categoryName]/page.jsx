import GlobalApi from '@/app/_utils/GlobalApi';
import TopCategoryList from '../_components/TopCategoryList';
import ProductList from '@/app/_components/ProductList';

async function ProductCategory({ params }) {
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryData();
    fetchProductData();
  }, [params.categoryName]);

  const fetchCategoryData = async () => {
    try {
      const categories = await GlobalApi.getCategoryList();
      setCategoryList(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError('Failed to load categories. Please try again later.');
    }
  };

  const fetchProductData = async () => {
    try {
      const products = await GlobalApi.getProductsByCategory(params.categoryName);
      setProductList(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError('Failed to load products. Please try again later.');
    }
  };

  return (
    <div>
      <h2 className="p-2 mt-0 bg-primary text-white font-bold text-center text-2xl">
        {params.categoryName}
      </h2>

      {/* Display error if there's an issue fetching categories or products */}
      {error && <div className="text-red-500">{error}</div>}

      <TopCategoryList categoryList={categoryList} />
      <div className="p-5 md:p-10">
        <ProductList productList={productList} />
      </div>
    </div>
  );
}

// Correctly add generateStaticParams() to handle the dynamic categories
export async function generateStaticParams() {
  try {
    const categoryList = await GlobalApi.getCategoryList();
    if (!categoryList || categoryList.length === 0) {
      console.error("No categories found for static generation");
      return [];  // Return empty array to prevent build errors
    }

    return categoryList.map((category) => ({
      categoryName: encodeURIComponent(category.attributes.name),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return []; // Return empty array to avoid build failure
  }
}

export default ProductCategory;
