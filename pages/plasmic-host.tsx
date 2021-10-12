import * as React from 'react'
import { PlasmicCanvasHost } from '@plasmicapp/host'
import Head from 'next/head'
import { PLASMIC } from '../plasmic-init'

export default function Host() {
  return (
    PLASMIC && (
      <div>
        <Head>
          {/* Optional: */}
          <script src="https://static1.plasmic.app/preamble.js" />
        </Head>
        <PlasmicCanvasHost />
      </div>
    )
  )
}
