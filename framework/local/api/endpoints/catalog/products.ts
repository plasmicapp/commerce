import { LocalAPI } from '@framework/api'
import { NextApiRequest, NextApiResponse } from 'next'

const products = (commerce: LocalAPI) => {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const data = await commerce.getAllProducts({
      variables: { first: 99 },
    })
    res.json(data)
  }
}

export default products
