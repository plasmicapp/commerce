import React from "react";
import { ProductContext, useProductCollection } from "../contexts";

interface SelectProductProps {
  className: string;
  children: React.ReactNode;
  index?: number;
  useProductCollectionPlaceholder?: boolean
}

export function SelectProduct(props: SelectProductProps) {
  const { className, children, index = 0, useProductCollectionPlaceholder } = props;

  const collection = useProductCollection(useProductCollectionPlaceholder);
  if (!collection) {
    return <p>There isn't a product collection!</p>
  }
  return <ProductContext.Provider value={collection[index]}>
      {children}
    </ProductContext.Provider>
}