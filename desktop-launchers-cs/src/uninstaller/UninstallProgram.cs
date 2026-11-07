/* ============================================================================
 * GIRI ORBIT — DEDICATED WINDOWS UNINSTALLATION WIZARD (UninstallProgram.cs)
 * Made by Abhinav Giri (github.com/abhinavgiri45 | @abhinavgiri45)
 * Complete, Clean, Self-Removing Windows Uninstallation Experience
 * ============================================================================
 */

using System;
using System.IO;
using System.Drawing;
using System.Threading;
using System.Diagnostics;
using System.Windows.Forms;
using Microsoft.Win32;
using System.Reflection;
using System.Runtime.InteropServices;

namespace GiriOrbit.Uninstaller
{
    static class Program
    {
        [DllImport("user32.dll")]
        private static extern bool SetProcessDPIAware();

        [STAThread]
        static void Main(string[] args)
        {
            try { SetProcessDPIAware(); } catch { }
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new UninstallWizardForm());
        }
    }

    public class UninstallWizardForm : Form
    {
        private Image originalLogo;
        private Icon appIcon;

        private Panel headerPanel;
        private Label titleLabel;
        private Label subtitleLabel;
        private PictureBox headerLogoPic;
        private Panel contentPanel;
        private ProgressBar progressBar;
        private Label statusLabel;
        private Button nextButton;
        private Button cancelButton;
        private int currentStep = 1;

        public UninstallWizardForm()
        {
            LoadEmbeddedBrandAssets();
            InitializeComponent();
            ShowConfirmationPage();
        }

        private void LoadEmbeddedBrandAssets()
        {
            try
            {
                Assembly asm = Assembly.GetExecutingAssembly();
                using (Stream s = asm.GetManifestResourceStream("GiriOrbit.OriginalLogo"))
                {
                    if (s != null) originalLogo = Image.FromStream(s);
                }
                using (Stream s = asm.GetManifestResourceStream("GiriOrbit.AppIcon"))
                {
                    if (s != null) appIcon = new Icon(s);
                }
            }
            catch { }

            if (originalLogo == null)
            {
                string diskLogo = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "assets", "giri-logo-symbol.png");
                if (File.Exists(diskLogo))
                {
                    try { originalLogo = Image.FromFile(diskLogo); } catch { }
                }
            }
            if (appIcon == null)
            {
                string diskIcon = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "assets", "app.ico");
                if (File.Exists(diskIcon))
                {
                    try { appIcon = new Icon(diskIcon); } catch { }
                }
            }
        }

        private void InitializeComponent()
        {
            this.Text = "Uninstall — Giri Orbit Sovereign Suite";
            this.Size = new Size(540, 380);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(248, 250, 252);
            if (appIcon != null)
            {
                this.Icon = appIcon;
            }

            // Top Header
            headerPanel = new Panel();
            headerPanel.Dock = DockStyle.Top;
            headerPanel.Height = 72;
            headerPanel.BackColor = Color.FromArgb(15, 23, 42); // Deep slate

            titleLabel = new Label();
            titleLabel.Text = "Uninstall Giri Orbit Sovereign Suite";
            titleLabel.Font = new Font("Segoe UI", 11.5f, FontStyle.Bold);
            titleLabel.ForeColor = Color.White;
            titleLabel.Location = new Point(20, 14);
            titleLabel.AutoSize = true;
            headerPanel.Controls.Add(titleLabel);

            subtitleLabel = new Label();
            subtitleLabel.Text = "Remove Giri Orbit and all associated components from your computer.";
            subtitleLabel.Font = new Font("Segoe UI", 8.5f);
            subtitleLabel.ForeColor = Color.FromArgb(148, 163, 184);
            subtitleLabel.Location = new Point(20, 40);
            subtitleLabel.AutoSize = true;
            headerPanel.Controls.Add(subtitleLabel);

            if (originalLogo != null)
            {
                headerLogoPic = new PictureBox();
                headerLogoPic.Image = originalLogo;
                headerLogoPic.SizeMode = PictureBoxSizeMode.Zoom;
                headerLogoPic.Size = new Size(46, 46);
                headerLogoPic.Location = new Point(470, 13);
                headerLogoPic.BackColor = Color.Transparent;
                headerPanel.Controls.Add(headerLogoPic);
            }

            // Bottom Buttons Panel
            Panel bottomPanel = new Panel();
            bottomPanel.Dock = DockStyle.Bottom;
            bottomPanel.Height = 54;
            bottomPanel.BackColor = Color.FromArgb(241, 245, 249);

            Panel borderLine = new Panel();
            borderLine.Dock = DockStyle.Top;
            borderLine.Height = 1;
            borderLine.BackColor = Color.FromArgb(226, 232, 240);
            bottomPanel.Controls.Add(borderLine);

            cancelButton = new Button();
            cancelButton.Text = "Cancel";
            cancelButton.Size = new Size(82, 28);
            cancelButton.Location = new Point(435, 13);
            cancelButton.Font = new Font("Segoe UI", 9f);
            cancelButton.Click += (s, e) => this.Close();
            bottomPanel.Controls.Add(cancelButton);

            nextButton = new Button();
            nextButton.Text = "Uninstall";
            nextButton.Size = new Size(86, 28);
            nextButton.Location = new Point(340, 13);
            nextButton.Font = new Font("Segoe UI", 9f, FontStyle.Bold);
            nextButton.BackColor = Color.FromArgb(220, 38, 38); // Crimson red
            nextButton.ForeColor = Color.White;
            nextButton.FlatStyle = FlatStyle.Flat;
            nextButton.FlatAppearance.BorderSize = 0;
            nextButton.Click += (s, e) => OnNextClick();
            bottomPanel.Controls.Add(nextButton);

            // Center Content
            contentPanel = new Panel();
            contentPanel.Dock = DockStyle.Fill;
            contentPanel.Padding = new Padding(25);

            // Add in proper docking order: Fill control first, then Top and Bottom
            this.Controls.Add(contentPanel);
            this.Controls.Add(headerPanel);
            this.Controls.Add(bottomPanel);
        }

        private void OnNextClick()
        {
            if (currentStep == 1)
            {
                currentStep = 2;
                nextButton.Enabled = false;
                cancelButton.Enabled = false;
                ShowProgressPage();
                StartUninstall();
            }
            else if (currentStep == 3)
            {
                this.Close();
            }
        }

        private void ShowConfirmationPage()
        {
            contentPanel.Controls.Clear();

            Label question = new Label();
            question.Text = "Are you sure you want to completely remove Giri Orbit?";
            question.Font = new Font("Segoe UI", 10.5f, FontStyle.Bold);
            question.ForeColor = Color.FromArgb(15, 23, 42);
            question.Dock = DockStyle.Top;
            question.Height = 30;

            Label details = new Label();
            details.Text = "This will remove the following components from your computer:\r\n\r\n" +
                           "  • Giri Drift, Axis, Kinetic, and Aegis desktop engines\r\n" +
                           "  • Offline application files and embedded runtime\r\n" +
                           "  • Desktop and Start Menu program shortcuts\r\n" +
                           "  • Sovereign file associations (.giri, .gdrift, .gaxis, .gkinetic, .gaegis)\r\n\r\n" +
                           "Click 'Uninstall' to proceed.";
            details.Font = new Font("Segoe UI", 9f);
            details.ForeColor = Color.FromArgb(71, 85, 105);
            details.Dock = DockStyle.Fill;

            contentPanel.Controls.Add(details);
            contentPanel.Controls.Add(question);
        }

        private void ShowProgressPage()
        {
            contentPanel.Controls.Clear();

            statusLabel = new Label();
            statusLabel.Text = "Uninstalling Giri Orbit components...";
            statusLabel.Font = new Font("Segoe UI", 9.5f, FontStyle.Bold);
            statusLabel.ForeColor = Color.FromArgb(15, 23, 42);
            statusLabel.Dock = DockStyle.Top;
            statusLabel.Height = 35;
            contentPanel.Controls.Add(statusLabel);

            progressBar = new ProgressBar();
            progressBar.Dock = DockStyle.Top;
            progressBar.Height = 24;
            progressBar.Style = ProgressBarStyle.Continuous;
            progressBar.Value = 10;
            contentPanel.Controls.Add(progressBar);
        }

        private void ShowFinishedPage()
        {
            currentStep = 3;
            contentPanel.Controls.Clear();

            titleLabel.Text = "Uninstallation Complete";
            subtitleLabel.Text = "Giri Orbit was successfully removed from your computer.";
            nextButton.Text = "Finish";
            nextButton.BackColor = Color.FromArgb(37, 99, 235);
            nextButton.Enabled = true;
            cancelButton.Visible = false;

            TableLayoutPanel table = new TableLayoutPanel();
            table.Dock = DockStyle.Fill;
            table.RowCount = 2;
            table.ColumnCount = 1;
            table.RowStyles.Add(new RowStyle(SizeType.Absolute, 60));
            table.RowStyles.Add(new RowStyle(SizeType.Percent, 100));

            Label successTitle = new Label();
            successTitle.Text = "✓ Giri Orbit Successfully Removed";
            successTitle.Font = new Font("Segoe UI", 12f, FontStyle.Bold);
            successTitle.ForeColor = Color.FromArgb(16, 185, 129);
            table.Controls.Add(successTitle, 0, 0);

            Label successDesc = new Label();
            successDesc.Text = "All application files, shortcuts, and registry settings have been cleaned up.\r\n\r\n" +
                               "Thank you for using Giri Orbit Sovereign Suite.\r\n\r\n" +
                               "Click Finish to close this wizard.";
            successDesc.Font = new Font("Segoe UI", 9.5f);
            successDesc.ForeColor = Color.FromArgb(51, 65, 85);
            table.Controls.Add(successDesc, 0, 1);

            contentPanel.Controls.Add(table);
        }

        private void StartUninstall()
        {
            Thread t = new Thread(PerformUninstallWork);
            t.IsBackground = true;
            t.Start();
        }

        private void UpdateStatus(string text, int percent)
        {
            if (this.InvokeRequired)
            {
                this.Invoke(new Action<string, int>(UpdateStatus), text, percent);
                return;
            }
            if (statusLabel != null) statusLabel.Text = text;
            if (progressBar != null) progressBar.Value = Math.Max(0, Math.Min(100, percent));
        }

        private void PerformUninstallWork()
        {
            try
            {
                // 1. Terminate any active Giri Orbit processes
                UpdateStatus("Closing running Giri Orbit processes...", 20);
                try
                {
                    foreach (Process p in Process.GetProcessesByName("GiriOrbit"))
                    {
                        try { p.Kill(); p.WaitForExit(1000); } catch { }
                    }
                }
                catch { }
                Thread.Sleep(200);

                // 2. Remove Shortcuts
                UpdateStatus("Removing Desktop and Start Menu shortcuts...", 40);
                string desktopLnk = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory), "Giri Orbit.lnk");
                if (File.Exists(desktopLnk))
                {
                    try { File.Delete(desktopLnk); } catch { }
                }

                string startMenu = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.StartMenu), "Programs", "Giri Orbit");
                if (Directory.Exists(startMenu))
                {
                    try { Directory.Delete(startMenu, true); } catch { }
                }
                Thread.Sleep(200);

                // 3. Remove Registry Entries
                UpdateStatus("Cleaning up registry and file associations...", 65);
                try
                {
                    Registry.CurrentUser.DeleteSubKeyTree(@"Software\Microsoft\Windows\CurrentVersion\Uninstall\GiriOrbit", false);
                    Registry.CurrentUser.DeleteSubKeyTree(@"Software\Classes\GiriOrbit.Project", false);
                    Registry.CurrentUser.DeleteSubKeyTree(@"Software\Classes\GiriOrbit.Writer", false);
                    Registry.CurrentUser.DeleteSubKeyTree(@"Software\Classes\GiriOrbit.Calc", false);
                    Registry.CurrentUser.DeleteSubKeyTree(@"Software\Classes\GiriOrbit.Impress", false);
                    Registry.CurrentUser.DeleteSubKeyTree(@"Software\Classes\GiriOrbit.Aegis", false);
                }
                catch { }
                Thread.Sleep(200);

                // 4. Clean application directory
                UpdateStatus("Removing application files...", 85);
                string appDir = AppDomain.CurrentDomain.BaseDirectory;
                string appDataDir = Path.Combine(appDir, "app_data");
                if (Directory.Exists(appDataDir))
                {
                    try { Directory.Delete(appDataDir, true); } catch { }
                }
                string assetsDir = Path.Combine(appDir, "assets");
                if (Directory.Exists(assetsDir))
                {
                    try { Directory.Delete(assetsDir, true); } catch { }
                }

                // Delete GiriOrbit.exe
                string appExe = Path.Combine(appDir, "GiriOrbit.exe");
                if (File.Exists(appExe))
                {
                    try { File.Delete(appExe); } catch { }
                }

                // Schedule self deletion
                ScheduleSelfDeletion(appDir);

                UpdateStatus("Uninstallation complete!", 100);
                Thread.Sleep(300);

                this.Invoke(new Action(ShowFinishedPage));
            }
            catch (Exception ex)
            {
                this.Invoke(new Action(() => {
                    MessageBox.Show("An error occurred during uninstallation:\r\n" + ex.Message, "Uninstall", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    ShowFinishedPage();
                }));
            }
        }

        private void ScheduleSelfDeletion(string dirToClean)
        {
            try
            {
                string uninstallerExe = Process.GetCurrentProcess().MainModule.FileName;
                string cmd = string.Format("/c ping 127.0.0.1 -n 2 > nul & del \"{0}\" & rmdir /s /q \"{1}\"", uninstallerExe, dirToClean);
                ProcessStartInfo psi = new ProcessStartInfo("cmd.exe", cmd)
                {
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    WindowStyle = ProcessWindowStyle.Hidden
                };
                Process.Start(psi);
            }
            catch { }
        }
    }
}
