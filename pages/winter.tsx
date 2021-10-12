import {
  PlasmicRootProvider,
  PlasmicComponent,
  ComponentRenderData,
} from '@plasmicapp/loader-nextjs'
import { PLASMIC } from '../plasmic-init'

// Statically fetch the data needed to render Plasmic pages or components.
export const getStaticProps = async () => {
  const plasmicData = await PLASMIC.fetchComponentData('Landing')
  return {
    props: {
      plasmicData,
    },
  }
}

// Render the page or component from Plasmic.
export default function MyPage(props: { plasmicData: ComponentRenderData }) {
  return (
    <PlasmicRootProvider loader={PLASMIC} prefetchedData={props.plasmicData}>
      <PlasmicComponent
        component="Landing"
        componentProps={{
          jackets: true,
        }}
      />
    </PlasmicRootProvider>
  )
}
