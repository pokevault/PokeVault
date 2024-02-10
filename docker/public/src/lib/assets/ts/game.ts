import { GameClient, type Version } from "pokenode-ts";

const client = new GameClient();

export async function getVersionName(game: string): Promise<string | null> {
    let version: Version = await client.getVersionByName(game);
    for (let name of version.names) {
        if (name.language.name === "en") {
            return name.name;
        }
    }
    return null;
}