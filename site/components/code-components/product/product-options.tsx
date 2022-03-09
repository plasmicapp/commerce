import { ProductOption } from "@commerce/types/product";
import { selectDefaultOptionFromProduct, SelectedOptions } from "@components/product/helpers";
import { repeatedElement } from "@plasmicapp/host";
import React from "react";
import { useProduct } from "../contexts";

interface ProductOptionWithSelectedOptions {
  option: ProductOption,
  selectedOptions: SelectedOptions,
  setSelectedOptions: any,
}
const ProductOptionContext = React.createContext<ProductOptionWithSelectedOptions | undefined>(undefined);
const ProductOptionValueContext = React.createContext<string | undefined>(undefined);

interface ProductOptionsProps {
  className: string;
  useProductPlaceholder?: boolean;
  children?: React.ReactNode;
}

export function ProductOptions(props: ProductOptionsProps) {
  const { 
    className, 
    useProductPlaceholder, 
    children,
  } = props;

  const [selectedOptions, setSelectedOptions] = React.useState<SelectedOptions>({})

  const product = useProduct(useProductPlaceholder);

  React.useEffect(() => {
    if (product) {
      selectDefaultOptionFromProduct(product, setSelectedOptions)
    }
  }, [product])

  if (!product) {
    return <p>No product was selected!</p>
  }

  return (
    <div className={className}>
      {product.options.map((option, i) => 
        <ProductOptionContext.Provider value={{option, selectedOptions, setSelectedOptions}} key={option.id}>
          {repeatedElement(i === 0, children)}
        </ProductOptionContext.Provider>
      )}
    </div>
  )
}

interface ProductOptionsDisplayNameProps {
  className: string;
}

export function ProductOptionsDisplayName(props: ProductOptionsDisplayNameProps) {
  const { className } = props;

  const optionCtx = React.useContext(ProductOptionContext);

  if (!optionCtx) {
    return <p>A ProductOptions component is expected as parent!</p>
  }

  return <span className={className}>{optionCtx.option.displayName}</span>
}

interface ProductOptionsValueLabelProps {
  className: string;
}

export function ProductOptionsValueLabel(props: ProductOptionsValueLabelProps) {
  const { className } = props;

  const value = React.useContext(ProductOptionValueContext);
  if (!value) {
    return <p>A ProductOptionsValues component is expected as parent!</p>
  }

  return <span className={className}>{value}</span>
}


interface ProductOptionsValues {
  className: string;
  columns?: number;
  columnGap?: number;
  rowGap?: number;
  textOption: React.ReactElement;
  activeTextOption: React.ReactElement;
  colorOption: React.ReactElement;
  activeColorOption: React.ReactElement;
  editSlots?: boolean;
}

export function ProductOptionsValues(props: ProductOptionsValues) {
  const { 
    className,
    columns,
    columnGap,
    rowGap,
    textOption,
    activeTextOption,
    colorOption,
    activeColorOption,
    editSlots
  } = props;

  const optionCtx = React.useContext(ProductOptionContext);

  if (!optionCtx) {
    return <p>A ProductOptions components is expected as parent!</p>
  }

  const option = optionCtx.option;
  const active = optionCtx.selectedOptions[option.displayName.toLowerCase()];
  if (editSlots) {
    return (
      <>
        <ProductOptionValueContext.Provider value={"XXX"}>
          <p>Color Option {colorOption}</p>
          <p>Active Color Option {activeColorOption}</p>
          <p>Text Option {textOption}</p>
          <p>Active Text Option {activeTextOption}</p>
        </ProductOptionValueContext.Provider>
      </>
    )
  }
  const setSelectedOptions = optionCtx.setSelectedOptions;
  const selectedOptions = optionCtx.selectedOptions;

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        columnGap: `${columnGap}px`,
        rowGap: `${rowGap}px`,
      }}
    >
      {option.values.map((v, i) => {
        if (v.hexColors) {
          return repeatedElement(i === 0, 
            React.cloneElement(
              v.label.toLowerCase() === active ? activeColorOption : colorOption,
              {
                style: {backgroundColor: v.hexColors},
                onClick: () => {
                  setSelectedOptions((selectedOptions: any) => {
                    return {
                      ...selectedOptions,
                      [option.displayName.toLowerCase()]: v.label.toLowerCase(),
                    }
                  })
                }
              }
            )
          )
        } else {
          return <ProductOptionValueContext.Provider value={v.label}>
            {repeatedElement(i === 0,
              React.cloneElement(
                v.label.toLowerCase() === active ? activeTextOption : textOption,
               {
                onClick: () => {
                  setSelectedOptions((selectedOptions: any) => {
                    return {
                      ...selectedOptions,
                      [option.displayName.toLowerCase()]: v.label.toLowerCase(),
                    }
                  })
                }
              }
            ))}
          </ProductOptionValueContext.Provider>
        }
      })}      
    </div>
  )
}