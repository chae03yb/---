import { Connection, ConnectionConfig, createConnection } from "mariadb";

export class DatabaseIO {
    private connection: Connection;

    constructor(option: ConnectionConfig) {
        createConnection(option)
            .then((conn: Connection) => {
                this.connection = conn;
            })
            .catch((err: Error) => {
                throw err;
            });
    }

    async batch(sql: string, values?: Array<any>): Promise<any> {
        return await this.connection.batch(sql, values);
    }

    async commit(): Promise<void> {
        await this.connection.commit();
    }
}