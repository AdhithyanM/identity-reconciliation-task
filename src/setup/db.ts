import config from "config";
import { DataSource } from "typeorm";
// entities import
import { Contact } from "../modules/identity/repositories/Contact";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.get<string>("db.host"),
  port: config.get<number>("db.port"),
  username: config.get<string>("db.username"),
  password: config.get<string>("db.password"),
  database: config.get<string>("db.name"),
  entities: [Contact],
  synchronize: true,
  logging: config.get<string>("mode") === "development",
});

export const loadDb = async () => {
  try {
    await AppDataSource.initialize();
    console.log(`Connected to ${config.get("db.name")} database`);
  } catch (error: any) {
    console.log(
      "Error occurred while connecting to DB with TypeORM: ",
      error.message
    );
    process.exit(); // abrubtly fail the server if not connected to db
  }
};
