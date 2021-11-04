import { initPlasmicLoader } from '@plasmicapp/loader-nextjs'
import {
  ProductDescription,
  ProductGrid,
  ProductImage,
  ProductLink,
  ProductName,
  ProductPrice,
  StudioProductPlaceholder,
} from '@components/ui/ItemGallery'
import { Reveal } from '@components/ui/Reveal'
import { Expander } from '@components/ui/Expander'

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: 'd1YxdDF84AwJPcved6P9XK', // ID of a project you are using
      token:
        '2HcGZxyEBMDLCvoYiBUiJA491wSUCtspufWxj2gkXOz2T5l6iI3LBwLrXfKcULMbbq9nYJ1y0a9NH4Nskvw', // API token for that project
    },
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true,
})

PLASMIC.registerComponent(ProductGrid, {
  name: 'ProductGrid',
  defaultStyles: {
    maxWidth: '100%',
    width: 'stretch',
  },
  props: {
    scroller: 'boolean',
    offset: 'number',
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
})

PLASMIC.registerComponent(StudioProductPlaceholder, {
  name: 'StudioProductPlaceholder',
  props: {
    children: 'slot',
  },
})

PLASMIC.registerComponent(ProductLink, {
  name: 'ProductLink',
  props: {
    children: 'slot',
  },
})

PLASMIC.registerComponent(ProductName, {
  name: 'ProductName',
  props: {},
})

PLASMIC.registerComponent(ProductDescription, {
  name: 'ProductDescription',
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
