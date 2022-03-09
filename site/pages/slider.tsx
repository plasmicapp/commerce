import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'
import { ProductSlider } from '@components/code-components/product/product-slider'
import { LoadProducts } from '@components/code-components/product/load-products'
import React from 'react'
import Image from 'next/image'
import s from '@components/code-components/product/ProductView.module.css';
import cn from 'clsx';
import sty from '@components/code-components/product/product-slider.module.css';
export default function Slider() {
  const products = LoadProducts({});
  if (!products) {
    return <p>Loading...</p>
  }
  const product = products[0];
  console.log(cn(sty.number_slide1))
  return (
    <div>
      <ProductSlider
        slideContainer={<div style={{height: "600px", width: "600px"}}></div>}
        thumbsContainer={<div style={{height: "300px"}}></div>}
      >
      </ProductSlider>
    </div>
  )
}
