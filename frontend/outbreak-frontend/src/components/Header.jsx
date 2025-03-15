import LoginRegisterModal from "./LoginRegisterModal";

function Header({ isAuthOpen, setIsAuthOpen }) {
  return (
    <>
      <header className="py-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a
              href="#"
              className="text-gradient text-2xl font-primary font-bold tracking-[4px] uppercase"
              style={{
                background:
                  "linear-gradient(92.23deg, #42A6E3 21.43%, #FF56F6 100%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Outbreak Guard
            </a>

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
