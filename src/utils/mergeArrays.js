async function MergeArrays(arr1 = [], arr2 = []) {
  let res = [];
  res = await Promise.all(
    arr1.map((obj) => {
      const index = arr2.findIndex((el) => el["code"] == obj["code"]);
      if (arr2[index]) {
        return {
          ...obj,
          prices: arr2[index].prices ? arr2[index].prices : [],
          stock_items: arr2[index].stock_items ? arr2[index].stock_items : [],
          quantity: arr2[index].quantity ? arr2[index].quantity : ""
        };
      }

      return obj;
    })
  );
  return res;
}

export { MergeArrays };
