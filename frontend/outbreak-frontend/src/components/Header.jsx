import LoginRegisterModal from "./LoginRegisterModal";

function Header({ isAuthOpen, setIsAuthOpen }) {
  return (
    <>
      <header className="py-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#">Outbreak</a>

            {/* User Portal Button */}
            <button
              className="btn btn-sm cursor-pointer"
              onClick={() => setIsAuthOpen(true)}
            >
              User Portal
            </button>
          </div>
        </div>
      </header>

      {/* Modal Component */}
      {isAuthOpen && (
        <LoginRegisterModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />
      )}
    </>
  );
}

export default Header;
