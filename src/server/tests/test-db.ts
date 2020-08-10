import * as Knex from 'knex';
import {DbTable} from 'server/types/consts';
import {dbManager} from 'server/lib/db-manager';

interface Fixture {
    table: string;
    rows: Record<string, unknown>[];
}

const knex = Knex({client: 'pg'});

export class TestDb {
    private static readonly schema = 'public';

    async loadFixtures(fixtures: Fixture[]) {
    	await TestDb.clean();

    	return dbManager.executeInTransaction(async (client) => {
    		// Insert tables in the given order for satisfy constraints.
    		for (const {table, rows} of fixtures) {
    			for (const row of rows) {
    				const query = knex(table).insert(row);
    				await client.query(query.toString());
    			}
    		}
    	});
    }

    static async clean(): Promise<void> {
    	const tableNamesQuery = knex(knex.raw('information_schema.tables'))
    		.select({tableName: 'table_name'})
    		.whereRaw(`table_schema='${TestDb.schema}'`)
    		.andWhereRaw('table_type = \'BASE TABLE\'');

    	const tableNamesResult = await dbManager.executeReadQuery(tableNamesQuery.toString());

    	if (tableNamesResult.rowCount === 0) {
    		return;
    	}

    	const tableNames = tableNamesResult.rows
    		.filter(({tableName}) => tableName !== DbTable.ALEMBIC_VERSION)
    		.map(({tableName}) => `${TestDb.schema}."${tableName}"`)
    		.join(', ');

    	await dbManager.executeModifyQuery(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY`);
    }
}

// TODO распараллелить тесты
// export interface TestDbClient {
// 	dbClient: pg.PoolClient,
// 	cancelTransaction: () => void;
// }

// export async function getTestDbClient(): Promise<TestDbClient> {
// 	return new Promise((resolve) => dbManager.executeInTransaction(async (client) => {
// 		const transaction = new TestTransaction(client);
// 	 	await transaction.clean();

// 		await new Promise((cancelTransaction) => resolve({
// 	  		dbClient: client,
// 	  		cancelTransaction
// 	 	}));
// 	}));
// }

// class TestTransaction {
// 	private static readonly schema = 'public';
// 	private readonly client: pg.PoolClient;

// 	constructor(client: pg.PoolClient) {
// 		this.client = client;
// 	}

// 	async clean(): Promise<void> {
// 		const tableNamesQuery = knex(knex.raw('information_schema.tables'))
// 			.select({tableName: 'table_name'})
// 		 	.whereRaw(`table_schema='${TestTransaction.schema}'`)
// 		 	.andWhereRaw('table_type = \'BASE TABLE\'');

// 		const tableNamesResult = await this.client.query(tableNamesQuery.toString());

// 		if (tableNamesResult.rowCount === 0) {
// 			return;
// 		}

// 		const tableNames = tableNamesResult.rows
// 		 	.filter(({tableName}) => tableName !== DbTable.ALEMBIC_VERSION)
// 		 	.map(({tableName}) => `${TestTransaction.schema}."${tableName}"`)
// 		 	.join(', ');

// 	 	await this.client.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY`);
// 	}
// }
