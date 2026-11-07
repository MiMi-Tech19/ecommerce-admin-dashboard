import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../services/products";

export function useProducts() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    enabled: isAuthenticated,
  });
}
