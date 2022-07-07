export default async function getOrder(cl, orderId) {
  return await cl.orders
    .retrieve(orderId, {
      include: ["line_items"],
    })
    .catch((e) => console.log(e));
}
