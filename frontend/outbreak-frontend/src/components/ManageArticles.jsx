import { useState, useEffect, useRef } from "react"; // Import useRef
import axios from "axios";

function ManageArticles() {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({
    title: "",
    description: "",
    authorName: "",
    image: null,
  });
  const [error, setError] = useState(null);

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axiosInstance.get("/api/public/article");
      setArticles(response.data.content);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to fetch articles. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle({ ...newArticle, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewArticle({ ...newArticle, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", newArticle.title);
    formData.append("description", newArticle.description);
    formData.append("authorName", newArticle.authorName);
    formData.append("image", newArticle.image);

    try {
      const response = await axiosInstance.post(
        "/api/admin/article",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        alert("Article added successfully!");
        setNewArticle({
          title: "",
          description: "",
          authorName: "",
          image: null,
        });
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        fetchArticles(); // Refresh the article list
      }
    } catch (error) {
      console.error("Error adding article:", error);
      setError("Failed to add article. Please try again.");
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      await axiosInstance.delete(`/api/admin/article/${articleId}`);
      alert("Article deleted successfully!");
      // Update the articles state immediately after deletion
      setArticles(
        articles.filter((article) => article.articleId !== articleId)
      );
    } catch (error) {
      console.error("Error deleting article:", error);
      setError("Failed to delete article. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl mx-auto">
      <h2 className="text-xl font-bold text-black">Manage Articles</h2>

      {/* Add New Article Form */}
      <h3 className="text-lg font-bold text-black mt-6">Add New Article</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-black font-semibold">Title:</label>
          <input
            type="text"
            name="title"
            className="w-full p-2 border rounded-md text-black"
            value={newArticle.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="block text-black font-semibold">Description:</label>
          <textarea
            name="description"
            className="w-full p-2 border rounded-md text-black"
            value={newArticle.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="block text-black font-semibold">Author Name:</label>
          <input
            type="text"
            name="authorName"
            className="w-full p-2 border rounded-md text-black"
            value={newArticle.authorName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="block text-black font-semibold">Image:</label>
          <input
            type="file"
            name="image"
            className="w-full p-2 border rounded-md text-black"
            onChange={handleImageChange}
            required
            ref={fileInputRef} // Attach the ref to the file input
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-md"
        >
          Add Article
        </button>
      </form>

      {/* Display Articles */}
      <h3 className="text-lg font-bold text-black mt-6">All Articles</h3>
      <div className="mt-4 space-y-4">
        {articles.length === 0 ? (
          <p className="text-red-500 bg-red-100 p-3 rounded-md">
            No articles found.
          </p>
        ) : (
          articles.map((article) => (
            <div
              key={article.articleId}
              className="border p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-4">
                {/* Display Small Image */}
                <img
                  src={`http://localhost:8080/images/${article.image}`}
                  alt={article.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h4 className="text-lg font-bold text-black">
                    {article.title}
                  </h4>
                  <p className="text-gray-700">{article.description}</p>
                  <p className="text-gray-500">By {article.authorName}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteArticle(article.articleId)}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ManageArticles;
