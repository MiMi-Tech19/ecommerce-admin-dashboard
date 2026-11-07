import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getOrders } from "../services/orders";

export function useOrders() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
    enabled: isAuthenticated,
  });
}
