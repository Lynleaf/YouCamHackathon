import client from "./channel3";

export async function searchProducts(query) {
    const results = await client.products.search({
        query,
        limit: 5,
    });

    return results.products.map(product => ({
        id: product.id,
        title: product.title,
        image: product.images[0]?.url,
        price: product.offers[0]?.price.price,
        currency: product.offers[0]?.price.currency,
        buyUrl: product.offers[0]?.url,
    }));
}