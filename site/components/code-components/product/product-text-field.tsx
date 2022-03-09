import React from "react";
import { useProduct } from "../contexts";

interface ProductTextFieldProps {
  className: string;
  field?: string;
  useProductPlaceholder?: boolean;
}

export function ProductTextField(props: ProductTextFieldProps) {
  const { className, field, useProductPlaceholder } = props;

  const product = useProduct(useProductPlaceholder);
  if (!product) {
    return <p>There isn't a product collection!</p>
  }
  if (!field) {
    return <p>You need to select a field</p>
  }

  let value;
  if (field === "price") {
    value = `$${product.price.value} ${product.price.currencyCode}`;
  } else if (field === "description") {
    return <div className={className} dangerouslySetInnerHTML={{__html: product.descriptionHtml || product.description}} />
  } else {
    value = (product as any)[field];
  }
  return <span className={className}>{value}</span>
}