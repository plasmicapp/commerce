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
import {
  exampleCmsData,
  exampleCollectionData,
  exampleProductData,
} from './ItemGalleryExampleData'
import { repeatedElement } from '@plasmicapp/loader-nextjs'
import Link from 'next/link'

function formatTitle<T>(x: T) {
  return x
}
function formatPrice<T>(x: T) {
  return x
}
function formatImage<T>(x: T) {
  return x
}

const productFragment = `
fragment ProductFragment on Product {
  availableForSale
  collections(first: 5) {
    edges {
      node {
        handle
      }
    }
  }
  createdAt
  description
  descriptionHtml
  handle
  id
  images(first: 5) {
    edges {
      node {
        id
        transformedSrc
        width
        height
      }
    }
  }
  metafield(key: "app_key", namespace: "affiliates") {
    description
  }
  metafields(first: 5) {
    edges {
      node {
        key
        description
        value
        valueType
      }
    }
  }
  onlineStoreUrl
  options {
    name
    values
  }
  priceRange {
    maxVariantPrice {
      amount
    }
    minVariantPrice {
      amount
    }
  }
  productType
  publishedAt
  seo {
    title
    description
  }
  title
  updatedAt
  variants(first: 5) {
    edges {
      node {
        availableForSale
        currentlyNotInStock
        id
        image {
          id
          transformedSrc
          width
          height
        }
        priceV2 {
          amount
        }
        requiresShipping
        sku
        title
        unitPrice {
          amount
        }
      }
    }
  }
}
`

const allProductsQuery = `
query Products($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
  products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
    edges {
      node {
        ...ProductFragment
      }
    }
  }
}

${productFragment}
`

const collectionQuery = `
query Collection($handle:String!){
  collectionByHandle(handle:$handle){
    products(first:99){
      edges{
        node{
          ...ProductFragment
        }
      }
    }
  }
}

${productFragment}
`

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
  collectionHandle?: string
  scroller?: boolean
  className?: string
}

function useProductData() {
  const [data, setData] = useState<typeof exampleProductData | undefined>(
    undefined
  )
  useEffect(() => {
    ;(async () => {
      const response = await fetch(
        'https://graphql.myshopify.com/api/2021-04/graphql.json',
        {
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'sec-ch-ua':
              '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'x-shopify-storefront-access-token':
              'ecdc7f91ed0970e733268535c828fbbe',
          },
          referrer: 'https://shopify.dev/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: JSON.stringify({
            query: allProductsQuery,

            variables: { first: 10 },
          }),
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
        }
      )
      const data = await response.json()
      setData(data)
    })()
  }, [])
  return data
}

export function ProductSlider({
  collectionHandle,
  offset,
  count,
  scroller = true,
  ...rest
}: ProductGalleryProps) {
  const products = useProductCollectionData(collectionHandle, offset, count)
  return (
    <Slider scroller={scroller} {...rest}>
      {products?.map((product) => {
        const image = product.images.edges[0].node
        return (
          <div key={product.id} className={sty.Item}>
            <img
              alt={product.title}
              src={image.transformedSrc}
              width={image.width}
              height={image.height}
              loading={'lazy'}
              className={sty.Thumb}
            />
            <div className={sty.Title}>{product.title}</div>
            <div className={sty.Price}>
              ${product.priceRange.maxVariantPrice.amount}
            </div>
          </div>
        )
      })}
    </Slider>
  )
}

export type ProductData =
  typeof exampleProductData.data.products.edges[number]['node']

const ProductBoxContext = createContext<ProductData | undefined>(undefined)
interface ProductCollectionProps extends ItemGalleryProps {
  offset?: number
  count?: number
  collectionHandle?: string
}

