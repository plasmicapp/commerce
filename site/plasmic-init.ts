import { GetAllProducts } from "@components/code-components/product/get-all-products";
import { ProductImage } from "@components/code-components/product/product-image";
import { ProductOptions, ProductOptionsDisplayName, ProductOptionsValueLabel, ProductOptionsValues } from "@components/code-components/product/product-options";
import { ProductSlider } from "@components/code-components/product/product-slider";
import { ProductTextField } from "@components/code-components/product/product-text-field";
import { SelectProduct } from "@components/code-components/product/select-product";
import { usePriceCodeComponent } from "@components/code-components/product/use-price";
import { ReactFastMarquee } from "@components/code-components/ui/fast-marquee";
import { ReactCollapse } from "@components/code-components/ui/react-collapse";
import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "cGpEXySToNT8sTxaBT1JBV",  // ID of a project you are using
      token: "5EPIoD7I0T1YDfPd56Fjn6VjbsDRMUD1ZgukGW7Yop26fbKEJ7FASSP1V1tGal9AaAj8irBg2LwaTMiPm3DA"  // API token for that project
    }
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: true,
});

PLASMIC.registerComponent(GetAllProducts, {
  name: "GetAllProducts",
  props: {
    count: "number",
    children: "slot",
  },
  importPath: "./components/code-components/product/get-all-products"
});

PLASMIC.registerComponent(SelectProduct, {
  name: "SelectProduct",
  props: {
    index: "number",
    children: "slot",
    useProductCollectionPlaceholder: "boolean",
  },
  importPath: "./components/code-components/product/select-products"
});

PLASMIC.registerComponent(ProductTextField, {
  name: "ProductTextField",
  props: {
    field: {
      type: "choice",
      options: ["id", "name", "description", "descriptionHtml", "sku", "slug", "path", "price"]
    },
    useProductPlaceholder: "boolean"
  },
  importPath: "./components/code-components/product/select-products"
});

PLASMIC.registerComponent(ProductImage, {
  name: "ProductImage",
  props: {
    customStyle: "object",
    useProductPlaceholder: "boolean",
    imageIndex: "number"
  },
  importPath: "./components/code-components/product/product-image"
});

PLASMIC.registerComponent(usePriceCodeComponent, {
  name: "UsePrice",
  props: {
    useProductPlaceholder: "boolean",
  },
  importPath: "./components/code-components/product/use-price"
});

PLASMIC.registerComponent(ReactFastMarquee, {
  name: "ReactFastMarquee",
  props: {
    children: "slot",
    gradient: {
      type: "boolean",
      defaultValue: true
    },
    speed: "number",
    customStyle: "object"
  },
  importPath: "./components/code-components/ui/fast-marquee"
});

PLASMIC.registerComponent(ProductOptions, {
  name: "ProductOptions",
  props: {
    children: {
      type: "slot",
      defaultValue: [
        {
          type: "component",
          name: "ProductOptionsDisplayName"
        },
        {
          type: "box",
          children: [
            {
              type: "component",
              name: "ProductOptionsValues"
            }
            
          ]
        }
      ]
    },
    useProductPlaceholder: "boolean",

  },
  importPath: "./components/code-components/products/product-options"
});

PLASMIC.registerComponent(ProductOptionsDisplayName, {
  name: "ProductOptionsDisplayName", 
  props: {},
  importPath: "./components/code-components/products/product-options"
});

PLASMIC.registerComponent(ProductOptionsValueLabel, {
  name: "ProductOptionsValueLabel", 
  props: {},
  importPath: "./components/code-components/products/product-options"
})

PLASMIC.registerComponent(ProductOptionsValues, {
  name: "ProductOptionsValues",
  props: {
    columns: {
      type: "number",
      defaultValue: 6,
    },
    columnGap: {
      type: "number",
      defaultValue: 16,
    },
    rowGap: {
      type: "number",
      defaultValue: 16,
    },
    textOption: {
      type: "slot",
      defaultValue: [
        {
          type: "vbox",
          styles: {
            width: "50px",
            height: "50px",
            borderWidth: "1px",
            borderColor: "#ccc",
          },
          children: [
            {
              type: "component",
              name: "ProductOptionsValueLabel",
              styles: {
                color: "white"
              }
            }
          ]
        }
      ]
    },
    activeTextOption: {
      type: "slot",
      defaultValue: [
        {
          type: "vbox",
          styles: {
            width: "50px",
            height: "50px",
            borderWidth: "1px",
            borderColor: "#ccc",
          },
          children: [
            {
              type: "component",
              name: "ProductOptionsValueLabel",
              styles: {
                color: "white"
              }
            }
          ]
        }
      ]
    },
    colorOption: {
      type: "slot",
      defaultValue: [
        {
          type: "vbox",
          styles: {
            width: "50px",
            height: "50px",
            borderWidth: "1px",
            borderColor: "#ccc",
          }
        }
      ]
    },
    activeColorOption: {
      type: "slot",
      defaultValue: [
        {
          type: "vbox",
          styles: {
            width: "50px",
            height: "50px",
            borderWidth: "1px",
            borderColor: "#ccc",
          }
        }
      ]
    },
    editSlots: "boolean"
  },
  importPath: "./components/code-components/products/product-options"
});

PLASMIC.registerComponent(ReactCollapse, {
  name: "ReactCollapse", 
  props: {
    title: "string",
    children: "slot",
    isActive: "boolean",
  },
  importPath: "./components/code-components/ui/react-collapse"
});

PLASMIC.registerComponent(ProductSlider, {
  name: "ProductSlider", 
  props: {
    thumbsCount: "number",
    slideContainer: {
      type: "slot",
      defaultValue: {
        type: "box"
      }
    },
    thumbsContainer: {
      type: "slot",
      defaultValue: {
        type: "box"
      }
    },
  },
  importPath: "./components/code-components/products/product-slider"
});
/*
PLASMIC.registerComponent(SlideContainer, {
  name: "SlideContainer",
  props: {
    imageIndex: "number"
  }
});

PLASMIC.registerComponent(ThumbsContainer, {
  name: "ThumbsContainer",
  props: {
    leftImageIndex: "number",
  }
});*/