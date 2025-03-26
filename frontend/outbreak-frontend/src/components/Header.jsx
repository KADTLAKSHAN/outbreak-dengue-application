import { useNavigate } from "react-router-dom";
import LoginRegisterModal from "./LoginRegisterModal";

function Header({ isAuthOpen, setIsAuthOpen, userRole, onLoginSuccess }) {
  const navigate = useNavigate();

  const handleUserPortalClick = () => {
    if (userRole) {
      // User is logged in, navigate directly to dashboard
      navigate("/dashboard");
    } else {
      // User is not logged in, show login modal
      setIsAuthOpen(true);
    }
  };

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
              onClick={handleUserPortalClick}
            >
              {userRole ? "Go to Dashboard" : "User Portal"}
            </button>
          </div>
        </div>
      </header>

      {/* Modal Component - Only show if user is not logged in */}
      {isAuthOpen && !userRole && (
        <LoginRegisterModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={onLoginSuccess}
        />
      )}
    </>
  );
}

export default Header;
