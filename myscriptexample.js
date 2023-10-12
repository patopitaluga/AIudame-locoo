
export const getOnlyProductsOnSale = (products) => {
  const filteredProducts = [];
  products.forEach(eachProduct => {
    if (eachProduct.onSale)
      filteredProducts.push(eachProduct);
  });
  return filteredProducts;
};
