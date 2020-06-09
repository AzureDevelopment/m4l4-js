const CosmosClient = require('@azure/cosmos').CosmosClient;

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const collection = new CosmosClient(
        process.env['ConnectionStrings:cosmos_connection']
    )
        .database('Test')
        .container('TestContainer').items;

    await collection.upsert({
        id: 'testId',
        someProperty: 1,
        source: 'js',
    });

    const result = await collection
        .query('SELECT * FROM c WHERE c.id ="testId"', { partitionKey: 'js' })
        .fetchAll();

    context.res = {
        body: result.resources,
    };
};
