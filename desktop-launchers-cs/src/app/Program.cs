/* ============================================================================
 * GIRI ORBIT — DEDICATED WINDOWS APPLICATION ENGINE (Program.cs)
 * Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)
 * Pixel-Accurate Desktop Client for Giri Orbit / Orbit Zero-Gravity Suite
 * Supported Platforms: Windows 11, Windows 10, Windows 8.1, Windows 7
 * Architectures: x86 (32-bit), x64 (64-bit), ARM64
 * ============================================================================
 */

using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Drawing;
using System.Windows.Forms;
using Microsoft.Win32;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Diagnostics;

namespace GiriOrbit.App
{
    static class Program
    {
        [DllImport("user32.dll")]
        private static extern bool SetProcessDPIAware();

        [DllImport("user32.dll")]
        private static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

        [DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(IntPtr hWnd);

        private static Mutex appMutex;
        private const string MutexName = "GiriOrbit_SingleInstance_Mutex_2026";
        public static volatile string PendingFileToOpen = null;

        public static string DetectTargetHash(string filePath)
        {
            if (string.IsNullOrEmpty(filePath) || !File.Exists(filePath)) return "#drift";
            string ext = Path.GetExtension(filePath).ToLower();
            if (ext == ".gdrift" || ext == ".docx" || ext == ".doc" || ext == ".odt" || ext == ".txt" || ext == ".md" || ext == ".gdoc") return "#drift";
            if (ext == ".gaxis" || ext == ".xlsx" || ext == ".xls" || ext == ".ods" || ext == ".csv" || ext == ".tsv" || ext == ".gsheet") return "#axis";
            if (ext == ".gkinetic" || ext == ".pptx" || ext == ".ppt" || ext == ".odp" || ext == ".gslide") return "#kinetic";
            if (ext == ".gaegis" || ext == ".gpdf" || ext == ".pdf") return "#pdf";
            if (ext == ".giri")
            {
                try
                {
                    string head = "";
                    using (var sr = new StreamReader(filePath, Encoding.UTF8))
                    {
                        char[] buf = new char[4096];
                        int read = sr.Read(buf, 0, buf.Length);
                        head = new string(buf, 0, read).ToLower();
                    }
                    if (head.Contains("\"primary_type\":\"spreadsheet\"") || head.Contains("\"primary_type\":\"axis\"") || head.Contains("axis spreadsheet")) return "#axis";
                    if (head.Contains("\"primary_type\":\"presentation\"") || head.Contains("\"primary_type\":\"kinetic\"") || head.Contains("kinetic presentation")) return "#kinetic";
                    if (head.Contains("\"primary_type\":\"pdf\"") || head.Contains("\"primary_type\":\"aegis\"") || head.Contains("aegis pdf")) return "#pdf";
                    return "#drift";
                }
                catch
                {
                    return "#drift";
                }
            }
            return "#drift";
        }

        [STAThread]
        static void Main(string[] args)
        {
            try { SetProcessDPIAware(); } catch { }
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            // Detect dedicated tool mode from executable name or command-line args
            string exeName = Path.GetFileNameWithoutExtension(Process.GetCurrentProcess().MainModule.FileName).ToLower();
            string dedicatedTool = null;
            if (exeName.Contains("drift")) dedicatedTool = "drift";
            else if (exeName.Contains("axis")) dedicatedTool = "axis";
            else if (exeName.Contains("kinetic")) dedicatedTool = "kinetic";
            else if (exeName.Contains("aegis")) dedicatedTool = "pdf";

            string foundFile = null;
            if (args != null && args.Length > 0)
            {
                foreach (string rawArg in args)
                {
                    if (string.IsNullOrEmpty(rawArg)) continue;
                    string clean = rawArg.Trim('"', ' ');
                    string targetTool = clean.ToLower().TrimStart('-', '/');
                    if (targetTool == "writer" || targetTool == "drift") dedicatedTool = "drift";
                    else if (targetTool == "calc" || targetTool == "axis") dedicatedTool = "axis";
                    else if (targetTool == "impress" || targetTool == "kinetic") dedicatedTool = "kinetic";
                    else if (targetTool == "draw" || targetTool == "pdf" || targetTool == "aegis") dedicatedTool = "pdf";
                    else if (File.Exists(clean))
                    {
                        foundFile = clean;
                    }
                }
            }

            if (!string.IsNullOrEmpty(foundFile))
            {
                PendingFileToOpen = foundFile;
                if (string.IsNullOrEmpty(dedicatedTool))
                {
                    dedicatedTool = DetectTargetHash(foundFile).TrimStart('#');
                }
            }

            // Dedicated Single-Instance Mutex per application (allows running Drift, Axis, and Kinetic side-by-side!)
            string instanceMutexName = "GiriOrbit_Suite_Instance_2026";
            if (dedicatedTool == "drift") instanceMutexName = "GiriDrift_Dedicated_Instance_2026";
            else if (dedicatedTool == "axis") instanceMutexName = "GiriAxis_Dedicated_Instance_2026";
            else if (dedicatedTool == "kinetic") instanceMutexName = "GiriKinetic_Dedicated_Instance_2026";
            else if (dedicatedTool == "pdf") instanceMutexName = "GiriAegis_Dedicated_Instance_2026";

            bool createdNew;
            appMutex = new Mutex(true, instanceMutexName, out createdNew);
            if (!createdNew)
            {
                // Bring existing instance of this specific tool to front
                Process current = Process.GetCurrentProcess();
                foreach (Process p in Process.GetProcessesByName(current.ProcessName))
                {
                    if (p.Id != current.Id)
                    {
                        ShowWindow(p.MainWindowHandle, 9); // SW_RESTORE
                        SetForegroundWindow(p.MainWindowHandle);
                        break;
                    }
                }
                return;
            }

            // Register browser features in current user registry
            ConfigureBrowserRegistry();

            // Start embedded offline web server or connect to active local port
            int port = 52718;
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string webRoot = Path.Combine(baseDir, "app_data");
            if (!Directory.Exists(webRoot))
            {
                webRoot = baseDir; // Fallback to current directory
            }

            EmbeddedHttpServer server = null;
            for (int p = 52718; p <= 52726; p++)
            {
                try
                {
                    server = new EmbeddedHttpServer(webRoot, p);
                    server.Start();
                    port = p;
                    break;
                }
                catch
                {
                    // Check if an existing local server is running at port p
                    try
                    {
                        HttpWebRequest req = (HttpWebRequest)WebRequest.Create(string.Format("http://127.0.0.1:{0}/index.html", p));
                        req.Timeout = 600;
                        using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                        {
                            if (resp.StatusCode == HttpStatusCode.OK)
                            {
                                port = p;
                                server = null; // Reuse existing local server
                                break;
                            }
                        }
                    }
                    catch { }
                }
            }

            string initialUrl = string.Format("http://127.0.0.1:{0}/index.html", port);
            if (!string.IsNullOrEmpty(dedicatedTool))
            {
                initialUrl += "#" + dedicatedTool;
            }
            else
            {
                initialUrl += "#hub";
            }

            string modernBrowser = FindModernBrowser();
            if (!string.IsNullOrEmpty(modernBrowser))
            {
                string profileDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "GiriOrbit", "AppData", "Profile");
                if (!Directory.Exists(profileDir)) Directory.CreateDirectory(profileDir);

                // Launch Edge Chromium in dedicated standalone App Mode
                // Pixel-accurate reproduction of the full web office suite, zero address bar, zero browser tabs, full hardware acceleration
                string appArgs = string.Format("--app=\"{0}\" --user-data-dir=\"{1}\" --window-size=1366,850", initialUrl, profileDir);
                try
                {
                    ProcessStartInfo psi = new ProcessStartInfo(modernBrowser, appArgs);
                    psi.UseShellExecute = false;
                    Process browserProc = Process.Start(psi);
                    if (browserProc != null)
                    {
                        browserProc.WaitForExit();
                    }
                }
                catch
                {
                    MainWindow mainForm = new MainWindow(initialUrl, server, dedicatedTool);
                    Application.Run(mainForm);
                }
            }
            else
            {
                MainWindow mainForm = new MainWindow(initialUrl, server, dedicatedTool);
                Application.Run(mainForm);
            }

            // Cleanup server safely (only stop if no sibling Giri apps are running)
            if (server != null)
            {
                bool othersRunning = false;
                Process current = Process.GetCurrentProcess();
                foreach (Process p in Process.GetProcesses())
                {
                    try
                    {
                        if (p.Id != current.Id && (p.ProcessName.StartsWith("Giri", StringComparison.OrdinalIgnoreCase)))
                        {
                            othersRunning = true;
                            break;
                        }
                    }
                    catch { }
                }
                if (!othersRunning)
                {
                    server.Stop();
                }
            }
            GC.KeepAlive(appMutex);
        }

