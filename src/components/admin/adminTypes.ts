export const beautyCategories = ["Hair Care", "Skincare", "Serum", "Face Care", "New Launch", "Soap"];
export const wellnessCategories = ["Nutrition", "Energy", "Weight Loss", "Men Health", "Women Health"];

export const emptyProduct = {
  name: "",
  price: "",
  image: "",
  /** optional multi-image support for product gallery */
  images: undefined as undefined | string[],
  description: "",
  rating: "",
  section: "beauty" as "beauty" | "wellness",
  category: beautyCategories[0],
};


export const emptyCoupon = { code: "", discount: "", active: true };
export const emptyBlog = { title: "", author: "", content: "", category: "Skincare", imageUrl: "" };
