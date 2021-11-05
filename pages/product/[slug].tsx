import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { PLASMIC } from 'plasmic-init'
import NextError from 'next/error'
import {
  ProductCollectionContext,
  ProductContext,
} from '@components/ui/ItemGallery'
import {
  PlasmicComponent,
  PlasmicRootProvider,
} from '@plasmicapp/loader-nextjs'
import { NextSeo } from 'next-seo'

export async function getStaticProps({
  params,
  locale,
  locales,
  preview,
}: GetStaticPropsContext<{ slug: string }>) {
  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const productPromise = commerce.getProduct({
    variables: { slug: params!.slug },
    config,
    preview,
  })

  const allProductsPromise = commerce.getAllProducts({
    variables: { first: 4 },
    config,
    preview,
  })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise
  const { product } = await productPromise
  const { products: relatedProducts } = await allProductsPromise

  if (!product) {
    throw new Error(`Product with slug '${params!.slug}' not found`)
  }

  const plasmicData = await PLASMIC.maybeFetchComponentData('/product/[slug]')

  return {
    props: {
      plasmicData,
      pages,
      product,
      relatedProducts,
      categories,
    },
    revalidate: 200,
  }
}

export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const { products } = await commerce.getAllProductPaths()

  return {
    paths: locales
      ? locales.reduce<string[]>((arr, locale) => {
          // Add a product path for every locale
          products.forEach((product: any) => {
            arr.push(`/${locale}/product${product.path}`)
          })
          return arr
        }, [])
      : products.map((product: any) => `/product${product.path}`),
    fallback: 'blocking',
  }
}

export default function Slug(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const router = useRouter()

  const { plasmicData, product, relatedProducts } = props
  if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
    return <NextError statusCode={404} />
  }
  return router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <ProductCollectionContext.Provider value={relatedProducts}>
      <ProductContext.Provider value={product}>
        <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
          <PlasmicComponent component={plasmicData.entryCompMetas[0].name} />
          <NextSeo
            title={product.name}
            description={product.description}
            openGraph={{
              type: 'website',
              title: product.name,
              description: product.description,
              images: [
                {
                  url: product.images[0]?.url!,
                  width: 800,
                  height: 600,
                  alt: product.name,
                },
              ],
            }}
          />
        </PlasmicRootProvider>
      </ProductContext.Provider>
    </ProductCollectionContext.Provider>
  )
}

Slug.Layout = Layout
