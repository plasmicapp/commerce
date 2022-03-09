import { SWRHook } from '@vercel/commerce/utils/types'
import useSearch, { UseSearch } from '@vercel/commerce/product/use-search'
export default useSearch as UseSearch<typeof handler>
import data from "../data.json";

export const handler: SWRHook<any> = {
  fetchOptions: {
    query: '',
  },
  async fetcher({ input, options, fetch }) {
    return {
      data: {
        products: data.products,
      }
    }
  },
  useHook: () => () => {
    return {
      data: {
        products: data.products,
      },
    }
  },
}
