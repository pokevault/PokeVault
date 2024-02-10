using MongoDB.Driver;
using Standart.Hash.xxHash;
using PokeVault.Utils;
using static PokeVault.Utils.Utils;

namespace PokeVault.Api {

    internal class WebServer {

        private static readonly MongoClient Client = new(Environment.GetEnvironmentVariable("MONGODB_URI") ?? "");

        private async static Task<List<FileMetadata>> GetSaves(IMongoCollection<FileMetadata> collection) {
            var filter = Builders<FileMetadata>.Filter.Empty;
            var documents = await collection.Find(filter).ToListAsync();
            return documents;
        }

        private async static Task<List<FileMetadata>> GetPKX(IMongoCollection<FileMetadata> collection) {
            var filter = Builders<FileMetadata>.Filter.Empty;
            var documents = await collection.Find(filter).ToListAsync();
            return documents;
        }

        private static void WriteSave(bool isSave, string name, byte[] data) {
            string home = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile) + "/.pokevault";
            if (isSave) {
                if (Directory.Exists($"{home}/saves/save")) {
                    File.WriteAllBytes($"{home}/saves/save/{name}", data);
                } else {
                    Directory.CreateDirectory($"{home}/saves/save");
                    File.WriteAllBytes($"{home}/saves/save/{name}", data);
                }
            } else {
                if (Directory.Exists($"{home}/saves/pkx")) {
                    File.WriteAllBytes($"{home}/saves/pkx/{name}", data);
                } else {
                    Directory.CreateDirectory($"{home}/saves/pkx");
                    File.WriteAllBytes($"{home}/saves/pkx/{name}", data);
                }
            }
        }

        private static void Host(string[] args) {
            var builder = WebApplication.CreateBuilder(args);

            var app = builder.Build();
            
            string? port = Environment.GetEnvironmentVariable("PORT") ?? "8080";

            var saveFiles = Client.GetDatabase("saves").GetCollection<FileMetadata>("save_files");
            var pkxFiles = Client.GetDatabase("saves").GetCollection<FileMetadata>("pkx_files");
            var formSubmissions = Client.GetDatabase("pokemon").GetCollection<PokemonFormStore>("form");
            var notesSubmissions = Client.GetDatabase("pokemon").GetCollection<PokemonNotesStore>("notes");

            app.MapPost("/add-pkm", async (PokemonForm form) => {
                if (form.Valid) {
                    PokemonFormStore store = new() {
                        Form = form.Data
                    };

                    await formSubmissions.InsertOneAsync(store);

                    return Results.Ok();
                }
                
                return Results.BadRequest();
            });

            app.MapPost("/add-notes", async (PokemonNotes notes) => {
                if (notes.Valid) {
                    PokemonNotesStore store = new() {
                        Notes = notes
                    };

                    await notesSubmissions.InsertOneAsync(store);

                    return Results.Ok();
                }

                return Results.BadRequest();
            });

            app.MapPost("/upload", async (IFormFile save) => {
                Stream s = save.OpenReadStream();
                byte[] raw = new byte[s.Length];
                int _ = s.Read(raw, 0, raw.Length);
                s.Close();

                string uuid = Guid.CreateVersion7().ToString();

                bool isSave = false;
                if (FileValidator.IsValid(raw)) {
                    if (FileValidator.IsPKM(raw, save.FileName)) {
                        isSave = false;
                    } else if (FileValidator.IsSave(raw)) {
                        isSave = true;
                    }
                } else {
                    return Results.UnprocessableEntity();
                }

                string hash = Convert.ToHexString(xxHash128.ComputeHashBytes(raw, raw.Length));
                
                FileMetadata metadata = new();

                if (isSave) {
                    List<FileMetadata> existingSaves = await GetSaves(saveFiles);
                    List<string?> saveNames = existingSaves.Select(x => x.Name).ToList();
					if (Path.HasExtension(save.FileName)) {
						string[] splitSaveName = save.FileName.Split(".");
						if (saveNames.Contains(save.FileName)) {
							int count = 1;
							while (saveNames.Contains(splitSaveName[0] + " " + $"({count})." + splitSaveName[1])) {
								count++;
							}
							metadata = new() {
								Name = splitSaveName[0] + " " + $"({count})." + splitSaveName[1],
								UUID = uuid,
								Hash = hash,
								Timestamp = DateTime.Now
							};
						} else {
							metadata = new() {
								Name = save.FileName,
								UUID = uuid,
								Hash = hash,
								Timestamp = DateTime.Now
							};
						}
					} else {
						if (saveNames.Contains(save.FileName)) {
							int count = 1;
							while (saveNames.Contains(save.FileName + " " + $"({count})")) {
								count++;
							}
							metadata = new() {
								Name = save.FileName + " " + $"({count})",
								UUID = uuid,
								Hash = hash,
								Timestamp = DateTime.Now
							};
						} else {
							metadata = new() {
								Name = save.FileName,
								UUID = uuid,
								Hash = hash,
								Timestamp = DateTime.Now
							};
						}
					}
                } else {
                    List<FileMetadata> existingPkx = await GetPKX(pkxFiles);
                    List<string?> pkxNames = existingPkx.Select(x => x.Name).ToList();
                    string[] splitPKXName = save.FileName.Split(".");
                    if (pkxNames.Contains(save.FileName)) {
                        int count = 1;
                        while (pkxNames.Contains(splitPKXName[0] + " " + $"({count})." + splitPKXName[1])) {
                            count++;
                        }
                        metadata = new() {
                            Name = splitPKXName[0] + " " + $"({count})." + splitPKXName[1],
                            UUID = uuid,
                            Hash = hash,
                            Timestamp = DateTime.Now
                        };
                    } else {
                        metadata = new() {
                            Name = save.FileName,
                            UUID = uuid,
                            Hash = hash,
                            Timestamp = DateTime.Now
                        };
                    }
                }

                if (!isSave) {
                    await pkxFiles.InsertOneAsync(metadata);
                    WriteSave(isSave, metadata.Name, raw);
                } else {
                    await saveFiles.InsertOneAsync(metadata);
                    WriteSave(isSave, metadata.Name, raw);
                }

                return Results.Json(metadata, statusCode: 201);
            }).DisableAntiforgery();

            app.MapGet("/get-saves", async () => {
                List<FileMetadata> saves = await GetSaves(saveFiles);
                SaveFileList list = new() {
                    Count = saves.Count,
                    Files = saves
                };
                return Results.Ok(list);
            });

            app.MapGet("/get-pkx-files", async () => {
                return Results.Ok(await GetPKX(pkxFiles));
            });

            app.MapGet("/get-boxes-from-save/{uuid}", async (string uuid) => {
                List<FileMetadata> saves = await GetSaves(saveFiles);

                FileMetadata? save = saves.Find(s => s.UUID == uuid);
                string home = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile) + "/.pokevault";
                byte[] saveBytes;

                if (File.Exists($"{home}/saves/save/{save!.Name}")) {
                    saveBytes = File.ReadAllBytes($"{home}/saves/save/{save!.Name}");
                } else {
                    return Results.NotFound("Invalid Save");
                }

                int boxIndex = 1;
                List<BoxMon> box = new();
                List<Box> boxes = new();
                var saveFile = GetSaveType(saveBytes);
                while (boxIndex < saveFile?.BoxCount+1) {
                    box = BoxDumper.DumpBox(saveFile, boxIndex-1).ToList();
                    if (box.Count > 0) {
                        boxes.Add(new Box() { BoxIndex = boxIndex, BoxContents = box });
                        boxIndex++;
                    } else {
                        break;
                    }
                }
                return Results.Ok(boxes);
            });

