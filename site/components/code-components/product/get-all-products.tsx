import { Product } from "@commerce/types/product";
import { useCommerce } from "@framework";
import React from "react";
import { ProductCollectionContext } from "../contexts";
import useSWR from "swr";
import SWRFetcher from "@vercel/commerce/utils/default-fetcher";
import { useFetcher } from "@vercel/commerce/utils/use-hook";

interface GetAllProductsProps {
  children: React.ReactNode;
}

export function GetAllProducts(props: GetAllProductsProps) {
  const [filteredProducts, setFilteredProducts] = React.useState<Product[] | undefined>(undefined);

  const { data } = useSWR("/api/catalog/products", async() => {
    if (typeof window !== "undefined") {
      const response = await fetch("/api/catalog/products");
      return response.json();
    }
  });
  
  React.useEffect(() => {
    setFilteredProducts(data?.products.filter((product: Product) => product.images.length > 0));
  }, [data]);
  if (filteredProducts === undefined) {
    return <p>Loading...</p>
  }
  return <ProductCollectionContext.Provider value={filteredProducts}>
      {props.children}
    </ProductCollectionContext.Provider>
}