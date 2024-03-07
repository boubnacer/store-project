import { useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../app/api/categoryApiSlice";
import CategoryForm from "../../components/CategoryForm";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";

function CategoryList() {
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { data: categories, error, refetch } = useFetchCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        refetch();
        setName("");
        toast.success(`${result.name} is created`);
      }
    } catch (error) {
      toast.error("Creating category faild");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatedName) {
      toast.error("Category name is required");
      return;
    }
    try {
      const result = await updateCategory({
        categoryId: selectedCategory?._id,
        updatedCategory: { name: updatedName },
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        refetch();
        setUpdatedName("");
        setSelectedCategory(null);
        setModalVisible(false);
        toast.success(`${result.name} is updated`);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      // we didn't add error and deleted object details to retutn from the server side
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${selectedCategory.name} deleted successfully`);
        refetch();
        setModalVisible(false);
        setSelectedCategory(null);
      }
    } catch (error) {
      toast.error("Category deletion faild");
    }
  };

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      <div className="md:w-3/4 p-3">
        <div className="h-12 text-white">Manage Categories</div>
        <CategoryForm
          value={name}
          setValue={(value) => setName(value)}
          handleSubmit={handleCreateCategory}
        />
        <br />
        <hr />
        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <div key={category._id}>
              <button
                className="bg-white py-2 px-4 border border-pink-500 text-pink-500 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                onClick={() => {
                  setModalVisible(true);
                  setSelectedCategory(category);
                  setUpdatedName(category.name);
                }}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updatedName}
            setValue={(value) => setUpdatedName(value)}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        </Modal>
      </div>
    </div>
  );
}

export default CategoryList;
