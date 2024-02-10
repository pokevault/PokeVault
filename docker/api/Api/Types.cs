using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using PokeVault.Utils;

namespace PokeVault.Api {

    public class FileMetadata {
        [BsonElement("_id")]
        public ObjectId Id {get; set;}
        public string? Name {get; set;}
        public string? UUID {get; set;}
        public string? Hash {get; set;}
        public DateTime Timestamp {get; set;}
    }

    public class Box {
        public int BoxIndex {get; set;}
        public IList<BoxMon>? BoxContents {get; set;}
    }

    public class BoxApi {
        public int BoxIndex {get; set;}
        public IList<BoxMonApi>? BoxContents {get; set;}
    }

    public class SaveFileList {
        [JsonPropertyName("count")]
        public int Count {get; set;}

        [JsonPropertyName("items")]
        public IList<FileMetadata>? Files {get; set;}
    }


    public class PokemonForm {
        [JsonPropertyName("id")]
        public string FormId {get; set;} = "";

        [JsonPropertyName("valid")]
        public bool Valid {get; set;}

        [JsonPropertyName("posted")]
        public bool Posted {get; set;}

        [JsonPropertyName("errors")]
        public IDictionary<string, dynamic>? Errors {get; set;}

        [JsonPropertyName("data")]
        public PokemonFormData? Data {get; set;}
    }

    public class PokemonFormStore {
		[BsonElement("_id")]
        public ObjectId Id {get; set;}

        public PokemonFormData? Form {get; set;}
    }

    public class PokemonFormData {
        [JsonPropertyName("generation")]
        public int Generation {get; set;}

        [JsonPropertyName("game")]
        public string Game {get; set;} = "";

        [JsonPropertyName("trainerGender")]
        public string TrainerGender {get; set;} = "";

        [JsonPropertyName("trainerNickName")]
        public string TrainerNickName {get; set;} = "";

        [JsonPropertyName("trainerID")]
        public int TrainerID {get; set;}

        [JsonPropertyName("species")]
        public int Species {get; set;}

        [JsonPropertyName("level")]
        public int Level {get; set;}

        [JsonPropertyName("isShiny")]
        public bool IsShiny {get; set;}

        [JsonPropertyName("metDate")]
        public string MetDate {get; set;} = "";

        [JsonPropertyName("metLocation")]
        public string MetLocation {get; set;} = "";

        [JsonPropertyName("evHp")]
        public int EVHp {get; set;} = 0;

        [JsonPropertyName("evAttack")]
        public int EVAttack {get; set;} = 0;

        [JsonPropertyName("evDefense")]
        public int EVDefense {get; set;} = 0;

        [JsonPropertyName("evSpeed")]
        public int EVSpeed {get; set;} = 0;

        [JsonPropertyName("evSpecial")]
        public int? EVSpecial {get; set;} = 0;

        [JsonPropertyName("evSpecDef")]
        public int? EVSpecDef {get; set;} = 0;

        [JsonPropertyName("evSpecAtk")]
        public int? EVSpecAtk {get; set;} = 0;

        [JsonPropertyName("moves")]
        public IList<string> Moves {get; set;} = new List<string>();

        [JsonPropertyName("additionalNotes")]
        public string? AdditionalNotes {get; set;} = "";
    }

    public class PokemonNotes {
        [JsonPropertyName("id")]
        public string FormId {get; set;} = "";

        [JsonPropertyName("valid")]
        public bool Valid {get; set;}

        [JsonPropertyName("posted")]
        public bool Posted {get; set;}

        [JsonPropertyName("errors")]
        public IDictionary<string, dynamic>? Errors {get; set;}

        public IDictionary<string, string>? Data {get; set;}
    }

    public class PokemonNotesStore {
        [BsonElement("_id")]
        public ObjectId Id {get; set;}

        public PokemonNotes? Notes {get; set;}
    }

    public class BoxMonApi {
        public int BoxSlot {get; set;}
        public int Species {get; set;}
        public bool IsShiny {get; set;}
        public bool IsEgg {get; set;}

        public BoxMonApi(PokemonFormData pk, int slot) {
            BoxSlot = slot;
            Species = pk.Species;
            IsShiny = pk.IsShiny;
            IsEgg = false;
        }
    }
}