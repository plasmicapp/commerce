import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { PLASMIC } from 'plasmic-init'
import NextError from 'next/error'
import {
  PlasmicComponent,
  PlasmicRootProvider,
} from '@plasmicapp/loader-nextjs'
import { ProductCollectionContext } from '@components/ui/ItemGallery'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const productsPromise = commerce.getAllProducts({
    variables: { first: 10 },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  })
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  const plasmicData = await PLASMIC.maybeFetchComponentData('/')

  return {
    props: {
      plasmicData,
      products,
      categories,
      brands,
      pages,
    },
    revalidate: 60,
  }
}

export default function Home(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { plasmicData, products } = props
  if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
    return <NextError statusCode={404} />
  }
  return (
    <ProductCollectionContext.Provider value={products}>
      <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
        <PlasmicComponent component={plasmicData.entryCompMetas[0].name} />
      </PlasmicRootProvider>
    </ProductCollectionContext.Provider>
  )
}

Home.Layout = Layout
