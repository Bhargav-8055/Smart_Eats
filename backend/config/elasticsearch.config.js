import { Client } from '@elastic/elasticsearch';

const elasticClient = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const connectElasticsearch = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            await elasticClient.ping();
            console.log('✅ Elasticsearch connected successfully');

            // Create items index if it doesn't exist
            const indexExists = await elasticClient.indices.exists({ index: 'items' });
            if (!indexExists) {
                await elasticClient.indices.create({
                    index: 'items',
                    body: {
                        mappings: {
                            properties: {
                                name: { type: 'text' },
                                category: { type: 'text' },
                                foodType: { type: 'keyword' },
                                price: { type: 'float' },
                                shop: { type: 'keyword' }
                            }
                        }
                    }
                });
                console.log('✅ Elasticsearch "items" index created');
            }
            return;
        } catch (error) {
            console.error(`❌ Elasticsearch connection error (retries left: ${retries}):`, error.message);
            retries -= 1;
            await wait(5000);
        }
    }
    console.error('❌ Could not connect to Elasticsearch after multiple retries');
};

export const indexItem = async (item) => {
    try {
        await elasticClient.index({
            index: 'items',
            id: item._id.toString(),
            body: {
                name: item.name,
                category: item.category,
                foodType: item.foodType,
                price: item.price,
                shop: item.shop.toString()
            }
        });
        console.log(`📝 Item indexed in Elasticsearch: ${item._id}`);
    } catch (error) {
        console.error('Elasticsearch Index Error:', error);
    }
};

export const deleteItemFromIndex = async (itemId) => {
    try {
        await elasticClient.delete({
            index: 'items',
            id: itemId.toString()
        });
        console.log(`🗑️ Item deleted from Elasticsearch: ${itemId}`);
    } catch (error) {
        console.error('Elasticsearch Delete Error:', error);
    }
};

export default elasticClient;
