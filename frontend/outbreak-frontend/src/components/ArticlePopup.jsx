import { Dialog } from "@headlessui/react";

const ArticlePopup = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <Dialog
      open={Boolean(article)}
      onClose={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
    >
      <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-xl text-gray-700 hover:text-gray-900"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900">{article.title}</h3>

        {/* Image */}
        <img
          src={`http://localhost:8080/images/${article.image}`}
          alt={article.title}
          className="w-full h-64 object-cover rounded-md mt-3"
        />

        {/* Description */}
        <p className="text-gray-700 mt-3">{article.description}</p>

        {/* Author Info */}
        <p className="text-gray-500 mt-2">By {article.authorName}</p>
      </div>
    </Dialog>
  );
};

export default ArticlePopup;
