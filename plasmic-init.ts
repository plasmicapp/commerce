import { initPlasmicLoader } from '@plasmicapp/loader-nextjs'
import {
  ProductGrid,
  ProductSlider,
  ProductImage,
  ProductPrice,
  ProductTitle,
} from '@components/ui/ItemGallery'
import { Reveal } from '@components/ui/Reveal'
import { Expander } from '@components/ui/Expander'

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: 'mBmeCvMxUra6mdM5V7nbPr', // ID of a project you are using
      token:
        'LLucBnE5ztxFS9hFow49LmUc35Fz8qpfdWSPMzBrLiwGRqtIrNz3EIqzJYExarMBQtLEeUNK6vyixd6s6kA', // API token for that project
    },
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true,
})

const collectionHandles = [
  'latest-stuff',
  'boots',
  'winter-things',
  'outerwear',
  'casual-things',
  'summer-collection',
  'services',
  'gifts',
]

PLASMIC.registerComponent(ProductSlider, {
  name: 'ProductSlider',
  props: {
    count: 'number',
    scroller: 'boolean',
    collectionHandle: {
      type: 'choice',
      options: collectionHandles,
      defaultValue: 'latest-stuff',
    },
  },
})

PLASMIC.registerComponent(ProductGrid, {
  name: 'ProductGrid',
  displayName: 'Product Grid',
  defaultStyles: {
    maxWidth: '100%',
    width: 'stretch',
  },
  props: {
    collectionHandle: {
      type: 'choice',
      options: collectionHandles,
      defaultValue: 'latest-stuff',
    },
    scroller: 'boolean',
    count: 'number',
    children: 'slot',
    columns: {
      type: 'number',
      defaultValue: 4,
    },
    columnGap: {
      type: 'number',
      defaultValue: 16,
    },
    rowGap: {
      type: 'number',
      defaultValue: 16,
    },
  },
  importPath: './ProductComponents',
})

PLASMIC.registerComponent(ProductTitle, {
  name: 'ProductTitle',
  props: {},
})

PLASMIC.registerComponent(ProductImage, {
  name: 'ProductImage',
  props: {},
})

PLASMIC.registerComponent(ProductPrice, {
  name: 'ProductPrice',
  props: {},
})

PLASMIC.registerComponent(Reveal, {
  name: 'Reveal',
  props: {
    children: 'slot',
    effect: {
      type: 'choice',
      options: [
        'bounce',
        'fade',
        'flip',
        'hinge',
        'jackinthebox',
        'roll',
        'rotate',
        'slide',
        'zoom',
      ],
    },
    cascade: 'boolean',
    damping: 'boolean',
    direction: {
      type: 'choice',
      options: ['up', 'down', 'left', 'right'],
    },
    delay: 'number',
    duration: 'number',
    fraction: 'number',
    triggerOnce: 'boolean',
  },
  importName: 'Reveal',
})

PLASMIC.registerComponent(Expander, {
  name: 'Expander',
  props: {
    header: 'slot',
    children: 'slot',
    defaultExpanded: 'boolean',
  },
})