            app.MapGet("/get-pkm-from-save/{uuid}", async (string uuid, int boxIndex, int boxSlot) => {
                string home = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile) + "/.pokevault";
                List<FileMetadata> saves = await GetSaves(saveFiles);
                FileMetadata? save = saves.Find(s => s.UUID == uuid);
                if (save == null) {
                    return Results.NotFound("Invalid UUID");
                }
                byte[] saveBytes = File.ReadAllBytes($"{home}/saves/save/{save!.Name}");
                
                return Results.Ok(PKDumper.DumpPK(saveBytes, boxIndex, boxSlot));
            });

            app.MapGet("/get-inputted-mons", () => {
                List<BoxMonApi> mons = new();

                var filter = Builders<PokemonFormStore>.Filter.Empty;
                var allMons = formSubmissions.Find(filter).ToList();
                
                if (allMons != null) {
                    for (int i = 0; i < allMons.Count; i++) {
                        PokemonFormData? data = allMons[i].Form;
                        if (data != null) {
                            mons.Add(new BoxMonApi(data, i));
                        } else {
                            return Results.NoContent();
                        }
                    }
                } else {
                    return Results.NoContent();
                }

                return Results.Json(new BoxApi() { BoxIndex = 1, BoxContents = mons }, statusCode: 200);
            });

            app.MapDelete("/delete-save/{uuid}", async (string uuid) => {
                string home = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile) + "/.pokevault";
                List<FileMetadata> saves = await GetSaves(saveFiles);
                FileMetadata? save = saves.Find(s => s.UUID == uuid);
                if (save == null) {
                    return Results.NotFound("Invalid UUID");
                }
                await saveFiles.DeleteOneAsync(Builders<FileMetadata>.Filter.Eq("UUID", uuid));
                File.Delete($"{home}/saves/save/{save!.Name}");
                return Results.Ok();
            });

            app.Run($"http://0.0.0.0:{port}");

        }

        private static void Main(string[] args) {
            Host(args);
        }
    }
}
