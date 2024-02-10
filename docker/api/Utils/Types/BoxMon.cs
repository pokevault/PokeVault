using PKHeX.Core;

namespace PokeVault.Utils {

    public class BoxMon {
        public int BoxSlot {get; set;}
        public int Species {get; set;}
        public bool IsShiny {get; set;}
        public bool IsEgg {get; set;}

        public BoxMon(PKM pk, int slot) {
            BoxSlot = slot;
            Species = pk.Species;
            IsShiny = pk.IsShiny;
            IsEgg = pk.IsEgg;
        }
    }
}