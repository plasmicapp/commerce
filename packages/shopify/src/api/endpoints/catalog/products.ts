import { ShopifyAPI } from '../../index'
import { NextApiRequest, NextApiResponse } from 'next'

const products = (commerce: ShopifyAPI) => {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const data = await commerce.getAllProducts({
      variables: { first: 99 },
    })
    res.json(data)
  }
}

export default products