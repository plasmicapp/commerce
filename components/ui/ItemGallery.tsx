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

interface ProductGalleryProps {
  offset?: number
  count?: number
  scroller?: boolean
  className?: string
}

const ProductBoxContext = createContext<Product | undefined>(undefined)
interface ProductCollectionProps extends ItemGalleryProps {
  offset?: number
  count?: number
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

function useProductCollectionData(offset?: number, count?: number) {
  const [data, setData] = useState<Product[] | undefined>(undefined)
  useEffect(() => {
    ;(async () => {
      const response = await fetch(`/api/catalog/products`)
      const { products } = await response.json()
      setData(products.slice(offset, count ? (offset || 0) + count : undefined))
    })()
  }, [offset, count])
  return data
}

export function ProductGrid({
  count,
  offset,
  children,
  ...rest
}: ProductCollectionProps) {
  const products = useProductCollectionData(offset, count)
  return (
    <Grid {...rest}>
      {products?.map((product, i) => (
        <ProductBoxContext.Provider value={product} key={product.id}>
          <div>{repeatedElement(i === 0, children)}</div>
        </ProductBoxContext.Provider>
      ))}
    </Grid>
  )
}

function useProduct() {
  return useContext(ProductBoxContext)
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
    <ProductBoxContext.Provider value={placeholder}>
      {children}
    </ProductBoxContext.Provider>
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