        public static string FindModernBrowser()
        {
            string[] candidates = new string[]
            {
                @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                @"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe"),
                @"C:\Program Files\Google\Chrome\Application\chrome.exe",
                @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
                @"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
            };

            foreach (string p in candidates)
            {
                if (File.Exists(p)) return p;
            }

            try
            {
                using (RegistryKey k = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\msedge.exe"))
                {
                    if (k != null)
                    {
                        object v = k.GetValue("");
                        if (v != null && File.Exists(v.ToString())) return v.ToString();
                    }
                }
                using (RegistryKey k = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe"))
                {
                    if (k != null)
                    {
                        object v = k.GetValue("");
                        if (v != null && File.Exists(v.ToString())) return v.ToString();
                    }
                }
            }
            catch { }

            return null;
        }

        private static void ConfigureBrowserRegistry()
        {
            try
            {
                string appName = Path.GetFileName(Process.GetCurrentProcess().MainModule.FileName);
                using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION"))
                {
                    if (key != null) key.SetValue(appName, 11001, RegistryValueKind.DWord);
                }
                using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_ENABLE_CLIPBOARD_INPUT_FOR_CONTENTEDITABLE"))
                {
                    if (key != null) key.SetValue(appName, 1, RegistryValueKind.DWord);
                }
                using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_GPU_RENDERING"))
                {
                    if (key != null) key.SetValue(appName, 1, RegistryValueKind.DWord);
                }
            }
            catch { }
        }
    }