function useProductCollectionData(
  collectionHandle: string | undefined,
  offset?: number,
  count?: number
) {
  const [data, setData] = useState<ProductData[] | undefined>(undefined)
  useEffect(() => {
    ;(async () => {
      if (!collectionHandle) {
        return
      }
      const queryCollections = !collectionHandle.match(
        /boots|winter-things|outerwear/
      )
      const response = await fetch(
        'https://graphql.myshopify.com/api/2021-04/graphql.json',
        {
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'sec-ch-ua':
              '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'x-shopify-storefront-access-token':
              'ecdc7f91ed0970e733268535c828fbbe',
          },
          referrer: 'https://shopify.dev/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: queryCollections
            ? JSON.stringify({
                query: collectionQuery,
                variables: { handle: collectionHandle },
              })
            : JSON.stringify({
                query: allProductsQuery,
                variables: { first: 99 },
              }),

          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
        }
      )
      const data = await response.json()
      const productEdges: undefined | { node: ProductData }[] = queryCollections
        ? data?.data.collectionByHandle.products.edges
        : data?.data.products.edges
      setData(
        productEdges
          ?.map((edge) => edge.node)
          .filter((product) =>
            collectionHandle === 'winter-things'
              ? product.title.match(/Shirt|Cardigan|Jumper|Boot/)
              : collectionHandle === 'outerwear'
              ? product.title.match(/Jumper/)
              : collectionHandle === 'boots'
              ? product.productType === 'Boots'
              : true
          )
          .slice(offset, count ? (offset || 0) + count : undefined)
      )
    })()
  }, [collectionHandle, offset, count])
  return data
}

export function ProductGrid({
  collectionHandle,
  count,
  offset,
  children,
  ...rest
}: ProductCollectionProps) {
  const products = useProductCollectionData(collectionHandle, offset, count)
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

export function ProductLink({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const product = useProduct()
  if (!product) return null
  const href = product.onlineStoreUrl
  return (
    <Link href={href}>
      <a className={className}>{children}</a>
    </Link>
  )
}

export function ProductTitle({ className }: { className?: string }) {
  const product = useProduct()
  if (!product) return null
  return <div className={className}>{formatTitle(product.title)}</div>
}

export function ProductPrice({ className }: { className?: string }) {
  const product = useProduct()
  if (!product) return null
  return (
    <div className={className}>
      ${formatPrice(product.priceRange.maxVariantPrice.amount)}
    </div>
  )
}

export function ProductImage({ className }: { className?: string }) {
  const product = useProduct()
  if (!product) return null
  const image = product.images.edges[0].node
  return (
    <img
      alt={product.title}
      src={image.transformedSrc}
      width={image.width}
      height={image.height}
      loading={'lazy'}
      className={className}
      style={{
        objectFit: 'cover',
      }}
    />
  )
}

export type CmsItem = {
  photo: string
  title: string
  imageCaption?: string
  imageCredits?: string
}

const CmsItemContext = createContext<CmsItem | undefined>(undefined)

export function CmsItemField({
  className,
  field,
}: {
  className?: string
  field?: keyof CmsItem
}) {
  const item = useContext(CmsItemContext)
  if (!item) {
    return <div className={className}>(Must display in a CMS item)</div>
  }
  if (!field) {
    return <div className={className}>(Must specify a field)</div>
  }
  if (field === 'photo') {
    return (
      <img
        src={item.photo}
        loading={'lazy'}
        className={className}
        style={{
          objectFit: 'cover',
        }}
      />
    )
  } else {
    return <div className={className}>{item[field]}</div>
  }
}

interface CmsGalleryProps extends ItemGalleryProps {
  count?: number
}

export function CmsGallery({ count, children, ...rest }: CmsGalleryProps) {
  const [data, setData] = useState<typeof exampleCmsData | undefined>(undefined)
  useEffect(() => {
    ;(async () => {
      const response = await fetch(
        'https://cdn.contentful.com/spaces/fbr4i5aajb0w/entries?content_type=7leLzv8hW06amGmke86y8G',
        {
          headers: {
            authorization:
              'Bearer 8c6d9bb62a89a05e4f88af2784a0a3f8bcacc7b401084d50f577dfc5f6df0c61',
            'x-contentful-user-agent': 'contentful.js/3.5.0',
          },
          method: 'GET',
        }
      )
      const data = await response.json()
      setData(data)
    })()
  }, [])
  return (
    <Slider {...rest}>
      {data?.items[1].fields.images.slice(0, count).map((item, i) => {
        // We do some dereferencing because Contentful data is shipped normalized.
        const entry = data.includes.Entry.find(
          (i) => i.sys.id === item.sys.id
        )! as typeof data.includes.Entry[0]
        const photo = entry.fields.photo
        const asset = data.includes.Asset.find(
          (i) => i.sys.id === photo.sys.id
        )!
        const imgSrc = (asset.fields as any).file.url + '?w=300'
        return (
          <CmsItemContext.Provider
            key={item.sys.id}
            value={{
              ...entry.fields,
              photo: imgSrc,
            }}
          >
            {repeatedElement(i === 0, children)}
          </CmsItemContext.Provider>
        )
      })}
    </Slider>
  )
}
