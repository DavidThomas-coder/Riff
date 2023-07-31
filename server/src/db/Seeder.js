/* eslint-disable no-console */
import { connection } from "../boot.js"
import PromptSeeder from "./seeders/PromptSeeder.js"

class Seeder {
  static async seed() {
    // include individual seed commands here
    console.log("Seeding Prompts...")
    await PromptSeeder.seed()

    console.log("Done!")
    await connection.destroy()
  }
}

export default Seeder