    // --- High-Performance Embedded Local HTTP Server ---
    public class EmbeddedHttpServer
    {
        private readonly HttpListener listener;
        private readonly string rootDirectory;
        private readonly int port;
        private bool isRunning;
        private Thread listenThread;

        public EmbeddedHttpServer(string rootDir, int port)
        {
            this.rootDirectory = rootDir;
            this.port = port;
            this.listener = new HttpListener();
            this.listener.Prefixes.Add(string.Format("http://127.0.0.1:{0}/", port));
            this.listener.Prefixes.Add(string.Format("http://localhost:{0}/", port));
        }

        public void Start()
        {
            this.listener.Start();
            this.isRunning = true;
            this.listenThread = new Thread(ListenLoop);
            this.listenThread.IsBackground = true;
            this.listenThread.Start();
        }

        public void Stop()
        {
            this.isRunning = false;
            try { this.listener.Stop(); } catch { }
        }

        private void ListenLoop()
        {
            while (this.isRunning)
            {
                try
                {
                    HttpListenerContext ctx = this.listener.GetContext();
                    ThreadPool.QueueUserWorkItem(HandleRequest, ctx);
                }
                catch
                {
                    if (!this.isRunning) break;
                }
            }
        }

        private void HandleRequest(object state)
        {
            HttpListenerContext context = (HttpListenerContext)state;
            try
            {
                string rawUrl = context.Request.Url.AbsolutePath.TrimStart('/');
                if (string.IsNullOrEmpty(rawUrl)) rawUrl = "index.html";

                if (rawUrl.Equals("api/opened_file", StringComparison.OrdinalIgnoreCase))
                {
                    string responseJson = "{\"hasFile\":false}";
                    string path = Program.PendingFileToOpen;
                    if (!string.IsNullOrEmpty(path) && File.Exists(path))
                    {
                        try
                        {
                            string fileContent = File.ReadAllText(path, Encoding.UTF8);
                            string fName = Path.GetFileName(path);
                            string fExt = Path.GetExtension(path).TrimStart('.').ToLower();
                            responseJson = string.Format("{{\"hasFile\":true,\"name\":{0},\"ext\":{1},\"content\":{2}}}",
                                EscapeJsonString(fName),
                                EscapeJsonString(fExt),
                                EscapeJsonString(fileContent));
                            Program.PendingFileToOpen = null;
                        }
                        catch { }
                    }
                    byte[] jsonBytes = Encoding.UTF8.GetBytes(responseJson);
                    context.Response.ContentType = "application/json; charset=utf-8";
                    context.Response.ContentLength64 = jsonBytes.Length;
                    context.Response.AddHeader("Cache-Control", "no-cache");
                    context.Response.AddHeader("Access-Control-Allow-Origin", "*");
                    context.Response.OutputStream.Write(jsonBytes, 0, jsonBytes.Length);
                    context.Response.StatusCode = 200;
                    return;
                }

                rawUrl = rawUrl.Replace('/', Path.DirectorySeparatorChar);
                string filePath = Path.Combine(this.rootDirectory, rawUrl);

                if (File.Exists(filePath))
                {
                    byte[] bytes = File.ReadAllBytes(filePath);
                    context.Response.ContentType = GetMimeType(Path.GetExtension(filePath));
                    context.Response.ContentLength64 = bytes.Length;
                    context.Response.AddHeader("Cache-Control", "no-cache");
                    context.Response.AddHeader("Access-Control-Allow-Origin", "*");
                    context.Response.OutputStream.Write(bytes, 0, bytes.Length);
                    context.Response.StatusCode = 200;
                }
                else
                {
                    context.Response.StatusCode = 404;
                    byte[] notFound = Encoding.UTF8.GetBytes("Giri Orbit: File Not Found");
                    context.Response.OutputStream.Write(notFound, 0, notFound.Length);
                }
            }
            catch { }
            finally
            {
                try { context.Response.OutputStream.Close(); } catch { }
            }
        }

        private static string EscapeJsonString(string s)
        {
            if (s == null) return "\"\"";
            StringBuilder sb = new StringBuilder();
            sb.Append('"');
            foreach (char c in s)
            {
                switch (c)
                {
                    case '\\': sb.Append("\\\\"); break;
                    case '"': sb.Append("\\\""); break;
                    case '\b': sb.Append("\\b"); break;
                    case '\f': sb.Append("\\f"); break;
                    case '\n': sb.Append("\\n"); break;
                    case '\r': sb.Append("\\r"); break;
                    case '\t': sb.Append("\\t"); break;
                    default:
                        if (c < ' ') sb.AppendFormat("\\u{0:x4}", (int)c);
                        else sb.Append(c);
                        break;
                }
            }
            sb.Append('"');
            return sb.ToString();
        }

