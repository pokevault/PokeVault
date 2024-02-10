using PKHeX.Core;

namespace PokeVault.Utils {

    public class BoxDumper {

        public static IEnumerable<BoxMon> DumpBox(SaveFile? save, int box) {
            if (save == null) yield break;

            PKM[] boxData = save.GetBoxData(box);

            for (int i = 0; i < boxData.Length; i++) {
                if (boxData[i].Species == 0) yield break;
                BoxMon mon = new(boxData[i], i);
                yield return mon;
            }
        }
    }
}
