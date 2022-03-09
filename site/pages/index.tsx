import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Marquee, Hero } from '@components/ui'
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import {
  initPlasmicLoader,
  PlasmicRootProvider,
  PlasmicComponent,
  ComponentRenderData,
  plasmicPrepass
} from '@plasmicapp/loader-nextjs';
import { PLASMIC } from '../plasmic-init';
import { SWRConfig } from 'swr'
import { CommerceProvider } from '@framework'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const productsPromise = commerce.getAllProducts({
    variables: { first: 6 },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  })
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise

  const plasmicData = await PLASMIC.fetchComponentData('/');
  const cache = new Map();
  cache.set("/api/catalog/products", {products});
  await plasmicPrepass(
    <CommerceProvider>
    <SWRConfig value={{provider: () => cache, suspense: true}}>
      <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
        <PlasmicComponent component="/" />
      </PlasmicRootProvider>
    </SWRConfig>
    </CommerceProvider>
  );
  const queryCache = Object.fromEntries(cache.entries());
  return {
    props: {plasmicData, queryCache}
  };
}

export default function Home({
  plasmicData,
  queryCache,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <SWRConfig value={{fallback: queryCache}}>
      <PlasmicRootProvider
        prefetchedData={plasmicData}
        loader={PLASMIC}
      >
        <PlasmicComponent component="/" />
      </PlasmicRootProvider>
    </SWRConfig>
  );
}

Home.Layout = Layout
