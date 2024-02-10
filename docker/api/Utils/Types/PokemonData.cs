using System.Text.Json.Serialization;
using PKHeX.Core;

namespace PokeVault.Utils {
    public class PokemonData {
        
        public int Species {get; set;}

        public byte Generation {get; set;}

        public string? Sex {get; set;}

        public string? Form {get; set;}

        public bool IsShiny {get; set;}
        
        public string? Nickname {get; set;}

        public string? Game {get; set;}

        public string? OT {get; set;}

        public DateOnly? MetDate {get; set;}
        
        public uint EXP {get; set;}

        public byte Level {get; set;}
        
        public List<string>? Moves {get; set;}
        
        [JsonPropertyName("evs")]
        public int[]? EVs {get; set;}

        [JsonPropertyName("ivs")]
        public int[]? IVs {get; set;}

        public PokemonData(PKM pk) {
            Species = pk.Species;
            Generation = EntityContextExtensions.Generation(pk.Context);
            Sex = ((Gender)pk.Gender).ToString().ToLower();
            Form = Utils.GetForm(pk);
            IsShiny = pk.IsShiny;
            Nickname = pk.Nickname;
            Game = GameInfo.GetVersionName(pk.Version).ToLower();
            OT = pk.OriginalTrainerName;
            MetDate = pk.MetDate;
            EXP = pk.EXP;
            Level = pk.CurrentLevel;
            Moves = Utils.GetMoves(pk);
            EVs = [pk.EV_HP, pk.EV_ATK, pk.EV_DEF, pk.EV_SPE, pk.EV_SPA, pk.EV_SPD];
            IVs = pk.IVs;
        }
    }
}