import React from "react";
import { useProduct } from "../contexts";

interface ProductImageProps {
  className: string;
  customStyle?: object;
  useProductPlaceholder?: boolean;
  imageIndex?: number;
}

export function ProductImage(props: ProductImageProps) {
  const { className, customStyle, useProductPlaceholder, imageIndex = 0 } = props;

  const product = useProduct(useProductPlaceholder);
  if (!product) {
    return <p>There isn't a product collection!</p>
  }

  const image = product.images[imageIndex]
  return (
    <img
      alt={product.name || 'Product Image'}
      src={image?.url ?? ""}
      loading={'lazy'}
      className={className}
      style={customStyle}
    />
  )
}