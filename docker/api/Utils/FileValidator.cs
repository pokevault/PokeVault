using PKHeX.Core;

namespace PokeVault.Utils {

    public class FileValidator {
        public static bool IsValid(byte[] file) {
            return FileUtil.IsFileTooSmall(file.Length) || FileUtil.IsFileTooBig(file.Length) ? false : true;
        }

        public static bool IsPKM(byte[] file, string name) {
            char[] ext = name.Split('.').Last().ToCharArray();
            bool valid = FileUtil.TryGetPKM(file, out var pk, ext);
            return valid;
        }

        public static bool IsSave(byte[] file) {
            bool valid = FileUtil.TryGetSAV(file, out var sav);
            return valid;
        }
    }
}