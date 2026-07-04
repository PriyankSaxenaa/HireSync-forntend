// src/components/common/AccountDeletionGuard.jsx
//
// Mount this once near the top of the app (inside AuthProvider + Router).
// It renders nothing — it just listens for the "account:deleted" socket
// event and, if it ever fires for the logged-in user, immediately logs them
// out and redirects to /login with a clear message.
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { connectSocket, disconnectSocket } from "../../lib/socket";

const AccountDeletionGuard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();

    const handleAccountDeleted = async (payload) => {
      toast.error(payload?.message || "Your account has been deleted by an administrator.", {
        duration: 6000,
      });
      await logout();
      disconnectSocket();
      navigate("/login", { replace: true });
    };

    socket.on("account:deleted", handleAccountDeleted);

    return () => {
      socket.off("account:deleted", handleAccountDeleted);
    };
  }, [user, logout, navigate]);

  return null;
};

export default AccountDeletionGuard;