        private string GetMimeType(string ext)
        {
            if (string.IsNullOrEmpty(ext)) return "text/plain";
            switch (ext.ToLower())
            {
                case ".html":
                case ".htm": return "text/html; charset=utf-8";
                case ".css": return "text/css; charset=utf-8";
                case ".js": return "application/javascript; charset=utf-8";
                case ".json": return "application/json; charset=utf-8";
                case ".giri": return "application/x-giri-universal-office; charset=utf-8";
                case ".gdrift": return "application/msword; charset=utf-8";
                case ".gaxis": return "application/vnd.ms-excel; charset=utf-8";
                case ".gkinetic": return "application/vnd.ms-powerpoint; charset=utf-8";
                case ".gaegis":
                case ".gpdf":
                case ".pdf": return "application/pdf";
                case ".png": return "image/png";
                case ".jpg":
                case ".jpeg": return "image/jpeg";
                case ".gif": return "image/gif";
                case ".svg": return "image/svg+xml";
                case ".ico": return "image/x-icon";
                case ".woff2": return "font/woff2";
                case ".woff": return "font/woff";
                case ".ttf": return "font/ttf";
                default: return "application/octet-stream";
            }
        }
    }

    // --- Native Main Window ---
    public class MainWindow : Form
    {
        private WebBrowser browser;
        private NotifyIcon trayIcon;
        private ContextMenuStrip trayMenu;
        private MenuStrip mainMenu;
        private bool isFullScreen = false;
        private FormWindowState previousState;
        private FormBorderStyle previousBorderStyle;
        private Rectangle previousBounds;
        private readonly string startUrl;
        private readonly EmbeddedHttpServer server;
        private System.Threading.Timer updateTimer;

        private readonly string currentTool;

