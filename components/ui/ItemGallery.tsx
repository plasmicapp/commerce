/* eslint-disable @next/next/no-img-element */
import {
  createContext,
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import sty from './ItemGallery.module.css'
import classNames from 'classnames'
import { repeatedElement } from '@plasmicapp/loader-nextjs'
import Link from 'next/link'
import type { Product } from '@commerce/types/product'

interface ItemGalleryProps {
  scroller?: boolean
  children?: ReactNode
  style?: CSSProperties
  className?: string
  columns?: number
  columnGap?: number
  rowGap?: number
}

export function Slider({
  scroller = false,
  children,
  className,
  columns = 1,
  columnGap = 0,
  rowGap = 0,
}: ItemGalleryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [left, setLeft] = useState(0)
  useEffect(() => {
    scrollerRef.current?.scrollTo({
      left,
      behavior: 'smooth',
    })
  }, [left])
  const cardWidth = 200,
    gap = 10
  function slide(n: number) {
    setLeft(left + n * (cardWidth + gap))
  }

  return scroller ? (
    <div className={`${sty.Gallery} ${className}`}>
      {scroller && (
        <button className={sty.ScrollBtn} onClick={() => slide(-1)}>
          ‹
        </button>
      )}
      <div
        className={classNames({
          [sty.Items]: true,
          [sty.Items__Scrolling]: scroller,
        })}
        ref={scrollerRef}
      >
        {children}
      </div>
      {scroller && (
        <button className={sty.ScrollBtn} onClick={() => slide(1)}>
          ›
        </button>
      )}
    </div>
  ) : (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        columnGap: `${columnGap}px`,
        rowGap: `${rowGap}px`,
      }}
    >
      {children}
    </div>
  )
}

const Grid = Slider

export const ProductContext = createContext<Product | undefined>(undefined)
export const ProductCollectionContext = createContext<Product[] | undefined>(
  undefined
)

interface ProductCollectionProps extends ItemGalleryProps {
  offset?: number
  count?: number
}

function useProductCollectionPlaceholder(products: Product[] | undefined) {
  const [data, setData] = useState<Product[] | undefined>()

  useEffect(() => {
    ;(async () => {
      if (products) {
        return
      }

      const response = await fetch(`/api/catalog/products`)
      const { products: data } = await response.json()
      setData(data)
    })()
  }, [products])

  return data
}

function useProductPlaceholder(product: Product | undefined) {
  const [data, setData] = useState<Product | undefined>()

  useEffect(() => {
    ;(async () => {
      if (product) {
        return
      }

      const response = await fetch(`/api/catalog/products`)
      const { products } = await response.json()
      setData(products[0])
    })()
  }, [product])

  return data
}

export function ProductGrid({
  count,
  offset,
  children,
  ...rest
}: ProductCollectionProps) {
  const products = useProductCollection()?.slice(
    offset,
    count ? (offset || 0) + count : undefined
  )
  return (
    <Grid {...rest}>
      {products?.map((product, i) => (
        <ProductContext.Provider value={product} key={product.id}>
          <div>{repeatedElement(i === 0, children)}</div>
        </ProductContext.Provider>
      ))}
    </Grid>
  )
}

function useProduct() {
  return useContext(ProductContext)
}

function useProductCollection() {
  const products = useContext(ProductCollectionContext)
  const placeholder = useProductCollectionPlaceholder(products)
  return products || placeholder
}

export function StudioProductPlaceholder({
  children,
}: {
  children: ReactNode
}) {
  const product = useProduct()
  const placeholder = useProductPlaceholder(product)
  if (product) {
    return <>{children}</>
  }
  if (!placeholder) {
    return null
  }
  return (
    <ProductContext.Provider value={placeholder}>
      {children}
    </ProductContext.Provider>
  )
}

export function ProductLink({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const product = useProduct()
  if (!product) return null
  return (
    <Link href={`/product/${product.slug}`}>
      <a className={className}>{children}</a>
    </Link>
  )
}

export function ProductName({ className }: { className?: string }) {
  const product = useProduct()
  if (!product) return null
  return <div className={className}>{product.name}</div>
}

export function ProductDescription({ className }: { className?: string }) {
  const product = useProduct()
  if (!product) return null
  return (
    <div
      className={className}
      {...((product.descriptionHtml && {
        dangerouslySetInnerHTML: { __html: product.descriptionHtml },
      }) || { children: product.description })}
    />
  )
}

export function ProductPrice({ className }: { className?: string }) {
  const product = useProduct()
  if (!product) return null
  return (
    <div className={className}>
      ${product.price.value} {product.price.currencyCode}
    </div>
  )
}

export function ProductImage({ className }: { className?: string }) {
  const product = useProduct()
  if (!product) return null
  const image = product.images[0]
  return (
    <img
      alt={product.name || 'Product Image'}
      src={image.url}
      loading={'lazy'}
      className={className}
      style={{
        objectFit: 'cover',
      }}
    />
  )
}
