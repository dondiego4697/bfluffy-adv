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

    async query(text: string) {
    	return dbManager.executeReadQuery(text);
    }

    async loadFixtures(fixtures: Fixture[]) {
    	await this.clean();

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

    async clean(): Promise<void> {
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
