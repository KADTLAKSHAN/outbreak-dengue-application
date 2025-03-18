import { useState, useEffect } from "react";
import axios from "axios";
import ArticlePopup from "./ArticlePopup";

function Articles({ setIsArticlePopupOpen }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchArticles(0);
  }, []);

  const fetchArticles = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/public/article?page=${page}`
      );
      setArticles(response.data.content);
      setTotalPages(response.data.totalpages);
      setError(null);
    } catch (err) {
      setError("Articles not exist");
      setArticles([]);
    }
    setLoading(false);
  };

  return (
    <section className="section" id="articles">
      <div className="container mx-auto">
        <h2 className="h2 mb-6 text-center xl:text-left">Our Recent Posts</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="overflow-y-auto max-h-[600px] px-2">
            <div className="grid grid-cols-4 gap-6">
              {articles.map((article) => (
                <div
                  key={article.articleId}
                  className="max-w-[320px] shadow-md rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => {
                    setSelectedArticle(article);
                    setIsArticlePopupOpen(true); // Add this line
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      className="group-hover:scale-110 transition-transform duration-500 w-full h-48 object-cover"
                      src={`http://localhost:8080/images/${article.image}`}
                      alt={article.title}
                    />
                    <div className="bg-amber-200 absolute bottom-0 left-0 text-white text-sm font-medium uppercase py-1 px-3">
                      {article.authorName}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="h4 mb-2">{article.title}</h4>
                    <p className="font-light text-gray-600 truncate">
                      {article.description}
                    </p>
                    <button className="text-blue-500 underline">
                      Read more
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => {
              if (currentPage > 0) {
                setCurrentPage(currentPage - 1);
                fetchArticles(currentPage - 1);
              }
            }}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (currentPage < totalPages - 1) {
                setCurrentPage(currentPage + 1);
                fetchArticles(currentPage + 1);
              }
            }}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Popup Dialog */}
      <ArticlePopup
        article={selectedArticle}
        onClose={() => {
          setSelectedArticle(null);
          setIsArticlePopupOpen(false);
        }}
      />
    </section>
  );
}

export default Articles;
