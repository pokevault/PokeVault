using PKHeX.Core;

namespace PokeVault.Utils {

    public class Utils {
        public static SaveFile? GetSaveType(byte[] bytes) {
            return SaveUtil.GetVariantSAV(bytes);
        }

        internal static string GetForm(PKM pk) {
            GameStrings strings = GameInfo.Strings;
            string[] forms;
            if (pk.Species == (int)Species.Alcremie) {
                forms = FormConverter.GetAlcremieFormList(strings.forms);
            } else {
                forms = FormConverter.GetFormList(pk.Species, strings.Types, strings.forms, GameInfo.GenderSymbolASCII, pk.Context);
            }

            return forms[pk.Form];
        }

        internal static List<string> GetMoves(PKM pk) {
            List<string> moves = new();
            for (int i = 0; i < pk.Moves.Length; i++) {
                moves.Add(((Move)pk.Moves[i]).ToString());
            }
            return moves;
        }
    }
}