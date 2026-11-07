/* ============================================================================
 * GIRI DRIFT — DEDICATED WINDOWS DESKTOP LAUNCHER (DriftLauncher.cs)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * Sovereign Document Composer & Word Processor Entrypoint
 * ============================================================================
 */

using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace GiriOrbit.Drift
{
    static class Program
    {
        [DllImport("user32.dll")]
        private static extern bool SetProcessDPIAware();

        [STAThread]
        static void Main(string[] args)
        {
            try { SetProcessDPIAware(); } catch { }
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string targetExe = Path.Combine(baseDir, "GiriOrbit.exe");
            string cmdArgs = "-drift";
            if (args != null && args.Length > 0 && !string.IsNullOrEmpty(args[0]))
            {
                cmdArgs += " \"" + args[0] + "\"";
            }
            if (File.Exists(targetExe))
            {
                Process.Start(new ProcessStartInfo(targetExe, cmdArgs) { WorkingDirectory = baseDir });
            }
            else
            {
                MessageBox.Show("Giri Drift core application not found:\n" + targetExe, "Giri Drift", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
