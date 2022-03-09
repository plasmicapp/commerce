import { Product } from "@commerce/types/product";
import { useCommerce } from "@framework";
import commerce from "@lib/api/commerce";
import React from "react";
import { ProductCollectionContext } from "../contexts";
import type { SWRHook } from '@vercel/commerce/utils/types'
import s from './ProductView.module.css'
import Image from 'next/image'

interface GetAllProductsProps {
  className?: string;
  children?: React.ReactNode;
  count?: number;
}

export function LoadProducts(props: GetAllProductsProps) {
  const { className, children, count = 6 } = props;

  const [products, setProducts] = React.useState<Product[] | undefined>(undefined);
  
  const [filteredProducts, setFilteredProducts] = React.useState<Product[] | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      const response = await fetch(`/api/catalog/products`);
      const { products } = await response.json();
      return setProducts(await products);
    })();
  }, []);
  
  React.useEffect(() => {
    setFilteredProducts(products?.filter(product => product.images.length > 0));
  }, [products]);
  return filteredProducts;
}
