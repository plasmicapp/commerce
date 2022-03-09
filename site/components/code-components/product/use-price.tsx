import usePrice from '@framework/product/use-price'
import React from "react";
import { ProductContext, useProduct } from "../contexts";

interface usePriceProps {
  className: string;
  useProductPlaceholder?: boolean
}

export function usePriceCodeComponent(props: usePriceProps) {
  const { className, useProductPlaceholder } = props;

  const product = useProduct(useProductPlaceholder);

  const { price } = usePrice(product && {
    amount: product.price.value,
    baseAmount: product.price.retailPrice,
    currencyCode: product.price.currencyCode!,
  })
  
  if (!product) {
    return <p>There isn't a product collection!</p>
  }

  return <span className={className}>{price} {product.price?.currencyCode}</span>
}

function useProductPlaceholder(useProductPlaceholder: any) {
    throw new Error("Function not implemented.");
}
