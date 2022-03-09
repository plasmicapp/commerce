import { Product } from "@commerce/types/product";
import React, { useContext } from "react";

export const ProductContext = React.createContext<Product | undefined>(undefined);
function useProductPlaceholder() {
  const [product, setProduct] = React.useState<Product | undefined>()
  React.useEffect(() => {
    (async () => {
      const response = await fetch(`/api/catalog/products`);
      const { products } = await response.json()
      setProduct(products[2])
    })();
  }, [])
  return product;
}
export function useProduct(_useProductPlaceholder?: boolean) {
  const product = useContext(ProductContext);
  const productPlaceholder = useProductPlaceholder();
  if (product) {
    return product;
  }
  if (_useProductPlaceholder) {
    return productPlaceholder;
  }
  return undefined;
}

export const ProductCollectionContext = React.createContext<Product[] | undefined>(undefined);
function useProductCollectionPlaceholder() {
  const [collection, setCollection] = React.useState<Product[] | undefined>()
  React.useEffect(() => {
    (async () => {
      const response = await fetch(`/api/catalog/products`);
      const { products } = await response.json()
      setCollection(products)
    })()
  }, [])
  return collection;
}
export function useProductCollection(_useProductCollectionPlaceholder?: boolean) {
  const collection = useContext(ProductCollectionContext);
  const collectionPlaceholder = useProductCollectionPlaceholder();
  if (collection) {
    return collection;
  }
  if (_useProductCollectionPlaceholder) {
    return collectionPlaceholder;
  }
  return undefined;
}
