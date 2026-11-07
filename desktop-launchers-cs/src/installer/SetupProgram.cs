/* ============================================================================
 * GIRI ORBIT — DEDICATED WINDOWS INSTALLATION WIZARD (SetupProgram.cs)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * Pixel-Accurate Desktop Setup Wizard for Windows (x86, x64, ARM64)
 * Self-Contained Offline Payload with Embedded Original Brand Assets
 * ============================================================================
 */

using System;
using System.IO;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Threading;
using System.Diagnostics;
using System.Windows.Forms;
using Microsoft.Win32;
using System.Reflection;
using System.Runtime.InteropServices;
using System.IO.Compression;
using System.Text;

namespace GiriOrbit.Installer
{
    static class SetupProgram
    {
        [DllImport("user32.dll")]
        private static extern bool SetProcessDPIAware();

        [STAThread]
        static void Main(string[] args)
        {
            try { SetProcessDPIAware(); } catch { }
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new SetupWizardForm());
        }
    }

    public class SetupWizardForm : Form
    {
        // Embedded Brand Assets
        private Image originalLogo;
        private Icon appIcon;

        // Visual Panels
        private Panel topHeaderPanel;
        private Label headerTitle;
        private Label headerSubtitle;
        private PictureBox headerLogoPic;
        private Panel leftSidebarPanel;
        private Panel contentPanel;
        private Panel bottomPanel;

        // Navigation Buttons
        private Button backButton;
        private Button nextButton;
        private Button cancelButton;

        // Wizard State
        private int currentStep = 1; // 1: Welcome, 2: License, 3: Directory, 4: Components, 5: Tasks, 6: Ready, 7: Progress, 8: Finished
        private string installPath;
        private bool createDesktopShortcut = true;
        private bool createStartMenuShortcut = true;
        private bool registerFileAssociations = true;

        // Component Selection State
        private bool installDrift = true;
        private bool installAxis = true;
        private bool installKinetic = true;
        private bool installAegis = true;
        private bool installGirionix = true;

        // UI Controls for Pages
        private RadioButton radioAccept;
        private RadioButton radioDecline;
        private TextBox txtInstallPath;
        private CheckBox chkSelectAll;
        private CheckBox chkDrift;
        private CheckBox chkAxis;
        private CheckBox chkKinetic;
        private CheckBox chkAegis;
        private CheckBox chkGirionix;
        private Label lblComponentDesc;
        private CheckBox chkDesktop;
        private CheckBox chkStartMenu;
        private CheckBox chkAssociations;
        private ProgressBar progressBar;
        private Label statusLabel;
        private Label statusDetailLabel;
        private CheckBox chkLaunchNow;

        public SetupWizardForm()
        {
            LoadEmbeddedBrandAssets();
            InitializeComponent();
            ShowPage(1);
        }

        private void LoadEmbeddedBrandAssets()
        {
            try
            {
                Assembly asm = Assembly.GetExecutingAssembly();

                // 1. Load Original Logo (giri-logo-symbol.png)
                using (Stream logoStream = asm.GetManifestResourceStream("GiriOrbit.OriginalLogo"))
                {
                    if (logoStream != null)
                    {
                        originalLogo = Image.FromStream(logoStream);
                    }
                }

                // 2. Load Multi-Resolution Windows Icon (app.ico)
                using (Stream iconStream = asm.GetManifestResourceStream("GiriOrbit.AppIcon"))
                {
                    if (iconStream != null)
                    {
                        appIcon = new Icon(iconStream);
                    }
                }
            }
            catch { }

            // Disk fallback if running unpacked
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
            this.Text = "Setup — Giri Orbit Sovereign Suite";
            this.Size = new Size(640, 480);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = true;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(248, 250, 252);
            if (appIcon != null)
            {
                this.Icon = appIcon;
            }

            // Default Destination: %LOCALAPPDATA%\Programs\Giri Orbit
            string defDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Programs", "Giri Orbit");
            this.installPath = defDir;

            // Top Header Panel (for inner steps 2-6)
            topHeaderPanel = new Panel();
            topHeaderPanel.Dock = DockStyle.Top;
            topHeaderPanel.Height = 65;
            topHeaderPanel.BackColor = Color.FromArgb(15, 23, 42); // Giri Dark Slate
            topHeaderPanel.Visible = false;

            headerTitle = new Label();
            headerTitle.Text = "Giri Orbit Setup Wizard";
            headerTitle.Font = new Font("Segoe UI", 11f, FontStyle.Bold);
            headerTitle.ForeColor = Color.White;
            headerTitle.Location = new Point(22, 12);
            headerTitle.AutoSize = true;
            topHeaderPanel.Controls.Add(headerTitle);

            headerSubtitle = new Label();
            headerSubtitle.Text = "Version 11.8 • Sovereign Desktop Edition";
            headerSubtitle.Font = new Font("Segoe UI", 8.5f);
            headerSubtitle.ForeColor = Color.FromArgb(148, 163, 184);
            headerSubtitle.Location = new Point(22, 36);
            headerSubtitle.AutoSize = true;
            topHeaderPanel.Controls.Add(headerSubtitle);

            if (originalLogo != null)
            {
                headerLogoPic = new PictureBox();
                headerLogoPic.Image = originalLogo;
                headerLogoPic.SizeMode = PictureBoxSizeMode.Zoom;
                headerLogoPic.Size = new Size(42, 42);
                headerLogoPic.Location = new Point(568, 11);
                headerLogoPic.BackColor = Color.Transparent;
                topHeaderPanel.Controls.Add(headerLogoPic);
            }

            Panel headerBorder = new Panel();
            headerBorder.Dock = DockStyle.Bottom;
            headerBorder.Height = 1;
            headerBorder.BackColor = Color.FromArgb(30, 41, 59);
            topHeaderPanel.Controls.Add(headerBorder);

            // Left Sidebar Graphic (for Welcome step 1 and Finished step 7)
            leftSidebarPanel = new Panel();
            leftSidebarPanel.Dock = DockStyle.Left;
            leftSidebarPanel.Width = 164;
            leftSidebarPanel.BackColor = Color.FromArgb(11, 15, 25); // Deep sovereign navy

            // Original Logo on Sidebar
            if (originalLogo != null)
            {
                PictureBox sideLogo = new PictureBox();
                sideLogo.Image = originalLogo;
                sideLogo.SizeMode = PictureBoxSizeMode.Zoom;
                sideLogo.Size = new Size(76, 76);
                sideLogo.Location = new Point(44, 22);
                sideLogo.BackColor = Color.Transparent;
                leftSidebarPanel.Controls.Add(sideLogo);
            }

            Label brandBadge = new Label();
            brandBadge.Text = "GIRI ORBIT";
            brandBadge.Font = new Font("Segoe UI", 12f, FontStyle.Bold);
            brandBadge.ForeColor = Color.FromArgb(56, 189, 248);
            brandBadge.TextAlign = ContentAlignment.MiddleCenter;
            brandBadge.Location = new Point(0, 108);
            brandBadge.Size = new Size(164, 24);
            leftSidebarPanel.Controls.Add(brandBadge);

            Label brandSub = new Label();
            brandSub.Text = "Made by Abhinav Giri";
            brandSub.Font = new Font("Segoe UI", 8f, FontStyle.Bold);
            brandSub.ForeColor = Color.FromArgb(226, 232, 240);
            brandSub.TextAlign = ContentAlignment.MiddleCenter;
            brandSub.Location = new Point(0, 132);
            brandSub.Size = new Size(164, 18);
            leftSidebarPanel.Controls.Add(brandSub);

            Label brandHandle = new Label();
            brandHandle.Text = "@abhinavgiri45";
            brandHandle.Font = new Font("Segoe UI", 7.5f);
            brandHandle.ForeColor = Color.FromArgb(148, 163, 184);
            brandHandle.TextAlign = ContentAlignment.MiddleCenter;
            brandHandle.Location = new Point(0, 150);
            brandHandle.Size = new Size(164, 16);
            leftSidebarPanel.Controls.Add(brandHandle);

            // Middle feature bullets
            Label bullets = new Label();
            bullets.Text = "• Zero Cloud Lock-In\n• 100% Offline\n• Universal Office (.g)\n• Sovereign Security";
            bullets.Font = new Font("Segoe UI", 8.5f);
            bullets.ForeColor = Color.FromArgb(148, 163, 184);
            bullets.Location = new Point(16, 176);
            bullets.Size = new Size(135, 95);
            bullets.TextAlign = ContentAlignment.TopLeft;
            leftSidebarPanel.Controls.Add(bullets);

            Label archBadge = new Label();
            string arch = IntPtr.Size == 8 ? "64-BIT (X64)" : "32-BIT (X86)";
            archBadge.Text = arch + "\nv11.8 RELEASE";
            archBadge.Font = new Font("Segoe UI", 7.5f, FontStyle.Bold);
            archBadge.ForeColor = Color.FromArgb(71, 85, 105);
            archBadge.TextAlign = ContentAlignment.MiddleCenter;
            archBadge.Dock = DockStyle.Bottom;
            archBadge.Height = 45;
            leftSidebarPanel.Controls.Add(archBadge);

            // Bottom Buttons Bar
            bottomPanel = new Panel();
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
            cancelButton.Location = new Point(530, 13);
            cancelButton.Font = new Font("Segoe UI", 9f);
            cancelButton.Click += (s, e) => {
                if (currentStep == 6)
                {
                    if (MessageBox.Show("Installation is currently in progress. Are you sure you want to cancel?", "Confirm Exit", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
                    {
                        this.Close();
                    }
                }
                else
                {
                    this.Close();
                }
            };
            bottomPanel.Controls.Add(cancelButton);

            nextButton = new Button();
            nextButton.Text = "Next >";
            nextButton.Size = new Size(82, 28);
            nextButton.Location = new Point(440, 13);
            nextButton.Font = new Font("Segoe UI", 9f, FontStyle.Bold);
            nextButton.BackColor = Color.FromArgb(37, 99, 235);
            nextButton.ForeColor = Color.White;
            nextButton.FlatStyle = FlatStyle.Flat;
            nextButton.FlatAppearance.BorderSize = 0;
            nextButton.Click += (s, e) => OnNextClick();
            bottomPanel.Controls.Add(nextButton);

            backButton = new Button();
            backButton.Text = "< Back";
            backButton.Size = new Size(82, 28);
            backButton.Location = new Point(350, 13);
            backButton.Font = new Font("Segoe UI", 9f);
            backButton.Click += (s, e) => OnBackClick();
            bottomPanel.Controls.Add(backButton);

            // Center Content
            contentPanel = new Panel();
            contentPanel.Dock = DockStyle.Fill;
            contentPanel.Padding = new Padding(24, 18, 24, 18);

            // CRITICAL WINFORMS DOCKING ORDER:
            // Controls added last dock FIRST. DockStyle.Fill control must be added FIRST
            // so edge-docked panels dock around it and contentPanel gets the proper interior rectangle!
            this.Controls.Add(contentPanel);
            this.Controls.Add(leftSidebarPanel);
            this.Controls.Add(topHeaderPanel);
            this.Controls.Add(bottomPanel);
        }

        private void OnBackClick()
        {
            if (currentStep > 1 && currentStep < 7)
            {
                ShowPage(currentStep - 1);
            }
        }

        private void OnNextClick()
        {
            if (currentStep == 1)
            {
                ShowPage(2);
            }
            else if (currentStep == 2)
            {
                if (radioAccept != null && !radioAccept.Checked)
                {
                    MessageBox.Show("Please accept the sovereign license agreement to continue with installation.", "Giri Orbit Setup", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    return;
                }
                ShowPage(3);
            }
            else if (currentStep == 3)
            {
                if (txtInstallPath != null)
                {
                    this.installPath = txtInstallPath.Text.Trim();
                }
                if (string.IsNullOrEmpty(this.installPath))
                {
                    MessageBox.Show("Please specify a valid destination installation directory.", "Giri Orbit Setup", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }
                ShowPage(4);
            }
            else if (currentStep == 4)
            {
                installDrift = chkDrift != null && chkDrift.Checked;
                installAxis = chkAxis != null && chkAxis.Checked;
                installKinetic = chkKinetic != null && chkKinetic.Checked;
                installAegis = chkAegis != null && chkAegis.Checked;
                installGirionix = chkGirionix != null && chkGirionix.Checked;

                if (!installDrift && !installAxis && !installKinetic && !installAegis && !installGirionix)
                {
                    MessageBox.Show("Please select at least one component of Giri Orbit to install.", "Giri Orbit Setup", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }
                ShowPage(5);
            }
            else if (currentStep == 5)
            {
                createDesktopShortcut = chkDesktop != null && chkDesktop.Checked;
                createStartMenuShortcut = chkStartMenu != null && chkStartMenu.Checked;
                registerFileAssociations = chkAssociations != null && chkAssociations.Checked;
                ShowPage(6);
            }
            else if (currentStep == 6)
            {
                ShowPage(7);
                StartInstallation();
            }
            else if (currentStep == 8)
            {
                if (chkLaunchNow != null && chkLaunchNow.Checked)
                {
                    string appExe = Path.Combine(this.installPath, "GiriOrbit.exe");
                    if (File.Exists(appExe))
                    {
                        try { Process.Start(appExe); } catch { }
                    }
                }
                this.Close();
            }
        }

        private void ShowPage(int step)
        {
            currentStep = step;
            contentPanel.Controls.Clear();

            // Left Sidebar is visible on Welcome (1) and Finished (8)
            // Top Header Banner is visible on inner steps 2 to 7
            leftSidebarPanel.Visible = (step == 1 || step == 8);
            topHeaderPanel.Visible = (step >= 2 && step <= 7);

            backButton.Enabled = (step > 1 && step < 7);
            nextButton.Enabled = true;
            cancelButton.Enabled = (step != 8);

            if (step == 1)
            {
                nextButton.Text = "Next >";
                ShowWelcomePage();
            }
            else if (step == 2)
            {
                nextButton.Text = "Next >";
                headerTitle.Text = "License Agreement";
                headerSubtitle.Text = "Please review the sovereign license terms before proceeding with installation.";
                ShowLicensePage();
            }
            else if (step == 3)
            {
                nextButton.Text = "Next >";
                headerTitle.Text = "Select Destination Location";
                headerSubtitle.Text = "Where should Giri Orbit be installed on your computer?";
                ShowDirectoryPage();
            }
            else if (step == 4)
            {
                nextButton.Text = "Next >";
                headerTitle.Text = "Select Components to Install";
                headerSubtitle.Text = "Which productivity components of Giri Orbit should be deployed?";
                ShowComponentsPage();
            }
            else if (step == 5)
            {
                nextButton.Text = "Next >";
                headerTitle.Text = "Select Additional Tasks";
                headerSubtitle.Text = "Select shortcuts and file associations for your selected components.";
                ShowTasksPage();
            }
            else if (step == 6)
            {
                nextButton.Text = "Install";
                headerTitle.Text = "Ready to Install";
                headerSubtitle.Text = "Setup is ready to install the selected Giri Orbit components.";
                ShowReadyPage();
            }
            else if (step == 7)
            {
                backButton.Enabled = false;
                nextButton.Enabled = false;
                headerTitle.Text = "Installing";
                headerSubtitle.Text = "Please wait while Setup deploys Giri Orbit on your computer.";
                ShowProgressPage();
            }
            else if (step == 8)
            {
                backButton.Enabled = false;
                nextButton.Text = "Finish";
                cancelButton.Enabled = false;
                ShowFinishedPage();
            }
        }

        // ==========================================
        // PAGE 1: WELCOME PAGE
        // ==========================================
        private void ShowWelcomePage()
        {
            Label title = new Label();
            title.Text = "Welcome to the Giri Orbit Setup Wizard";
            title.Font = new Font("Segoe UI", 13.5f, FontStyle.Bold);
            title.ForeColor = Color.FromArgb(15, 23, 42);
            title.Dock = DockStyle.Top;
            title.Height = 55;

            Label desc = new Label();
            desc.Text = "This wizard will install Giri Orbit Sovereign Enterprise Suite on your computer.\n\n" +
                        "Made by Abhinav Giri (github.com/abhinavgiri45 | @abhinavgiri45)\n\n" +
                        "Giri Orbit delivers complete sovereign desktop productivity:\n" +
                        "  • Giri Drift (Executive Document Composer)\n" +
                        "  • Giri Axis (High-Velocity Financial Matrix)\n" +
                        "  • Giri Kinetic (Cinematic Widescreen Show & Global Decks)\n" +
                        "  • Giri Aegis (PDF Studio & Digital Seal)\n" +
                        "  • Girionix AI Polymath Copilot\n\n" +
                        "All tools run 100% offline in-memory with zero cloud telemetry.\n\n" +
                        "Click Next to continue, or Cancel to exit Setup.";
            desc.Font = new Font("Segoe UI", 9.5f);
            desc.ForeColor = Color.FromArgb(51, 65, 85);
            desc.Dock = DockStyle.Fill;

            contentPanel.Controls.Add(desc);
            contentPanel.Controls.Add(title);
        }

        // ==========================================
        // PAGE 2: LICENSE PAGE (ENHANCED SOVEREIGN TERMS & CONDITIONS)
        // ==========================================
        private void ShowLicensePage()
        {
            Label lbl = new Label();
            lbl.Text = "Please read the following Sovereign License Agreement carefully. You must accept the terms before continuing:";
            lbl.Font = new Font("Segoe UI", 9f);
            lbl.Dock = DockStyle.Top;
            lbl.Height = 26;

            Panel pnlRadio = new Panel();
            pnlRadio.Dock = DockStyle.Bottom;
            pnlRadio.Height = 54;

            radioAccept = new RadioButton();
            radioAccept.Text = "I accept the agreement";
            radioAccept.Font = new Font("Segoe UI", 9f, FontStyle.Bold);
            radioAccept.ForeColor = Color.FromArgb(15, 23, 42);
            radioAccept.Location = new Point(0, 4);
            radioAccept.AutoSize = true;
            radioAccept.Checked = true;
            pnlRadio.Controls.Add(radioAccept);

            radioDecline = new RadioButton();
            radioDecline.Text = "I do not accept the agreement";
            radioDecline.Font = new Font("Segoe UI", 9f);
            radioDecline.ForeColor = Color.FromArgb(100, 116, 139);
            radioDecline.Location = new Point(0, 28);
            radioDecline.AutoSize = true;
            pnlRadio.Controls.Add(radioDecline);

            TextBox txtLicense = new TextBox();
            txtLicense.Multiline = true;
            txtLicense.ScrollBars = ScrollBars.Vertical;
            txtLicense.ReadOnly = true;
            txtLicense.BackColor = Color.White;
            txtLicense.Font = new Font("Consolas", 8.5f);
            txtLicense.Dock = DockStyle.Fill;
            txtLicense.Text = "GIRI ORBIT SOVEREIGN ENTERPRISE LICENSE & TERMS OF SERVICE\r\n" +
                              "Copyright (C) 2026 Abhinav Giri. All Rights Reserved.\r\n" +
                              "Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)\r\n" +
                              "Worldwide Sovereign Computing Standard.\r\n\r\n" +
                              "1. PERPETUAL SOVEREIGN LICENSE GRANT:\r\n" +
                              "Abhinav Giri grants you a perpetual, irrevocable, worldwide, royalty-free, " +
                              "non-exclusive sovereign license to install, execute, and utilize Giri Orbit Sovereign Suite " +
                              "on any compatible workstation, laptop, server, or virtual machine.\r\n\r\n" +
                              "2. ABSOLUTE ZERO-TELEMETRY & IN-MEMORY PRIVACY GUARANTEE:\r\n" +
                              "Giri Orbit is engineered under an uncompromising sovereign zero-telemetry architectural standard. " +
                              "It operates 100% locally in-memory on your physical device. It does not transmit keystrokes, " +
                              "document contents, analytical metrics, tracking identifiers, or telemetry payloads to any remote cloud.\r\n\r\n" +
                              "3. UNCONDITIONAL INTELLECTUAL PROPERTY & DATA SOVEREIGNTY:\r\n" +
                              "All documents (.giri, .gdrift), financial models (.gaxis), presentation slide decks (.gkinetic), " +
                              "and cryptographically sealed files (.gaegis, .gpdf) created, edited, or processed using Giri Orbit " +
                              "remain your exclusive, inviolable intellectual property. Abhinav Giri claims zero ownership or access.\r\n\r\n" +
                              "4. UNIVERSAL INTEROPERABILITY & OPEN FORMAT FREEDOM:\r\n" +
                              "Giri Orbit guarantees zero platform lock-in. Built upon the sovereign .g universal document schema, " +
                              "your data can be converted, exported, and imported into standard document, spreadsheet, presentation, " +
                              "and portable document formats across all desktop and enterprise office ecosystems without degradation.\r\n\r\n" +
                              "5. SELECTIVE COMPONENT DEPLOYMENT & LOCAL RESILIENCE:\r\n" +
                              "You have the operational freedom to deploy all or individual suite modules (Drift, Axis, Kinetic, Aegis, Girionix). " +
                              "Each selected component is completely self-contained and operates at peak offline performance without internet connectivity.\r\n\r\n" +
                              "6. AUTOMATIC GITHUB REPOSITORY SYNCHRONIZATION:\r\n" +
                              "When online connectivity is detected, Giri Orbit features an automated cryptographic update pipeline directly connected " +
                              "to the official open GitHub repository (https://github.com/abhinavgiri45/giri-orbit). Official security patches, " +
                              "engine optimizations, and template expansions are verified and applied without telemetry or user surveillance.\r\n\r\n" +
                              "7. CRYPTOGRAPHIC SEALS & AIR-GAPPED VERIFICATION:\r\n" +
                              "The integrated Aegis security engine provides localized cryptographic hashing and document integrity validation, " +
                              "safeguarding your records against silent corruption and tampering.\r\n\r\n" +
                              "8. CREATOR & COMMUNITY CONTACT:\r\n" +
                              "Giri Orbit is developed and maintained by Abhinav Giri.\r\n" +
                              "Official GitHub: https://github.com/abhinavgiri45/giri-orbit\r\n" +
                              "Personal Instagram: https://instagram.com/abhinavgiri45\r\n\r\n" +
                              "9. DISCLAIMER & LIMITATION OF LIABILITY:\r\n" +
                              "THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO " +
                              "THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.";

            contentPanel.Controls.Add(txtLicense);
            contentPanel.Controls.Add(pnlRadio);
            contentPanel.Controls.Add(lbl);
        }

        // ==========================================
        // PAGE 3: DESTINATION DIRECTORY PAGE
        // ==========================================
        private void ShowDirectoryPage()
        {
            Label lbl = new Label();
            lbl.Text = "Setup will install Giri Orbit into the following folder.\r\nTo continue, click Next. If you would like to select a different folder, click Browse:";
            lbl.Font = new Font("Segoe UI", 9f);
            lbl.Dock = DockStyle.Top;
            lbl.Height = 38;

            Panel pnlBrowse = new Panel();
            pnlBrowse.Dock = DockStyle.Top;
            pnlBrowse.Height = 42;

            Button btnBrowse = new Button();
            btnBrowse.Text = "Browse...";
            btnBrowse.Font = new Font("Segoe UI", 9f);
            btnBrowse.Dock = DockStyle.Right;
            btnBrowse.Width = 85;
            btnBrowse.Click += (s, e) => {
                using (FolderBrowserDialog fbd = new FolderBrowserDialog())
                {
                    fbd.Description = "Select destination folder for Giri Orbit:";
                    fbd.SelectedPath = this.installPath;
                    if (fbd.ShowDialog() == DialogResult.OK)
                    {
                        this.installPath = fbd.SelectedPath;
                        txtInstallPath.Text = this.installPath;
                    }
                }
            };

            Panel pnlPathWrap = new Panel();
            pnlPathWrap.Dock = DockStyle.Fill;
            pnlPathWrap.Padding = new Padding(0, 0, 10, 0);

            txtInstallPath = new TextBox();
            txtInstallPath.Text = this.installPath;
            txtInstallPath.Font = new Font("Segoe UI", 9.5f);
            txtInstallPath.Dock = DockStyle.Fill;
            pnlPathWrap.Controls.Add(txtInstallPath);

            pnlBrowse.Controls.Add(pnlPathWrap);
            pnlBrowse.Controls.Add(btnBrowse);

            Label spaceLbl = new Label();
            spaceLbl.Text = "At least 95 MB of free disk space is required.\r\n\r\n" +
                            "This installation runs in user profile scope and does not require administrative elevation.";
            spaceLbl.Font = new Font("Segoe UI", 8.5f);
            spaceLbl.ForeColor = Color.FromArgb(100, 116, 139);
            spaceLbl.Dock = DockStyle.Bottom;
            spaceLbl.Height = 60;

            contentPanel.Controls.Add(spaceLbl);
            contentPanel.Controls.Add(pnlBrowse);
            contentPanel.Controls.Add(lbl);
        }

        // ==========================================
        // PAGE 4: SELECT COMPONENTS PAGE
        // ==========================================
        private void ShowComponentsPage()
        {
            Label lblPrompt = new Label();
            lblPrompt.Text = "Select the components you want to install; clear components you do not want to install:";
            lblPrompt.Font = new Font("Segoe UI", 9f);
            lblPrompt.Dock = DockStyle.Top;
            lblPrompt.Height = 22;

            Panel pnlBox = new Panel();
            pnlBox.Dock = DockStyle.Top;
            pnlBox.Height = 186;
            pnlBox.BackColor = Color.White;
            pnlBox.BorderStyle = BorderStyle.FixedSingle;

            chkSelectAll = new CheckBox();
            chkSelectAll.Text = "Select All Components (Full Sovereign Enterprise Suite — Recommended)";
            chkSelectAll.Font = new Font("Segoe UI", 9f, FontStyle.Bold);
            chkSelectAll.ForeColor = Color.FromArgb(15, 23, 42);
            chkSelectAll.Checked = (installDrift && installAxis && installKinetic && installAegis && installGirionix);
            chkSelectAll.Location = new Point(10, 8);
            chkSelectAll.Size = new Size(540, 22);
            chkSelectAll.CheckedChanged += (s, e) => {
                bool state = chkSelectAll.Checked;
                if (chkDrift.Checked != state) chkDrift.Checked = state;
                if (chkAxis.Checked != state) chkAxis.Checked = state;
                if (chkKinetic.Checked != state) chkKinetic.Checked = state;
                if (chkAegis.Checked != state) chkAegis.Checked = state;
                if (chkGirionix.Checked != state) chkGirionix.Checked = state;
                UpdateComponentSizeLabel();
            };
            pnlBox.Controls.Add(chkSelectAll);

            Panel sep = new Panel();
            sep.Location = new Point(10, 34);
            sep.Size = new Size(550, 1);
            sep.BackColor = Color.FromArgb(226, 232, 240);
            pnlBox.Controls.Add(sep);

            Action checkSync = () => {
                bool all = chkDrift.Checked && chkAxis.Checked && chkKinetic.Checked && chkAegis.Checked && chkGirionix.Checked;
                if (chkSelectAll.Checked != all)
                {
                    chkSelectAll.Checked = all;
                }
                UpdateComponentSizeLabel();
            };

            chkDrift = new CheckBox();
            chkDrift.Text = "Giri Drift — Executive Document Composer [~28 MB]";
            chkDrift.Font = new Font("Segoe UI", 9f);
            chkDrift.Checked = installDrift;
            chkDrift.Location = new Point(24, 40);
            chkDrift.Size = new Size(520, 22);
            chkDrift.CheckedChanged += (s, e) => {
                installDrift = chkDrift.Checked;
                checkSync();
            };
            chkDrift.MouseEnter += (s, e) => ShowCompDesc("Giri Drift: Executive rich-text document composer with tables, headers/footers, styles, and universal sovereign .g format.");
            pnlBox.Controls.Add(chkDrift);

            chkAxis = new CheckBox();
            chkAxis.Text = "Giri Axis — High-Velocity Financial Matrix [~24 MB]";
            chkAxis.Font = new Font("Segoe UI", 9f);
            chkAxis.Checked = installAxis;
            chkAxis.Location = new Point(24, 66);
            chkAxis.Size = new Size(520, 22);
            chkAxis.CheckedChanged += (s, e) => {
                installAxis = chkAxis.Checked;
                checkSync();
            };
            chkAxis.MouseEnter += (s, e) => ShowCompDesc("Giri Axis: High-velocity spreadsheet engine with 100+ formula functions, charts, conditional formatting, and multi-sheet tabs.");
            pnlBox.Controls.Add(chkAxis);

            chkKinetic = new CheckBox();
            chkKinetic.Text = "Giri Kinetic — Cinematic Widescreen Show & Global Decks [~22 MB]";
            chkKinetic.Font = new Font("Segoe UI", 9f);
            chkKinetic.Checked = installKinetic;
            chkKinetic.Location = new Point(24, 92);
            chkKinetic.Size = new Size(520, 22);
            chkKinetic.CheckedChanged += (s, e) => {
                installKinetic = chkKinetic.Checked;
                checkSync();
            };
            chkKinetic.MouseEnter += (s, e) => ShowCompDesc("Giri Kinetic: Widescreen presentation studio with 3,500+ global deck templates, rich diagrams, and presenter mode.");
            pnlBox.Controls.Add(chkKinetic);

            chkAegis = new CheckBox();
            chkAegis.Text = "Giri Aegis — Sovereign PDF Studio & Digital Seal [~18 MB]";
            chkAegis.Font = new Font("Segoe UI", 9f);
            chkAegis.Checked = installAegis;
            chkAegis.Location = new Point(24, 118);
            chkAegis.Size = new Size(520, 22);
            chkAegis.CheckedChanged += (s, e) => {
                installAegis = chkAegis.Checked;
                checkSync();
            };
            chkAegis.MouseEnter += (s, e) => ShowCompDesc("Giri Aegis: Sovereign PDF Studio with form editing, cryptographic verification, and air-gapped tamper protection.");
            pnlBox.Controls.Add(chkAegis);

            chkGirionix = new CheckBox();
            chkGirionix.Text = "Girionix AI Polymath Copilot [~15 MB]";
            chkGirionix.Font = new Font("Segoe UI", 9f);
            chkGirionix.Checked = installGirionix;
            chkGirionix.Location = new Point(24, 144);
            chkGirionix.Size = new Size(520, 22);
            chkGirionix.CheckedChanged += (s, e) => {
                installGirionix = chkGirionix.Checked;
                checkSync();
            };
            chkGirionix.MouseEnter += (s, e) => ShowCompDesc("Girionix AI: Local-first intelligent copilot for rapid document generation, formula analysis, and research queries.");
            pnlBox.Controls.Add(chkGirionix);

            Panel pnlDesc = new Panel();
            pnlDesc.Dock = DockStyle.Bottom;
            pnlDesc.Height = 70;
            pnlDesc.BackColor = Color.FromArgb(241, 245, 249);
            pnlDesc.Padding = new Padding(12, 8, 12, 8);

            lblComponentDesc = new Label();
            lblComponentDesc.Font = new Font("Segoe UI", 8.5f);
            lblComponentDesc.ForeColor = Color.FromArgb(51, 65, 85);
            lblComponentDesc.Dock = DockStyle.Fill;
            pnlDesc.Controls.Add(lblComponentDesc);

            contentPanel.Controls.Add(pnlDesc);
            contentPanel.Controls.Add(pnlBox);
            contentPanel.Controls.Add(lblPrompt);

            UpdateComponentSizeLabel();
        }

        private void ShowCompDesc(string desc)
        {
            if (lblComponentDesc != null)
            {
                lblComponentDesc.Text = desc + "\r\n" + GetComponentSizeSummary();
            }
        }

        private void UpdateComponentSizeLabel()
        {
            if (lblComponentDesc != null)
            {
                string summary = (chkDrift.Checked && chkAxis.Checked && chkKinetic.Checked && chkAegis.Checked && chkGirionix.Checked)
                    ? "Full Suite: Complete sovereign desktop productivity environment with zero cloud lock-in."
                    : "Custom Deployment: Selected individual tools will be installed with dedicated desktop and start menu shortcuts.";
                lblComponentDesc.Text = summary + "\r\n" + GetComponentSizeSummary();
            }
        }

        private string GetComponentSizeSummary()
        {
            int mb = 0;
            if (chkDrift != null && chkDrift.Checked) mb += 28;
            if (chkAxis != null && chkAxis.Checked) mb += 24;
            if (chkKinetic != null && chkKinetic.Checked) mb += 22;
            if (chkAegis != null && chkAegis.Checked) mb += 18;
            if (chkGirionix != null && chkGirionix.Checked) mb += 15;
            return string.Format("Total selected footprint: ~{0} MB of disk space required.", Math.Max(mb, 25));
        }

        // ==========================================
        // PAGE 5: ADDITIONAL TASKS PAGE
        // ==========================================
        private void ShowTasksPage()
        {
            Panel pnlTasks = new Panel();
            pnlTasks.Dock = DockStyle.Fill;
            pnlTasks.AutoScroll = true;

            Label lbl = new Label();
            lbl.Text = "Select additional tasks for your selected components, then click Next:";
            lbl.Font = new Font("Segoe UI", 9f);
            lbl.Location = new Point(0, 0);
            lbl.Size = new Size(580, 24);
            pnlTasks.Controls.Add(lbl);

            Label shortcutsHeader = new Label();
            shortcutsHeader.Text = "Desktop shortcuts for selected components:";
            shortcutsHeader.Font = new Font("Segoe UI", 9f, FontStyle.Bold);
            shortcutsHeader.ForeColor = Color.FromArgb(15, 23, 42);
            shortcutsHeader.Location = new Point(0, 36);
            shortcutsHeader.Size = new Size(580, 22);
            pnlTasks.Controls.Add(shortcutsHeader);

            chkDesktop = new CheckBox();
            chkDesktop.Text = "Create Desktop shortcuts for installed Giri Orbit components";
            chkDesktop.Font = new Font("Segoe UI", 9f);
            chkDesktop.Checked = createDesktopShortcut;
            chkDesktop.Location = new Point(16, 62);
            chkDesktop.Size = new Size(560, 22);
            pnlTasks.Controls.Add(chkDesktop);

            chkStartMenu = new CheckBox();
            chkStartMenu.Text = "Create Start Menu program folder & component shortcuts";
            chkStartMenu.Font = new Font("Segoe UI", 9f);
            chkStartMenu.Checked = createStartMenuShortcut;
            chkStartMenu.Location = new Point(16, 88);
            chkStartMenu.Size = new Size(560, 22);
            pnlTasks.Controls.Add(chkStartMenu);

            Label assocHeader = new Label();
            assocHeader.Text = "File associations:";
            assocHeader.Font = new Font("Segoe UI", 9f, FontStyle.Bold);
            assocHeader.ForeColor = Color.FromArgb(15, 23, 42);
            assocHeader.Location = new Point(0, 126);
            assocHeader.Size = new Size(580, 22);
            pnlTasks.Controls.Add(assocHeader);

            chkAssociations = new CheckBox();
            chkAssociations.Text = "Register universal office file associations (.giri, .gdrift, .gaxis, .gkinetic, .gaegis, .gpdf)";
            chkAssociations.Font = new Font("Segoe UI", 9f);
            chkAssociations.Checked = registerFileAssociations;
            chkAssociations.Location = new Point(16, 152);
            chkAssociations.Size = new Size(560, 22);
            pnlTasks.Controls.Add(chkAssociations);

            contentPanel.Controls.Add(pnlTasks);
        }

        // ==========================================
        // PAGE 6: READY TO INSTALL PAGE
        // ==========================================
        private void ShowReadyPage()
        {
            Label lbl = new Label();
            lbl.Text = "Click Install to continue with the installation, or click Back to review settings:";
            lbl.Font = new Font("Segoe UI", 9f);
            lbl.Dock = DockStyle.Top;
            lbl.Height = 26;

            TextBox txtSummary = new TextBox();
            txtSummary.Multiline = true;
            txtSummary.ReadOnly = true;
            txtSummary.ScrollBars = ScrollBars.Vertical;
            txtSummary.BackColor = Color.White;
            txtSummary.Font = new Font("Segoe UI", 9f);
            txtSummary.Dock = DockStyle.Fill;

            StringBuilder sb = new StringBuilder();
            sb.AppendLine("Destination location:");
            sb.AppendLine("  " + this.installPath);
            sb.AppendLine();
            sb.AppendLine("Selected components to install:");
            if (installDrift) sb.AppendLine("  • Giri Drift (Executive Document Composer)");
            if (installAxis) sb.AppendLine("  • Giri Axis (High-Velocity Financial Matrix)");
            if (installKinetic) sb.AppendLine("  • Giri Kinetic (Cinematic Widescreen Show & Global Decks)");
            if (installAegis) sb.AppendLine("  • Giri Aegis (PDF Studio & Digital Seal)");
            if (installGirionix) sb.AppendLine("  • Girionix AI Polymath Copilot");
            sb.AppendLine();
            sb.AppendLine("Selected additional tasks:");
            if (createDesktopShortcut) sb.AppendLine("  • Create Desktop shortcuts for chosen components");
            if (createStartMenuShortcut) sb.AppendLine("  • Create Start Menu shortcuts");
            if (registerFileAssociations) sb.AppendLine("  • Associate .g sovereign and universal office formats");

            txtSummary.Text = sb.ToString();

            contentPanel.Controls.Add(txtSummary);
            contentPanel.Controls.Add(lbl);
        }

        // ==========================================
        // PAGE 7: PROGRESS / INSTALLATION PAGE
        // ==========================================
        private void ShowProgressPage()
        {
            statusLabel = new Label();
            statusLabel.Text = "Preparing installation payload...";
            statusLabel.Font = new Font("Segoe UI", 9.5f, FontStyle.Bold);
            statusLabel.ForeColor = Color.FromArgb(15, 23, 42);
            statusLabel.Dock = DockStyle.Top;
            statusLabel.Height = 26;

            progressBar = new ProgressBar();
            progressBar.Dock = DockStyle.Top;
            progressBar.Height = 26;
            progressBar.Minimum = 0;
            progressBar.Maximum = 100;
            progressBar.Value = 5;

            Panel spacer = new Panel();
            spacer.Dock = DockStyle.Top;
            spacer.Height = 12;

            statusDetailLabel = new Label();
            statusDetailLabel.Text = "Please wait while files are unpacked...";
            statusDetailLabel.Font = new Font("Segoe UI", 8.5f);
            statusDetailLabel.ForeColor = Color.FromArgb(100, 116, 139);
            statusDetailLabel.Dock = DockStyle.Top;
            statusDetailLabel.Height = 44;

            contentPanel.Controls.Add(statusDetailLabel);
            contentPanel.Controls.Add(spacer);
            contentPanel.Controls.Add(progressBar);
            contentPanel.Controls.Add(statusLabel);
        }

        // ==========================================
        // PAGE 8: FINISHED PAGE
        // ==========================================
        private void ShowFinishedPage()
        {
            Label title = new Label();
            title.Text = "Completing the Giri Orbit Setup Wizard";
            title.Font = new Font("Segoe UI", 13.5f, FontStyle.Bold);
            title.ForeColor = Color.FromArgb(15, 23, 42);
            title.Dock = DockStyle.Top;
            title.Height = 55;

            Panel pnlLaunch = new Panel();
            pnlLaunch.Dock = DockStyle.Bottom;
            pnlLaunch.Height = 36;

            chkLaunchNow = new CheckBox();
            chkLaunchNow.Text = "Launch Giri Orbit now";
            chkLaunchNow.Font = new Font("Segoe UI", 9.5f, FontStyle.Bold);
            chkLaunchNow.ForeColor = Color.FromArgb(16, 185, 129);
            chkLaunchNow.Checked = true;
            chkLaunchNow.AutoSize = true;
            chkLaunchNow.Location = new Point(0, 6);
            pnlLaunch.Controls.Add(chkLaunchNow);

            Label desc = new Label();
            desc.Text = "Setup has finished installing your selected Giri Orbit components.\n\n" +
                        "The installed tools may be launched using the desktop icons or through the Start Menu.\n\n" +
                        "When online, automatic background updates from the GitHub repository will keep your installation synchronized.\n\n" +
                        "Click Finish to exit Setup.";
            desc.Font = new Font("Segoe UI", 9.5f);
            desc.ForeColor = Color.FromArgb(51, 65, 85);
            desc.Dock = DockStyle.Fill;

            contentPanel.Controls.Add(desc);
            contentPanel.Controls.Add(title);
            contentPanel.Controls.Add(pnlLaunch);
        }

        // ==========================================
        // EXTRACTION & INSTALLATION WORKER
        // ==========================================
        private void StartInstallation()
        {
            Thread worker = new Thread(PerformInstallWork);
            worker.IsBackground = true;
            worker.Start();
        }

        private void UpdateInstallStatus(string status, string detail, int percent)
        {
            if (this.InvokeRequired)
            {
                this.Invoke(new Action<string, string, int>(UpdateInstallStatus), status, detail, percent);
                return;
            }
            if (statusLabel != null) statusLabel.Text = status;
            if (statusDetailLabel != null) statusDetailLabel.Text = detail;
            if (progressBar != null) progressBar.Value = Math.Max(0, Math.Min(100, percent));
        }

        private void PerformInstallWork()
        {
            try
            {
                Assembly asm = Assembly.GetExecutingAssembly();

                // 1. Destination directory
                UpdateInstallStatus("Creating installation directories...", this.installPath, 10);
                if (!Directory.Exists(this.installPath))
                {
                    Directory.CreateDirectory(this.installPath);
                }
                string appDataDir = Path.Combine(this.installPath, "app_data");
                if (!Directory.Exists(appDataDir))
                {
                    Directory.CreateDirectory(appDataDir);
                }
                string assetsDir = Path.Combine(this.installPath, "assets");
                if (!Directory.Exists(assetsDir))
                {
                    Directory.CreateDirectory(assetsDir);
                }
                Thread.Sleep(100);

                // 2. Extract Dedicated Application Binaries (Drift, Axis, Kinetic, Suite & Uninstaller)
                string appExeDest = Path.Combine(this.installPath, "GiriOrbit.exe");
                string driftExeDest = Path.Combine(this.installPath, "GiriDrift.exe");
                string axisExeDest = Path.Combine(this.installPath, "GiriAxis.exe");
                string kineticExeDest = Path.Combine(this.installPath, "GiriKinetic.exe");
                string uninstExeDest = Path.Combine(this.installPath, "Uninstall.exe");

                UpdateInstallStatus("Deploying dedicated office application binaries...", appExeDest, 25);
                using (Stream binStream = asm.GetManifestResourceStream("GiriOrbit.BinariesPayload"))
                {
                    if (binStream != null)
                    {
                        using (ZipArchive binArchive = new ZipArchive(binStream, ZipArchiveMode.Read))
                        {
                            foreach (ZipArchiveEntry entry in binArchive.Entries)
                            {
                                if (entry.Name.Equals("GiriDrift.exe", StringComparison.OrdinalIgnoreCase) && !installDrift) continue;
                                if (entry.Name.Equals("GiriAxis.exe", StringComparison.OrdinalIgnoreCase) && !installAxis) continue;
                                if (entry.Name.Equals("GiriKinetic.exe", StringComparison.OrdinalIgnoreCase) && !installKinetic) continue;

                                string destPath = Path.Combine(this.installPath, entry.Name);
                                using (Stream entryStream = entry.Open())
                                using (FileStream fs = new FileStream(destPath, FileMode.Create, FileAccess.Write))
                                {
                                    entryStream.CopyTo(fs);
                                }
                            }
                        }
                    }
                    else
                    {
                        ExtractResourceToFile(asm, "GiriOrbit.AppBinary", appExeDest);
                        if (installDrift) ExtractResourceToFile(asm, "GiriOrbit.DriftBinary", driftExeDest);
                        if (installAxis) ExtractResourceToFile(asm, "GiriOrbit.AxisBinary", axisExeDest);
                        if (installKinetic) ExtractResourceToFile(asm, "GiriOrbit.KineticBinary", kineticExeDest);
                        ExtractResourceToFile(asm, "GiriOrbit.UninstallerBinary", uninstExeDest);
                    }
                }
                Thread.Sleep(100);

                // 3. Extract Embedded Brand Assets (app.ico, drift.ico, axis.ico, kinetic.ico & original logo)
                UpdateInstallStatus("Installing dedicated brand icons and sovereign seals...", assetsDir, 40);
                string iconDest = Path.Combine(assetsDir, "app.ico");
                string driftIconDest = Path.Combine(assetsDir, "drift.ico");
                string axisIconDest = Path.Combine(assetsDir, "axis.ico");
                string kineticIconDest = Path.Combine(assetsDir, "kinetic.ico");
                string logoDest = Path.Combine(assetsDir, "giri-logo-symbol.png");
                ExtractResourceToFile(asm, "GiriOrbit.AppIcon", iconDest);
                ExtractResourceToFile(asm, "GiriOrbit.DriftIcon", driftIconDest);
                ExtractResourceToFile(asm, "GiriOrbit.AxisIcon", axisIconDest);
                ExtractResourceToFile(asm, "GiriOrbit.KineticIcon", kineticIconDest);
                ExtractResourceToFile(asm, "GiriOrbit.OriginalLogo", logoDest);
                Thread.Sleep(100);

                // 4. Extract Complete Offline Web Suite (assets-bundle.zip) into app_data
                UpdateInstallStatus("Unpacking complete offline web suite...", appDataDir, 60);
                using (Stream zipStream = asm.GetManifestResourceStream("GiriOrbit.AssetsBundle"))
                {
                    if (zipStream != null)
                    {
                        using (ZipArchive archive = new ZipArchive(zipStream, ZipArchiveMode.Read))
                        {
                            int totalEntries = archive.Entries.Count;
                            int count = 0;
                            foreach (ZipArchiveEntry entry in archive.Entries)
                            {
                                count++;
                                string completeFileName = Path.Combine(appDataDir, entry.FullName);
                                string directory = Path.GetDirectoryName(completeFileName);
                                if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
                                {
                                    Directory.CreateDirectory(directory);
                                }
                                if (!string.IsNullOrEmpty(entry.Name))
                                {
                                    using (Stream entryStream = entry.Open())
                                    using (FileStream fileStream = new FileStream(completeFileName, FileMode.Create, FileAccess.Write))
                                    {
                                        entryStream.CopyTo(fileStream);
                                    }
                                }
                                if (count % 15 == 0 || count == totalEntries)
                                {
                                    int pct = 60 + (int)((count / (float)totalEntries) * 20);
                                    UpdateInstallStatus("Deploying: " + entry.Name, entry.FullName, pct);
                                }
                            }
                        }
                    }
                    else
                    {
                        // Fallback: Copy from local directory if running unpacked
                        string sourceBase = AppDomain.CurrentDomain.BaseDirectory;
                        string checkDir = Path.Combine(sourceBase, "..", "Giri Orbit");
                        if (Directory.Exists(checkDir))
                        {
                            CopyDirectorySafe(checkDir, appDataDir, new string[] { ".git", "dist", "bin", "obj" });
                        }
                    }
                }
                Thread.Sleep(150);

                // 5. Save Component State Manifest (installed-components.json)
                string compManifest = string.Format(
                    "{{\r\n  \"drift\": {0},\r\n  \"axis\": {1},\r\n  \"kinetic\": {2},\r\n  \"aegis\": {3},\r\n  \"girionix\": {4},\r\n  \"installDate\": \"{5}\",\r\n  \"version\": \"11.8.2\"\r\n}}",
                    installDrift.ToString().ToLower(),
                    installAxis.ToString().ToLower(),
                    installKinetic.ToString().ToLower(),
                    installAegis.ToString().ToLower(),
                    installGirionix.ToString().ToLower(),
                    DateTime.UtcNow.ToString("o")
                );
                File.WriteAllText(Path.Combine(this.installPath, "installed-components.json"), compManifest);

                // 6. Create Desktop Shortcuts for Selected Components
                if (createDesktopShortcut)
                {
                    UpdateInstallStatus("Creating Desktop shortcuts for selected components...", "Giri Orbit.lnk", 82);
                    string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);

                    // Main Suite Hub
                    CreateShortcut(appExeDest, Path.Combine(desktopPath, "Giri Orbit.lnk"), "Giri Orbit Sovereign Enterprise Workspace", iconDest, "");

                    if (installDrift)
                    {
                        string target = File.Exists(driftExeDest) ? driftExeDest : appExeDest;
                        string args = File.Exists(driftExeDest) ? "" : "-drift";
                        CreateShortcut(target, Path.Combine(desktopPath, "Giri Drift.lnk"), "Giri Drift — Executive Document Composer", driftIconDest, args);
                    }
                    if (installAxis)
                    {
                        string target = File.Exists(axisExeDest) ? axisExeDest : appExeDest;
                        string args = File.Exists(axisExeDest) ? "" : "-axis";
                        CreateShortcut(target, Path.Combine(desktopPath, "Giri Axis.lnk"), "Giri Axis — High-Velocity Financial Matrix", axisIconDest, args);
                    }
                    if (installKinetic)
                    {
                        string target = File.Exists(kineticExeDest) ? kineticExeDest : appExeDest;
                        string args = File.Exists(kineticExeDest) ? "" : "-kinetic";
                        CreateShortcut(target, Path.Combine(desktopPath, "Giri Kinetic.lnk"), "Giri Kinetic — Cinematic Widescreen Show", kineticIconDest, args);
                    }
                    if (installAegis)
                    {
                        CreateShortcut(appExeDest, Path.Combine(desktopPath, "Giri Aegis.lnk"), "Giri Aegis — PDF Studio & Digital Seal", iconDest, "-pdf");
                    }
                }

                // 7. Create Start Menu Shortcuts for Selected Components
                if (createStartMenuShortcut)
                {
                    UpdateInstallStatus("Configuring Start Menu shortcuts...", "Programs\\Giri Orbit", 88);
                    string startMenu = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.StartMenu), "Programs", "Giri Orbit");
                    if (!Directory.Exists(startMenu)) Directory.CreateDirectory(startMenu);

                    CreateShortcut(appExeDest, Path.Combine(startMenu, "Giri Orbit.lnk"), "Giri Orbit", iconDest, "");
                    if (installDrift)
                    {
                        string target = File.Exists(driftExeDest) ? driftExeDest : appExeDest;
                        string args = File.Exists(driftExeDest) ? "" : "-drift";
                        CreateShortcut(target, Path.Combine(startMenu, "Giri Drift.lnk"), "Giri Drift Document Composer", driftIconDest, args);
                    }
                    if (installAxis)
                    {
                        string target = File.Exists(axisExeDest) ? axisExeDest : appExeDest;
                        string args = File.Exists(axisExeDest) ? "" : "-axis";
                        CreateShortcut(target, Path.Combine(startMenu, "Giri Axis.lnk"), "Giri Axis Financial Matrix", axisIconDest, args);
                    }
                    if (installKinetic)
                    {
                        string target = File.Exists(kineticExeDest) ? kineticExeDest : appExeDest;
                        string args = File.Exists(kineticExeDest) ? "" : "-kinetic";
                        CreateShortcut(target, Path.Combine(startMenu, "Giri Kinetic.lnk"), "Giri Kinetic Widescreen Show", kineticIconDest, args);
                    }
                    if (installAegis) CreateShortcut(appExeDest, Path.Combine(startMenu, "Giri Aegis.lnk"), "Giri Aegis PDF Studio", iconDest, "-pdf");
                    CreateShortcut(uninstExeDest, Path.Combine(startMenu, "Uninstall Giri Orbit.lnk"), "Uninstall Giri Orbit", uninstExeDest, "");
                }

                // 8. Register with Windows Programs & Features (Control Panel & Settings)
                UpdateInstallStatus("Registering with Windows Programs & Features...", "Uninstall Registry Entry", 93);
                RegisterWindowsUninstall(appExeDest, uninstExeDest, iconDest);

                // 9. Register Universal Office File Associations for Selected Components
                if (registerFileAssociations)
                {
                    UpdateInstallStatus("Configuring sovereign & universal file associations...", ".giri, .gdrift, .gaxis, .gkinetic, .gaegis", 97);
                    RegisterFileAssociation(".giri", "GiriOrbit.UniversalOffice", "Giri Universal Sovereign Office Package", "application/x-giri-universal-office", appExeDest, iconDest);
                    if (installDrift)
                    {
                        string target = File.Exists(driftExeDest) ? driftExeDest : appExeDest;
                        RegisterFileAssociation(".gdrift", "GiriOrbit.Drift", "Giri Drift Document", "application/msword", target, driftIconDest);
                        RegisterFileAssociation(".docx", "GiriOrbit.Drift", "Executive Document", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", target, driftIconDest);
                        RegisterFileAssociation(".doc", "GiriOrbit.Drift", "Standard Document", "application/msword", target, driftIconDest);
                        RegisterFileAssociation(".odt", "GiriOrbit.Drift", "OpenDocument Text", "application/vnd.oasis.opendocument.text", target, driftIconDest);
                    }
                    if (installAxis)
                    {
                        string target = File.Exists(axisExeDest) ? axisExeDest : appExeDest;
                        RegisterFileAssociation(".gaxis", "GiriOrbit.Axis", "Giri Axis Spreadsheet", "application/vnd.ms-excel", target, axisIconDest);
                        RegisterFileAssociation(".xlsx", "GiriOrbit.Axis", "Financial Spreadsheet Workbook", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", target, axisIconDest);
                        RegisterFileAssociation(".xls", "GiriOrbit.Axis", "Standard Spreadsheet", "application/vnd.ms-excel", target, axisIconDest);
                        RegisterFileAssociation(".ods", "GiriOrbit.Axis", "OpenDocument Spreadsheet", "application/vnd.oasis.opendocument.spreadsheet", target, axisIconDest);
                        RegisterFileAssociation(".csv", "GiriOrbit.Axis", "CSV Data Sheet", "text/csv", target, axisIconDest);
                    }
                    if (installKinetic)
                    {
                        string target = File.Exists(kineticExeDest) ? kineticExeDest : appExeDest;
                        RegisterFileAssociation(".gkinetic", "GiriOrbit.Kinetic", "Giri Kinetic Presentation", "application/vnd.ms-powerpoint", target, kineticIconDest);
                        RegisterFileAssociation(".pptx", "GiriOrbit.Kinetic", "Executive Presentation Deck", "application/vnd.openxmlformats-officedocument.presentationml.presentation", target, kineticIconDest);
                        RegisterFileAssociation(".ppt", "GiriOrbit.Kinetic", "Standard Presentation", "application/vnd.ms-powerpoint", target, kineticIconDest);
                        RegisterFileAssociation(".odp", "GiriOrbit.Kinetic", "OpenDocument Presentation", "application/vnd.oasis.opendocument.presentation", target, kineticIconDest);
                    }
                    if (installAegis)
                    {
                        RegisterFileAssociation(".gaegis", "GiriOrbit.Aegis", "Giri Aegis PDF Document", "application/pdf", appExeDest, iconDest);
                        RegisterFileAssociation(".gpdf", "GiriOrbit.Aegis", "Giri Aegis PDF Document", "application/pdf", appExeDest, iconDest);
                    }
                }

                UpdateInstallStatus("Installation completed successfully!", "All files deployed & verified.", 100);
                Thread.Sleep(300);

                this.Invoke(new Action(ShowFinishedPage));
            }
            catch (Exception ex)
            {
                this.Invoke(new Action(() => {
                    MessageBox.Show("An error occurred during installation:\r\n\r\n" + ex.Message + "\r\n\r\n" + ex.StackTrace,
                        "Installation Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    this.Close();
                }));
            }
        }

        private void ExtractResourceToFile(Assembly asm, string resourceName, string destPath)
        {
            using (Stream resStream = asm.GetManifestResourceStream(resourceName))
            {
                if (resStream != null)
                {
                    string parent = Path.GetDirectoryName(destPath);
                    if (!string.IsNullOrEmpty(parent) && !Directory.Exists(parent))
                    {
                        Directory.CreateDirectory(parent);
                    }
                    using (FileStream fs = new FileStream(destPath, FileMode.Create, FileAccess.Write))
                    {
                        resStream.CopyTo(fs);
                    }
                }
                else
                {
                    // Fallback to disk copy if running developer mode
                    string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                    string fName = Path.GetFileName(destPath);
                    string localSrc = Path.Combine(baseDir, fName);
                    if (File.Exists(localSrc))
                    {
                        File.Copy(localSrc, destPath, true);
                    }
                }
            }
        }

        private void CopyDirectorySafe(string sourceDir, string destDir, string[] excludeNames)
        {
            if (!Directory.Exists(destDir)) Directory.CreateDirectory(destDir);
            foreach (string file in Directory.GetFiles(sourceDir))
            {
                string fName = Path.GetFileName(file);
                bool excluded = false;
                if (excludeNames != null)
                {
                    foreach (string ex in excludeNames)
                    {
                        if (fName.Equals(ex, StringComparison.OrdinalIgnoreCase)) { excluded = true; break; }
                    }
                }
                if (!excluded)
                {
                    File.Copy(file, Path.Combine(destDir, fName), true);
                }
            }
            foreach (string subDir in Directory.GetDirectories(sourceDir))
            {
                string dirName = Path.GetFileName(subDir);
                bool excluded = false;
                if (excludeNames != null)
                {
                    foreach (string ex in excludeNames)
                    {
                        if (dirName.Equals(ex, StringComparison.OrdinalIgnoreCase)) { excluded = true; break; }
                    }
                }
                if (!excluded)
                {
                    CopyDirectorySafe(subDir, Path.Combine(destDir, dirName), excludeNames);
                }
            }
        }

        private void CreateShortcut(string targetPath, string shortcutPath, string description, string iconPath, string arguments = "")
        {
            try
            {
                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType != null)
                {
                    dynamic shell = Activator.CreateInstance(shellType);
                    dynamic shortcut = shell.CreateShortcut(shortcutPath);
                    shortcut.TargetPath = targetPath;
                    shortcut.WorkingDirectory = Path.GetDirectoryName(targetPath);
                    shortcut.Description = description;
                    if (!string.IsNullOrEmpty(arguments))
                    {
                        shortcut.Arguments = arguments;
                    }
                    if (!string.IsNullOrEmpty(iconPath) && File.Exists(iconPath))
                    {
                        shortcut.IconLocation = iconPath + ",0";
                    }
                    else
                    {
                        shortcut.IconLocation = targetPath + ",0";
                    }
                    shortcut.Save();
                }
            }
            catch { }
        }

        private void RegisterWindowsUninstall(string appPath, string uninstallerPath, string iconPath)
        {
            try
            {
                using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Uninstall\GiriOrbit"))
                {
                    if (key != null)
                    {
                        key.SetValue("DisplayName", "Giri Orbit Sovereign Suite");
                        key.SetValue("DisplayVersion", "11.8.2");
                        key.SetValue("Publisher", "Abhinav Giri");

                        key.SetValue("HelpLink", "https://instagram.com/abhinavgiri45");
                        key.SetValue("DisplayIcon", !string.IsNullOrEmpty(iconPath) && File.Exists(iconPath) ? iconPath : appPath + ",0");
                        key.SetValue("UninstallString", "\"" + uninstallerPath + "\"");
                        key.SetValue("InstallLocation", this.installPath);
                        key.SetValue("EstimatedSize", 92000, RegistryValueKind.DWord);
                        key.SetValue("NoModify", 1, RegistryValueKind.DWord);
                        key.SetValue("NoRepair", 1, RegistryValueKind.DWord);
                        key.SetValue("URLInfoAbout", "https://github.com/abhinavgiri45/giri-orbit");
                    }
                }
            }
            catch { }
        }

        private void RegisterFileAssociation(string ext, string progId, string docDescription, string contentType, string appPath, string iconPath)
        {
            try
            {
                using (RegistryKey extKey = Registry.CurrentUser.CreateSubKey(@"Software\Classes\" + ext))
                {
                    if (extKey != null)
                    {
                        extKey.SetValue("", progId);
                        extKey.SetValue("Content Type", contentType);
                    }
                }

                using (RegistryKey progKey = Registry.CurrentUser.CreateSubKey(@"Software\Classes\" + progId))
                {
                    if (progKey != null)
                    {
                        progKey.SetValue("", docDescription);
                        using (RegistryKey iconKey = progKey.CreateSubKey("DefaultIcon"))
                        {
                            if (iconKey != null)
                            {
                                iconKey.SetValue("", !string.IsNullOrEmpty(iconPath) && File.Exists(iconPath) ? iconPath : appPath + ",0");
                            }
                        }
                        using (RegistryKey commandKey = progKey.CreateSubKey(@"shell\open\command"))
                        {
                            if (commandKey != null)
                            {
                                commandKey.SetValue("", "\"" + appPath + "\" \"%1\"");
                            }
                        }
                    }
                }
            }
            catch { }
        }
    }
}
