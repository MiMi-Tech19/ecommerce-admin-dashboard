import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getUsers } from "../services/users";

export function useUsers() {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    enabled: isAuthenticated && user?.role === "ADMIN",
  });
}