        public MainWindow(string url, EmbeddedHttpServer srv, string dedicatedTool)
        {
            this.startUrl = url;
            this.server = srv;
            this.currentTool = dedicatedTool;
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            // Title tailored to dedicated tool
            if (this.currentTool == "drift")
            {
                this.Text = "Document 1 — Giri Drift (Document Composer)";
            }
            else if (this.currentTool == "axis")
            {
                this.Text = "Workbook 1 — Giri Axis (Financial Matrix)";
            }
            else if (this.currentTool == "kinetic")
            {
                this.Text = "Presentation 1 — Giri Kinetic (Cinematic Show)";
            }
            else if (this.currentTool == "pdf")
            {
                this.Text = "Document 1 — Giri Aegis (PDF Studio & Digital Seal)";
            }
            else
            {
                this.Text = "Giri Orbit — Sovereign Enterprise Workspace";
            }

            this.Size = new Size(1280, 820);
            this.MinimumSize = new Size(800, 600);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(30, 34, 42);

            // Dedicated Icon loading: Use associated executable icon first, fallback to embedded AppIcon
            try
            {
                this.Icon = Icon.ExtractAssociatedIcon(Process.GetCurrentProcess().MainModule.FileName);
            }
            catch
            {
                try
                {
                    using (Stream s = Assembly.GetExecutingAssembly().GetManifestResourceStream("GiriOrbit.AppIcon"))
                    {
                        if (s != null) this.Icon = new Icon(s);
                    }
                }
                catch { }
            }

            // Top Menu Bar
            mainMenu = new MenuStrip();
            mainMenu.BackColor = Color.FromArgb(40, 44, 52);
            mainMenu.ForeColor = Color.FromArgb(230, 235, 245);
            mainMenu.RenderMode = ToolStripRenderMode.System;

            // Dedicated File Menu per tool
            ToolStripMenuItem fileMenu = new ToolStripMenuItem("&File");

            if (this.currentTool == "drift")
            {
                fileMenu.DropDownItems.Add("&New Blank Document (Ctrl+N)", null, (s, e) => EvalScript("localStorage.removeItem('giri_orbit_drift_doc'); location.reload();"));
                fileMenu.DropDownItems.Add("&Open Document (.docx, .gdrift, .giri)... (Ctrl+O)", null, (s, e) => OpenOfficeFileDialog("Document Files (*.gdrift;*.docx;*.doc;*.odt;*.giri;*.txt)|*.gdrift;*.docx;*.doc;*.odt;*.giri;*.txt|All Files (*.*)|*.*"));
                fileMenu.DropDownItems.Add("&Save Document (Ctrl+S)", null, (s, e) => EvalScript("var b = document.getElementById('btn-drift-save-device'); if (b) b.click();"));
                fileMenu.DropDownItems.Add("&Export Document (.giri, .docx, .pdf)...", null, (s, e) => EvalScript("if (window.orbitPlatform && window.orbitPlatform.openExportModal) window.orbitPlatform.openExportModal('drift');"));
                fileMenu.DropDownItems.Add("&Print Document... (Ctrl+P)", null, (s, e) => EvalScript("window.print();"));
                fileMenu.DropDownItems.Add(new ToolStripSeparator());
                fileMenu.DropDownItems.Add("Launch Giri &Axis (Spreadsheet)...", null, (s, e) => LaunchSiblingTool("GiriAxis.exe", "-axis"));
                fileMenu.DropDownItems.Add("Launch Giri &Kinetic (Presentation)...", null, (s, e) => LaunchSiblingTool("GiriKinetic.exe", "-kinetic"));
                fileMenu.DropDownItems.Add("&Return to Suite Hub", null, (s, e) => NavigateTo("#launcher"));
            }
            else if (this.currentTool == "axis")
            {
                fileMenu.DropDownItems.Add("&New Blank Workbook (Ctrl+N)", null, (s, e) => EvalScript("localStorage.removeItem('giri_orbit_axis_sheets'); location.reload();"));
                fileMenu.DropDownItems.Add("&Open Spreadsheet (.xlsx, .gaxis, .csv, .giri)... (Ctrl+O)", null, (s, e) => OpenOfficeFileDialog("Spreadsheet Files (*.gaxis;*.xlsx;*.xls;*.ods;*.csv;*.giri)|*.gaxis;*.xlsx;*.xls;*.ods;*.csv;*.giri|All Files (*.*)|*.*"));
                fileMenu.DropDownItems.Add("&Save Workbook (Ctrl+S)", null, (s, e) => EvalScript("var b = document.getElementById('btn-axis-save-device'); if (b) b.click();"));
                fileMenu.DropDownItems.Add("&Export Spreadsheet (.giri, .xlsx, .csv)...", null, (s, e) => EvalScript("if (window.orbitPlatform && window.orbitPlatform.openExportModal) window.orbitPlatform.openExportModal('axis');"));
                fileMenu.DropDownItems.Add("&Print Spreadsheet... (Ctrl+P)", null, (s, e) => EvalScript("window.print();"));
                fileMenu.DropDownItems.Add(new ToolStripSeparator());
                fileMenu.DropDownItems.Add("Launch Giri &Drift (Document Composer)...", null, (s, e) => LaunchSiblingTool("GiriDrift.exe", "-drift"));
                fileMenu.DropDownItems.Add("Launch Giri &Kinetic (Presentation)...", null, (s, e) => LaunchSiblingTool("GiriKinetic.exe", "-kinetic"));
                fileMenu.DropDownItems.Add("&Return to Suite Hub", null, (s, e) => NavigateTo("#launcher"));
            }
            else if (this.currentTool == "kinetic")
            {
                fileMenu.DropDownItems.Add("&New Presentation (Ctrl+N)", null, (s, e) => EvalScript("localStorage.removeItem('giri_orbit_kinetic_deck'); location.reload();"));
                fileMenu.DropDownItems.Add("&Open Presentation (.pptx, .gkinetic, .giri)... (Ctrl+O)", null, (s, e) => OpenOfficeFileDialog("Presentation Files (*.gkinetic;*.pptx;*.ppt;*.odp;*.giri)|*.gkinetic;*.pptx;*.ppt;*.odp;*.giri|All Files (*.*)|*.*"));
                fileMenu.DropDownItems.Add("&Save Presentation (Ctrl+S)", null, (s, e) => EvalScript("var b = document.getElementById('btn-kinetic-save-device'); if (b) b.click();"));
                fileMenu.DropDownItems.Add("&Export Presentation (.giri, .pptx, .pdf)...", null, (s, e) => EvalScript("if (window.orbitPlatform && window.orbitPlatform.openExportModal) window.orbitPlatform.openExportModal('kinetic');"));
                fileMenu.DropDownItems.Add("&Present Slideshow (F5)", null, (s, e) => EvalScript("var b = document.getElementById('btn-kinetic-present'); if (b) b.click();"));
                fileMenu.DropDownItems.Add("&Print Slide Handouts... (Ctrl+P)", null, (s, e) => EvalScript("window.print();"));
                fileMenu.DropDownItems.Add(new ToolStripSeparator());
                fileMenu.DropDownItems.Add("Launch Giri &Drift (Document Composer)...", null, (s, e) => LaunchSiblingTool("GiriDrift.exe", "-drift"));
                fileMenu.DropDownItems.Add("Launch Giri &Axis (Spreadsheet)...", null, (s, e) => LaunchSiblingTool("GiriAxis.exe", "-axis"));
                fileMenu.DropDownItems.Add("&Return to Suite Hub", null, (s, e) => NavigateTo("#launcher"));
            }
            else
            {
                fileMenu.DropDownItems.Add("&Return to Suite Hub", null, (s, e) => NavigateTo("#launcher"));
                fileMenu.DropDownItems.Add(new ToolStripSeparator());
                fileMenu.DropDownItems.Add("&Open Universal Office File (.giri, .docx, .xlsx)...", null, (s, e) => OpenOfficeFileDialog(null));
                fileMenu.DropDownItems.Add(new ToolStripSeparator());
                fileMenu.DropDownItems.Add("New &Giri Drift Document", null, (s, e) => NavigateTo("#drift"));
                fileMenu.DropDownItems.Add("New &Giri Axis Spreadsheet", null, (s, e) => NavigateTo("#axis"));
                fileMenu.DropDownItems.Add("New &Giri Kinetic Presentation", null, (s, e) => NavigateTo("#kinetic"));
                fileMenu.DropDownItems.Add("New &Giri Aegis PDF Document", null, (s, e) => NavigateTo("#pdf"));
                fileMenu.DropDownItems.Add("New &Girionix AI Session", null, (s, e) => NavigateTo("#girionix"));
            }

            fileMenu.DropDownItems.Add(new ToolStripSeparator());
            fileMenu.DropDownItems.Add("E&xit", null, (s, e) => Application.Exit());

            // View Menu
            ToolStripMenuItem viewMenu = new ToolStripMenuItem("&View");
            viewMenu.DropDownItems.Add("&Reload (F5)", null, (s, e) => browser.Refresh());
            viewMenu.DropDownItems.Add("&Toggle Fullscreen (F11)", null, (s, e) => ToggleFullScreen());
            viewMenu.DropDownItems.Add(new ToolStripSeparator());
            viewMenu.DropDownItems.Add("Zoom &In (120%)", null, (s, e) => ZoomBrowser(120));
            viewMenu.DropDownItems.Add("Zoom &Normal (100%)", null, (s, e) => ZoomBrowser(100));
            viewMenu.DropDownItems.Add("Zoom &Out (80%)", null, (s, e) => ZoomBrowser(80));

            // Help Menu
            ToolStripMenuItem helpMenu = new ToolStripMenuItem("&Help");
            helpMenu.DropDownItems.Add("&Check for Updates...", null, (s, e) => CheckForUpdates(true));
            helpMenu.DropDownItems.Add(new ToolStripSeparator());
            helpMenu.DropDownItems.Add("PresentationGO &Global Templates (www.presentationgo.com)...", null, (s, e) => {
                try { Process.Start(new ProcessStartInfo("https://www.presentationgo.com/") { UseShellExecute = true }); } catch { }
            });
            helpMenu.DropDownItems.Add(new ToolStripSeparator());
            helpMenu.DropDownItems.Add("&About " + (this.currentTool != null ? "Giri " + char.ToUpper(this.currentTool[0]) + this.currentTool.Substring(1) : "Giri Orbit") + "...", null, (s, e) => ShowAboutDialog());
            helpMenu.DropDownItems.Add("&Sovereign Computing Architecture", null, (s, e) => {
                MessageBox.Show("Giri Orbit executes entirely within client memory.\nZero telemetry, total cryptographic data sovereignty.",
                    "Sovereign Architecture", MessageBoxButtons.OK, MessageBoxIcon.Information);
            });

            mainMenu.Items.Add(fileMenu);
            mainMenu.Items.Add(viewMenu);
            mainMenu.Items.Add(helpMenu);
            this.MainMenuStrip = mainMenu;
            this.Controls.Add(mainMenu);

            // Web Browser Container
            browser = new WebBrowser();
            browser.Dock = DockStyle.Fill;
            browser.ScriptErrorsSuppressed = true;
            browser.IsWebBrowserContextMenuEnabled = false;
            browser.AllowWebBrowserDrop = true;
            this.Controls.Add(browser);
            browser.BringToFront();

            // Tray Icon
            trayMenu = new ContextMenuStrip();
            trayMenu.Items.Add("Open Giri Orbit", null, (s, e) => RestoreFromTray());
            trayMenu.Items.Add(new ToolStripSeparator());
            trayMenu.Items.Add("Giri Drift (Executive Document Composer)", null, (s, e) => { RestoreFromTray(); NavigateTo("#drift"); });
            trayMenu.Items.Add("Giri Axis (High-Velocity Financial Matrix)", null, (s, e) => { RestoreFromTray(); NavigateTo("#axis"); });
            trayMenu.Items.Add("Giri Kinetic (Cinematic Presentation Show)", null, (s, e) => { RestoreFromTray(); NavigateTo("#kinetic"); });
            trayMenu.Items.Add("Giri Aegis (PDF Studio & Digital Seal)", null, (s, e) => { RestoreFromTray(); NavigateTo("#pdf"); });
            trayMenu.Items.Add("Girionix AI Polymath Copilot", null, (s, e) => { RestoreFromTray(); NavigateTo("#girionix"); });
            trayMenu.Items.Add(new ToolStripSeparator());
            trayMenu.Items.Add("Exit", null, (s, e) => Application.Exit());

            trayIcon = new NotifyIcon();
            trayIcon.Text = "Giri Orbit — Zero-Gravity Suite";
            trayIcon.Icon = this.Icon;
            trayIcon.ContextMenuStrip = trayMenu;
            trayIcon.Visible = true;
            trayIcon.DoubleClick += (s, e) => RestoreFromTray();

            // Keyboard Shortcuts
            this.KeyPreview = true;
            this.KeyDown += (s, e) =>
            {
                if (e.KeyCode == Keys.F11)
                {
                    ToggleFullScreen();
                    e.Handled = true;
                }
                else if (e.KeyCode == Keys.F5)
                {
                    browser.Refresh();
                    e.Handled = true;
                }
            };

            // Navigate to start URL
            browser.Navigate(startUrl);

            // Automatic Online Background Updater (Checks GitHub repo version.json every 15 minutes)
            this.Shown += (s, e) => CheckForUpdates(false);
            updateTimer = new System.Threading.Timer((state) => CheckForUpdates(false), null, TimeSpan.FromMinutes(2), TimeSpan.FromMinutes(15));
            try
            {
                System.Net.NetworkInformation.NetworkChange.NetworkAvailabilityChanged += (s, e) =>
                {
                    if (e.IsAvailable) CheckForUpdates(false);
                };
            }
            catch { }
        }

