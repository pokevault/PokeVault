using PKHeX.Core;

namespace PokeVault.Utils {

    public class PKDumper {

        public static PokemonData? DumpPK(byte[] save, int box, int slot) {
            SaveFile saveFile = SaveUtil.GetVariantSAV(save)!;
            PKM pk = saveFile.GetBoxSlotAtIndex(box-1, slot-1);
            PokemonData data = new(pk);
            return data;
        }
    }
}
