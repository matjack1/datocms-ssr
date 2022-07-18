export default async function getAddresses(cl) {
  return await cl.customer_addresses
    .list({ include: ["address"] })
    .catch((e) => console.log(e));
}
