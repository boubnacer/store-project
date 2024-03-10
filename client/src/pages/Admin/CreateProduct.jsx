import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useUploadProductImageMutation,
  useCreateProductMutation,
} from "../../app/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../app/api/categoryApiSlice";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const { data } = await createProduct(formData);
      if (data.error) {
        toast.error("Faild");
      } else {
        toast.success(`${name} created successfully`);
        navigate("/shop");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx=[0]">
      <div className="flex flex-col md:flex-row">
        {/* Admin menu */}
        <div className="md:w-3/4 p-3">
          <div className="h-12 text-white">Create Product</div>

          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-6">
              {image ? image.name : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className={!image ? "hidden" : "text-white"}
              />
            </label>
          </div>

          <div className="p-3">
            <div className="flex flex-wrap">
              <div className="one">
                <label className="text-white" htmlFor="name">
                  Name
                </label>{" "}
                <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[20rem] border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="two lg:ml-10">
                <label className="text-white" htmlFor="price">
                  Price
                </label>{" "}
                <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[20rem] border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap">
              <div className="three">
                <label className="text-white" htmlFor="quantity">
                  Quantity
                </label>{" "}
                <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[20rem] border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="four lg:ml-10">
                <label className="text-white" htmlFor="brand">
                  Brand
                </label>{" "}
                <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[20rem] border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="" className="my-5 text-white">
              Description
            </label>
            <textarea
              type="text"
              className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="flex justify-between gap-2">
              <div>
                <label htmlFor="name block" className="text-white">
                  Count In Stock
                </label>{" "}
                <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[25rem] border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="" className="text-white">
                  Category
                </label>
                <br />
                <select
                  name=""
                  id=""
                  className="p-4 mb-3 border rounded-lg text-white w-[25rem] bg-[#101011]"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="py-4 px-10 rounded-lg text-lg font-bold bg-pink-500"
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