        private void CheckForUpdates(bool isManual)
        {
            Thread updateThread = new Thread(() =>
            {
                try
                {
                    ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; // Tls12
                    string updateUrl = "https://raw.githubusercontent.com/abhinavgiri45/giri-orbit/main/version.json?t=" + DateTime.UtcNow.Ticks;
                    string json;
                    using (WebClient client = new WebClient())
                    {
                        client.Headers.Add("User-Agent", "GiriOrbit-Windows/11.8");
                        client.CachePolicy = new System.Net.Cache.RequestCachePolicy(System.Net.Cache.RequestCacheLevel.BypassCache);
                        json = client.DownloadString(updateUrl);
                    }

                    string remoteVer = ExtractJsonValue(json, "version");
                    string bundleUrl = ExtractJsonValue(json, "assetsBundleUrl");
                    string currentVer = "11.8.2";

                    if (!string.IsNullOrEmpty(remoteVer) && remoteVer != currentVer)
                    {
                        if (isManual)
                        {
                            this.Invoke(new Action(() =>
                            {
                                DialogResult dr = MessageBox.Show(
                                    string.Format("A new version of Giri Orbit (v{0}) is available on GitHub!\n\nWould you like to automatically download and apply this update now?", remoteVer),
                                    "Giri Orbit — Update Available",
                                    MessageBoxButtons.YesNo,
                                    MessageBoxIcon.Information);

                                if (dr == DialogResult.Yes)
                                {
                                    PerformHotUpdate(bundleUrl, remoteVer, true);
                                }
                            }));
                        }
                        else
                        {
                            // Automatic online push: silently download and update payload
                            PerformHotUpdate(bundleUrl, remoteVer, false);
                        }
                    }
                    else if (isManual)
                    {
                        this.Invoke(new Action(() =>
                        {
                            MessageBox.Show(
                                string.Format("You are running the latest version of Giri Orbit (v{0}).\nYour system is completely up to date.", currentVer),
                                "Giri Orbit — Up to Date",
                                MessageBoxButtons.OK,
                                MessageBoxIcon.Information);
                        }));
                    }
                }
                catch (Exception ex)
                {
                    if (isManual)
                    {
                        this.Invoke(new Action(() =>
                        {
                            MessageBox.Show("Could not connect to the Giri Orbit update server.\n" + ex.Message,
                                "Update Check", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                        }));
                    }
                }
            });
            updateThread.IsBackground = true;
            updateThread.Start();
        }

        private void PerformHotUpdate(string bundleUrl, string newVer, bool isManual)
        {
            try
            {
                string tempZip = Path.Combine(Path.GetTempPath(), "giri_orbit_update.zip");
                using (WebClient client = new WebClient())
                {
                    client.DownloadFile(bundleUrl, tempZip);
                }

                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                string targetDir = Path.Combine(baseDir, "app_data");
                if (!Directory.Exists(targetDir)) targetDir = baseDir;

                ProcessStartInfo psi;
                if (File.Exists(@"C:\Windows\System32\tar.exe"))
                {
                    psi = new ProcessStartInfo("tar.exe", string.Format("-xf \"{0}\" -C \"{1}\"", tempZip, targetDir));
                }
                else
                {
                    psi = new ProcessStartInfo("powershell.exe",
                        string.Format("-NoProfile -Command \"Expand-Archive -Path '{0}' -DestinationPath '{1}' -Force\"", tempZip, targetDir));
                }
                psi.CreateNoWindow = true;
                psi.UseShellExecute = false;
                Process p = Process.Start(psi);
                p.WaitForExit();

                try { File.Delete(tempZip); } catch { }

                this.Invoke(new Action(() =>
                {
                    if (isManual)
                    {
                        MessageBox.Show(
                            string.Format("Giri Orbit has been successfully updated to v{0}!\nThe workspace will now reload.", newVer),
                            "Update Complete",
                            MessageBoxButtons.OK,
                            MessageBoxIcon.Information);
                    }
                    else if (trayIcon != null)
                    {
                        trayIcon.ShowBalloonTip(4500, "Giri Orbit Updated",
                            string.Format("Giri Orbit has been automatically updated to v{0} from GitHub.", newVer),
                            ToolTipIcon.Info);
                    }

                    if (browser != null) browser.Refresh();
                }));
            }
            catch (Exception ex)
            {
                if (isManual)
                {
                    MessageBox.Show("Update failed: " + ex.Message, "Update Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private string ExtractJsonValue(string json, string key)
        {
            try
            {
                string pattern = "\"" + key + "\":\\s*\"([^\"]+)\"";
                System.Text.RegularExpressions.Match m = System.Text.RegularExpressions.Regex.Match(json, pattern);
                if (m.Success) return m.Groups[1].Value;
            }
            catch { }
            return "";
        }

        private void EvalScript(string script)
        {
            try
            {
                if (browser != null && browser.Document != null)
                {
                    browser.Document.InvokeScript("eval", new object[] { script });
                }
            }
            catch { }
        }

        private void OpenOfficeFileDialog(string customFilter = null)
        {
            try
            {
                using (OpenFileDialog ofd = new OpenFileDialog())
                {
                    ofd.Title = "Open Office Document — " + this.Text;
                    ofd.Filter = customFilter ?? "Universal Office Files (*.giri;*.gdrift;*.gaxis;*.gkinetic;*.gaegis;*.docx;*.xlsx;*.pptx;*.pdf)|*.giri;*.gdrift;*.gaxis;*.gkinetic;*.gaegis;*.docx;*.xlsx;*.pptx;*.pdf|Universal .giri Container (*.giri)|*.giri|All Supported Files (*.*)|*.*";
                    if (ofd.ShowDialog(this) == DialogResult.OK)
                    {
                        Program.PendingFileToOpen = ofd.FileName;
                        string hash = Program.DetectTargetHash(ofd.FileName);
                        NavigateTo(hash);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Could not open file: " + ex.Message, "Open Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void LaunchSiblingTool(string targetExeName, string fallbackHash)
        {
            try
            {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                string exePath = Path.Combine(baseDir, targetExeName);
                if (File.Exists(exePath))
                {
                    Process.Start(new ProcessStartInfo(exePath) { WorkingDirectory = baseDir });
                }
                else
                {
                    string orbitPath = Path.Combine(baseDir, "GiriOrbit.exe");
                    if (File.Exists(orbitPath))
                    {
                        Process.Start(new ProcessStartInfo(orbitPath, fallbackHash) { WorkingDirectory = baseDir });
                    }
                    else
                    {
                        NavigateTo(fallbackHash);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Could not launch tool: " + ex.Message, "Launch Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        private void NavigateTo(string hash)
        {
            try
            {
                string cur = browser.Url != null ? browser.Url.ToString() : startUrl;
                int hashIdx = cur.IndexOf('#');
                string basePart = hashIdx >= 0 ? cur.Substring(0, hashIdx) : cur;
                browser.Navigate(basePart + hash);
            }
            catch { }
        }

        private void ZoomBrowser(int zoomPct)
        {
            try
            {
                if (browser.Document != null && browser.Document.Body != null)
                {
                    browser.Document.Body.Style = string.Format("zoom: {0}%;", zoomPct);
                }
            }
            catch { }
        }

        private void ToggleFullScreen()
        {
            if (!isFullScreen)
            {
                previousState = this.WindowState;
                previousBorderStyle = this.FormBorderStyle;
                previousBounds = this.Bounds;

                this.FormBorderStyle = FormBorderStyle.None;
                this.WindowState = FormWindowState.Maximized;
                mainMenu.Visible = false;
                isFullScreen = true;
            }
            else
            {
                this.FormBorderStyle = previousBorderStyle;
                this.WindowState = previousState;
                this.Bounds = previousBounds;
                mainMenu.Visible = true;
                isFullScreen = false;
            }
        }

        private void RestoreFromTray()
        {
            this.Show();
            this.WindowState = FormWindowState.Normal;
            this.BringToFront();
            this.Activate();
        }

        private void ShowAboutDialog()
        {
            string msg = "Giri Orbit — Zero-Gravity Sovereign Office Suite\n" +
                         "Version 11.8 (Sovereign Desktop Edition)\n\n" +
                         "Made by Abhinav Giri (GitHub: @abhinavgiri45 | Instagram: @abhinavgiri45)\n" +
                         "Architecture: " + (IntPtr.Size == 8 ? "64-bit (x64 / ARM64)" : "32-bit (x86)") + "\n\n" +
                         "Included Applications:\n" +
                         "• Giri Drift (Writer) (Giri Drift)\n" +
                         "• Giri Axis (Calc) (Giri Axis)\n" +
                         "• Giri Kinetic (Impress) (Giri Kinetic)\n" +
                         "• Giri Aegis (PDF Studio) (Giri Aegis PDF Studio)\n\n" +
                         "Total cryptographic client data sovereignty.";
            MessageBox.Show(msg, "About Giri Orbit", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            if (trayIcon != null)
            {
                trayIcon.Visible = false;
                trayIcon.Dispose();
            }
            base.OnFormClosing(e);
        }
    }
}
