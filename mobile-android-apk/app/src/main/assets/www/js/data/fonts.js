/**
 * ============================================================================
 * GIRI ORBIT — COMPREHENSIVE WORLD FONTS CATALOG (fonts.js)
 * By GIRI Corporation (A Subsidiary of Giri Group)
 * ============================================================================
 * Contains 175+ of the world's most widely used typography families across:
 * 1. Standard Office Classics (Calibri, Aptos, Arial, Times New Roman, etc.)
 * 2. Modern Sans-Serif & Web Standards (Inter, Roboto, Montserrat, Poppins, etc.)
 * 3. Editorial & Classic Serif (Merriweather, Playfair, Lora, Garamond, etc.)
 * 4. Monospace & Code (Consolas, JetBrains Mono, Fira Code, Courier New, etc.)
 * 5. Script, Handwriting & Display (Brush Script, Dancing Script, Caveat, etc.)
 * 6. World & Multi-Lingual Scripts (Devanagari/Hindi, Arabic, Japanese, Korean, Chinese, Bengali, Tamil, etc.)
 *
 * Every entry provides:
 * - Bulletproof cross-platform fallback stack (Windows, macOS, Linux, iOS, Android)
 * - Automatic Google Font dynamic loading when online
 * - Offline sovereign compatibility
 */

export const DEFAULT_FONT_FAMILY = "Calibri, 'Segoe UI', Arial, sans-serif";
export const DEFAULT_FONT_NAME = "Calibri";

export const WORLD_FONTS_CATALOG = [
  // ==========================================================================
  // 1. STANDARD OFFICE CLASSICS (Calibri is the Universal Default)
  // ==========================================================================
  { name: 'Calibri', family: "Calibri, 'Segoe UI', Arial, Helvetica, sans-serif", category: 'Standard Office Classics', isDefault: true },
  { name: 'Calibri Light', family: "'Calibri Light', Calibri, 'Segoe UI Light', sans-serif", category: 'Standard Office Classics' },
  { name: 'Aptos', family: "Aptos, 'Segoe UI', Calibri, Arial, sans-serif", category: 'Standard Office Classics' },
  { name: 'Aptos Display', family: "'Aptos Display', Aptos, 'Segoe UI', sans-serif", category: 'Standard Office Classics' },
  { name: 'Aptos Serif', family: "'Aptos Serif', Aptos, Georgia, 'Times New Roman', serif", category: 'Standard Office Classics' },
  { name: 'Segoe UI', family: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif", category: 'Standard Office Classics' },
  { name: 'Segoe UI Variable', family: "'Segoe UI Variable', 'Segoe UI', sans-serif", category: 'Standard Office Classics' },
  { name: 'Segoe UI Semibold', family: "'Segoe UI Semibold', 'Segoe UI', sans-serif", category: 'Standard Office Classics' },
  { name: 'Arial', family: "Arial, 'Helvetica Neue', Helvetica, 'Liberation Sans', sans-serif", category: 'Standard Office Classics' },
  { name: 'Arial Black', family: "'Arial Black', Gadget, sans-serif", category: 'Standard Office Classics' },
  { name: 'Arial Narrow', family: "'Arial Narrow', Arial, sans-serif", category: 'Standard Office Classics' },
  { name: 'Arial Rounded MT Bold', family: "'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif", category: 'Standard Office Classics' },
  { name: 'Times New Roman', family: "'Times New Roman', Times, Georgia, 'Liberation Serif', serif", category: 'Standard Office Classics' },
  { name: 'Georgia', family: "Georgia, 'Times New Roman', Times, serif", category: 'Standard Office Classics' },
  { name: 'Garamond', family: "Garamond, 'EB Garamond', Georgia, 'Times New Roman', serif", category: 'Standard Office Classics' },
  { name: 'Cambria', family: "Cambria, Georgia, 'Times New Roman', serif", category: 'Standard Office Classics' },
  { name: 'Cambria Math', family: "'Cambria Math', Cambria, Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Constantia', family: "Constantia, Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Corbel', family: "Corbel, 'Segoe UI', Arial, sans-serif", category: 'Standard Office Classics' },
  { name: 'Candara', family: "Candara, 'Segoe UI', Arial, sans-serif", category: 'Standard Office Classics' },
  { name: 'Trebuchet MS', family: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', Helvetica, sans-serif", category: 'Standard Office Classics' },
  { name: 'Tahoma', family: "Tahoma, Verdana, Segoe, sans-serif", category: 'Standard Office Classics' },
  { name: 'Verdana', family: "Verdana, Geneva, 'DejaVu Sans', sans-serif", category: 'Standard Office Classics' },
  { name: 'Comic Sans MS', family: "'Comic Sans MS', 'Comic Sans', cursive, sans-serif", category: 'Standard Office Classics' },
  { name: 'Impact', family: "Impact, 'Haettenschweiler', 'Franklin Gothic Bold', Charcoal, sans-serif", category: 'Standard Office Classics' },
  { name: 'Palatino Linotype', family: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", category: 'Standard Office Classics' },
  { name: 'Book Antiqua', family: "'Book Antiqua', Palatino, serif", category: 'Standard Office Classics' },
  { name: 'Bookman Old Style', family: "'Bookman Old Style', Bookman, 'URW Bookman L', serif", category: 'Standard Office Classics' },
  { name: 'Century Gothic', family: "'Century Gothic', 'Tw Cen MT', Futura, Arial, sans-serif", category: 'Standard Office Classics' },
  { name: 'Century Schoolbook', family: "'Century Schoolbook', Century, Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Franklin Gothic Medium', family: "'Franklin Gothic Medium', 'Arial Bold', sans-serif", category: 'Standard Office Classics' },
  { name: 'Franklin Gothic Book', family: "'Franklin Gothic Book', Arial, sans-serif", category: 'Standard Office Classics' },
  { name: 'Sitka Text', family: "'Sitka Text', Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Sitka Display', family: "'Sitka Display', Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Baskerville', family: "Baskerville, 'Baskerville Old Face', 'Times New Roman', serif", category: 'Standard Office Classics' },
  { name: 'Bell MT', family: "'Bell MT', 'Times New Roman', Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Bodoni MT', family: "'Bodoni MT', Didot, Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Calisto MT', family: "'Calisto MT', Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Centaur', family: "Centaur, Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Cooper Black', family: "'Cooper Black', Impact, serif", category: 'Standard Office Classics' },
  { name: 'Elephant', family: "Elephant, 'Arial Black', sans-serif", category: 'Standard Office Classics' },
  { name: 'Footlight MT Light', family: "'Footlight MT Light', Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Goudy Old Style', family: "'Goudy Old Style', Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Harrington', family: "Harrington, cursive, serif", category: 'Standard Office Classics' },
  { name: 'High Tower Text', family: "'High Tower Text', Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Modern No. 20', family: "'Modern No. 20', Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Perpetua', family: "Perpetua, Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Rockwell', family: "Rockwell, 'Rockwell Nova', Georgia, serif", category: 'Standard Office Classics' },
  { name: 'Rockwell Condensed', family: "'Rockwell Condensed', Rockwell, serif", category: 'Standard Office Classics' },
  { name: 'Wide Latin', family: "'Wide Latin', Impact, sans-serif", category: 'Standard Office Classics' },
  { name: 'Haettenschweiler', family: "Haettenschweiler, Impact, sans-serif", category: 'Standard Office Classics' },

  // ==========================================================================
  // 2. MODERN SANS-SERIF & WEB STANDARDS (Enterprise Typography)
  // ==========================================================================
  { name: 'Inter', family: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", category: 'Modern Sans-Serif', googleFont: 'Inter' },
  { name: 'Roboto', family: "Roboto, 'Segoe UI', Arial, sans-serif", category: 'Modern Sans-Serif', googleFont: 'Roboto' },
  { name: 'Roboto Condensed', family: "'Roboto Condensed', Roboto, Arial, sans-serif", category: 'Modern Sans-Serif', googleFont: 'Roboto Condensed' },
  { name: 'Open Sans', family: "'Open Sans', -apple-system, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Open Sans' },
  { name: 'Lato', family: "Lato, 'Segoe UI', Arial, sans-serif", category: 'Modern Sans-Serif', googleFont: 'Lato' },
  { name: 'Montserrat', family: "Montserrat, 'Segoe UI', Arial, sans-serif", category: 'Modern Sans-Serif', googleFont: 'Montserrat' },
  { name: 'Poppins', family: "Poppins, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Poppins' },
  { name: 'Nunito', family: "Nunito, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Nunito' },
  { name: 'Nunito Sans', family: "'Nunito Sans', Nunito, sans-serif", category: 'Modern Sans-Serif', googleFont: 'Nunito Sans' },
  { name: 'Raleway', family: "Raleway, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Raleway' },
  { name: 'Oswald', family: "Oswald, Impact, sans-serif", category: 'Modern Sans-Serif', googleFont: 'Oswald' },
  { name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', -apple-system, sans-serif", category: 'Modern Sans-Serif', googleFont: 'Plus Jakarta Sans' },
  { name: 'DM Sans', family: "'DM Sans', sans-serif", category: 'Modern Sans-Serif', googleFont: 'DM Sans' },
  { name: 'Work Sans', family: "'Work Sans', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Work Sans' },
  { name: 'Fira Sans', family: "'Fira Sans', 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Fira Sans' },
  { name: 'Source Sans 3', family: "'Source Sans 3', 'Source Sans Pro', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Source Sans 3' },
  { name: 'Manrope', family: "Manrope, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Manrope' },
  { name: 'Rubik', family: "Rubik, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Rubik' },
  { name: 'Ubuntu', family: "Ubuntu, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Ubuntu' },
  { name: 'Lexend', family: "Lexend, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Lexend' },
  { name: 'Space Grotesk', family: "'Space Grotesk', 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Space Grotesk' },
  { name: 'Quicksand', family: "Quicksand, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Quicksand' },
  { name: 'Cabin', family: "Cabin, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Cabin' },
  { name: 'Barlow', family: "Barlow, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Barlow' },
  { name: 'Outfit', family: "Outfit, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Outfit' },
  { name: 'Syne', family: "Syne, sans-serif", category: 'Modern Sans-Serif', googleFont: 'Syne' },
  { name: 'Public Sans', family: "'Public Sans', sans-serif", category: 'Modern Sans-Serif', googleFont: 'Public Sans' },
  { name: 'Inter Tight', family: "'Inter Tight', Inter, sans-serif", category: 'Modern Sans-Serif', googleFont: 'Inter Tight' },
  { name: 'Avenir', family: "Avenir, 'Avenir Next', 'Segoe UI', sans-serif", category: 'Modern Sans-Serif' },
  { name: 'Avenir Next', family: "'Avenir Next', Avenir, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif' },
  { name: 'Futura', family: "Futura, 'Century Gothic', Arial, sans-serif", category: 'Modern Sans-Serif' },
  { name: 'Gill Sans', family: "'Gill Sans', 'Gill Sans MT', Calibri, sans-serif", category: 'Modern Sans-Serif' },
  { name: 'Optima', family: "Optima, 'Segoe UI', sans-serif", category: 'Modern Sans-Serif' },
  { name: 'Helvetica', family: "Helvetica, Arial, sans-serif", category: 'Modern Sans-Serif' },
  { name: 'Helvetica Neue', family: "'Helvetica Neue', Helvetica, Arial, sans-serif", category: 'Modern Sans-Serif' },
  { name: 'Liberation Sans', family: "'Liberation Sans', Arial, sans-serif", category: 'Modern Sans-Serif' },
  { name: 'Arimo', family: "Arimo, Arial, sans-serif", category: 'Modern Sans-Serif', googleFont: 'Arimo' },

  // ==========================================================================
  // 3. EDITORIAL & CLASSIC SERIF (Publications, Legal, Academic & Literature)
  // ==========================================================================
  { name: 'Merriweather', family: "Merriweather, Georgia, serif", category: 'Editorial & Classic Serif', googleFont: 'Merriweather' },
  { name: 'Playfair Display', family: "'Playfair Display', Georgia, serif", category: 'Editorial & Classic Serif', googleFont: 'Playfair Display' },
  { name: 'Lora', family: "Lora, Georgia, serif", category: 'Editorial & Classic Serif', googleFont: 'Lora' },
  { name: 'PT Serif', family: "'PT Serif', Georgia, serif", category: 'Editorial & Classic Serif', googleFont: 'PT Serif' },
  { name: 'Source Serif 4', family: "'Source Serif 4', 'Source Serif Pro', Georgia, serif", category: 'Editorial & Classic Serif', googleFont: 'Source Serif 4' },
  { name: 'Roboto Slab', family: "'Roboto Slab', Georgia, serif", category: 'Editorial & Classic Serif', googleFont: 'Roboto Slab' },
  { name: 'Cinzel', family: "Cinzel, Georgia, serif", category: 'Editorial & Classic Serif', googleFont: 'Cinzel' },
  { name: 'Cinzel Decorative', family: "'Cinzel Decorative', Cinzel, serif", category: 'Editorial & Classic Serif', googleFont: 'Cinzel Decorative' },
  { name: 'Bitter', family: "Bitter, Georgia, serif", category: 'Editorial & Classic Serif', googleFont: 'Bitter' },
  { name: 'Cormorant Garamond', family: "'Cormorant Garamond', Garamond, serif", category: 'Editorial & Classic Serif', googleFont: 'Cormorant Garamond' },
  { name: 'EB Garamond', family: "'EB Garamond', Garamond, serif", category: 'Editorial & Classic Serif', googleFont: 'EB Garamond' },
  { name: 'DM Serif Display', family: "'DM Serif Display', Georgia, serif", category: 'Editorial & Classic Serif', googleFont: 'DM Serif Display' },
  { name: 'Didot', family: "Didot, 'Bodoni MT', Georgia, serif", category: 'Editorial & Classic Serif' },
  { name: 'Charter', family: "Charter, Georgia, serif", category: 'Editorial & Classic Serif' },
  { name: 'Hoefler Text', family: "'Hoefler Text', Georgia, serif", category: 'Editorial & Classic Serif' },
  { name: 'Zilla Slab', family: "'Zilla Slab', Georgia, serif", category: 'Editorial & Classic Serif', googleFont: 'Zilla Slab' },
  { name: 'Tinos', family: "Tinos, 'Times New Roman', serif", category: 'Editorial & Classic Serif', googleFont: 'Tinos' },
  { name: 'Liberation Serif', family: "'Liberation Serif', 'Times New Roman', serif", category: 'Editorial & Classic Serif' },
  { name: 'Vollkorn', family: "Vollkorn, Georgia, serif", category: 'Editorial & Classic Serif', googleFont: 'Vollkorn' },
  { name: 'Prata', family: "Prata, Georgia, serif", category: 'Editorial & Classic Serif', googleFont: 'Prata' },
  { name: 'Marcellus', family: "Marcellus, Georgia, serif", category: 'Editorial & Classic Serif', googleFont: 'Marcellus' },

  // ==========================================================================
  // 4. MONOSPACE & CODE (Financial Matrices, Technical Docs, Code)
  // ==========================================================================
  { name: 'Consolas', family: "Consolas, 'Courier New', monospace", category: 'Monospace & Code' },
  { name: 'Courier New', family: "'Courier New', Courier, 'Lucida Console', monospace", category: 'Monospace & Code' },
  { name: 'JetBrains Mono', family: "'JetBrains Mono', Consolas, monospace", category: 'Monospace & Code', googleFont: 'JetBrains Mono' },
  { name: 'Fira Code', family: "'Fira Code', Consolas, monospace", category: 'Monospace & Code', googleFont: 'Fira Code' },
  { name: 'Source Code Pro', family: "'Source Code Pro', Consolas, monospace", category: 'Monospace & Code', googleFont: 'Source Code Pro' },
  { name: 'Cascadia Code', family: "'Cascadia Code', Consolas, monospace", category: 'Monospace & Code' },
  { name: 'Cascadia Mono', family: "'Cascadia Mono', Consolas, monospace", category: 'Monospace & Code' },
  { name: 'Inconsolata', family: "Inconsolata, Consolas, monospace", category: 'Monospace & Code', googleFont: 'Inconsolata' },
  { name: 'Space Mono', family: "'Space Mono', monospace", category: 'Monospace & Code', googleFont: 'Space Mono' },
  { name: 'Ubuntu Mono', family: "'Ubuntu Mono', monospace", category: 'Monospace & Code', googleFont: 'Ubuntu Mono' },
  { name: 'Monaco', family: "Monaco, Menlo, monospace", category: 'Monospace & Code' },
  { name: 'Menlo', family: "Menlo, Monaco, monospace", category: 'Monospace & Code' },
  { name: 'Lucida Console', family: "'Lucida Console', monospace", category: 'Monospace & Code' },
  { name: 'Lucida Sans Typewriter', family: "'Lucida Sans Typewriter', monospace", category: 'Monospace & Code' },
  { name: 'DM Mono', family: "'DM Mono', monospace", category: 'Monospace & Code', googleFont: 'DM Mono' },
  { name: 'PT Mono', family: "'PT Mono', monospace", category: 'Monospace & Code', googleFont: 'PT Mono' },
  { name: 'Cousine', family: "Cousine, 'Courier New', monospace", category: 'Monospace & Code', googleFont: 'Cousine' },
  { name: 'Liberation Mono', family: "'Liberation Mono', monospace", category: 'Monospace & Code' },

  // ==========================================================================
  // 5. SCRIPT, HANDWRITING, SIGNATURE & DISPLAY
  // ==========================================================================
  { name: 'Brush Script MT', family: "'Brush Script MT', 'Segoe Script', cursive", category: 'Script & Display' },
  { name: 'Dancing Script', family: "'Dancing Script', cursive", category: 'Script & Display', googleFont: 'Dancing Script' },
  { name: 'Pacifico', family: "Pacifico, cursive", category: 'Script & Display', googleFont: 'Pacifico' },
  { name: 'Caveat', family: "Caveat, cursive", category: 'Script & Display', googleFont: 'Caveat' },
  { name: 'Great Vibes', family: "'Great Vibes', cursive", category: 'Script & Display', googleFont: 'Great Vibes' },
  { name: 'Sacramento', family: "Sacramento, cursive", category: 'Script & Display', googleFont: 'Sacramento' },
  { name: 'Lobster', family: "Lobster, cursive", category: 'Script & Display', googleFont: 'Lobster' },
  { name: 'Lobster Two', family: "'Lobster Two', Lobster, cursive", category: 'Script & Display', googleFont: 'Lobster Two' },
  { name: 'Comfortaa', family: "Comfortaa, cursive", category: 'Script & Display', googleFont: 'Comfortaa' },
  { name: 'Righteous', family: "Righteous, cursive", category: 'Script & Display', googleFont: 'Righteous' },
  { name: 'Satisfy', family: "Satisfy, cursive", category: 'Script & Display', googleFont: 'Satisfy' },
  { name: 'Alex Brush', family: "'Alex Brush', cursive", category: 'Script & Display', googleFont: 'Alex Brush' },
  { name: 'Allura', family: "Allura, cursive", category: 'Script & Display', googleFont: 'Allura' },
  { name: 'Kaushan Script', family: "'Kaushan Script', cursive", category: 'Script & Display', googleFont: 'Kaushan Script' },
  { name: 'Yellowtail', family: "Yellowtail, cursive", category: 'Script & Display', googleFont: 'Yellowtail' },
  { name: 'Lucida Handwriting', family: "'Lucida Handwriting', cursive", category: 'Script & Display' },
  { name: 'Lucida Calligraphy', family: "'Lucida Calligraphy', cursive", category: 'Script & Display' },
  { name: 'Monotype Corsiva', family: "'Monotype Corsiva', cursive", category: 'Script & Display' },
  { name: 'Segoe Script', family: "'Segoe Script', cursive", category: 'Script & Display' },
  { name: 'Segoe Print', family: "'Segoe Print', cursive", category: 'Script & Display' },
  { name: 'Edwardian Script ITC', family: "'Edwardian Script ITC', cursive", category: 'Script & Display' },
  { name: 'Freestyle Script', family: "'Freestyle Script', cursive", category: 'Script & Display' },
  { name: 'French Script MT', family: "'French Script MT', cursive", category: 'Script & Display' },
  { name: 'Kunstler Script', family: "'Kunstler Script', cursive", category: 'Script & Display' },
  { name: 'Vivaldi', family: "Vivaldi, cursive", category: 'Script & Display' },
  { name: 'Vladimir Script', family: "'Vladimir Script', cursive", category: 'Script & Display' },
  { name: 'Papyrus', family: "Papyrus, fantasy", category: 'Script & Display' },

  // ==========================================================================
  // 6. WORLD & MULTI-LINGUAL SCRIPTS (Global Language Coverage)
  // ==========================================================================
  { name: 'Noto Sans', family: "'Noto Sans', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans' },
  { name: 'Noto Serif', family: "'Noto Serif', serif", category: 'World & Multi-Lingual', googleFont: 'Noto Serif' },
  { name: 'Noto Sans Devanagari', family: "'Noto Sans Devanagari', 'Mangal', 'Nirmala UI', 'Aparajita', 'Noto Sans', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Devanagari' },
  { name: 'Noto Serif Devanagari', family: "'Noto Serif Devanagari', 'Noto Serif', serif", category: 'World & Multi-Lingual', googleFont: 'Noto Serif Devanagari' },
  { name: 'Mangal', family: "Mangal, 'Noto Sans Devanagari', 'Nirmala UI', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Nirmala UI', family: "'Nirmala UI', 'Noto Sans Devanagari', 'Noto Sans', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Aparajita', family: "Aparajita, 'Mangal', 'Noto Sans Devanagari', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Arabic', family: "'Noto Sans Arabic', 'Traditional Arabic', 'Simplified Arabic', 'Segoe UI', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Arabic' },
  { name: 'Traditional Arabic', family: "'Traditional Arabic', 'Simplified Arabic', 'Noto Sans Arabic', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Simplified Arabic', family: "'Simplified Arabic', 'Traditional Arabic', 'Noto Sans Arabic', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Hebrew', family: "'Noto Sans Hebrew', 'David', 'Segoe UI', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Hebrew' },
  { name: 'David', family: "David, 'Noto Sans Hebrew', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans JP', family: "'Noto Sans JP', 'Hiragino Sans', 'Meiryo', 'Yu Gothic', 'MS PGothic', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans JP' },
  { name: 'Meiryo', family: "Meiryo, 'Yu Gothic', 'MS PGothic', 'Noto Sans JP', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Yu Gothic', family: "'Yu Gothic', Meiryo, 'Noto Sans JP', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'MS Gothic', family: "'MS Gothic', 'MS PGothic', Meiryo, monospace", category: 'World & Multi-Lingual' },
  { name: 'MS Mincho', family: "'MS Mincho', 'MS PMincho', serif", category: 'World & Multi-Lingual' },
  { name: 'Hiragino Sans', family: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans KR', family: "'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Dotum', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans KR' },
  { name: 'Malgun Gothic', family: "'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Batang', family: "Batang, 'Noto Serif KR', serif", category: 'World & Multi-Lingual' },
  { name: 'Dotum', family: "Dotum, 'Malgun Gothic', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Apple SD Gothic Neo', family: "'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans SC', family: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'SimSun', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans SC' },
  { name: 'Microsoft YaHei', family: "'Microsoft YaHei', 'PingFang SC', 'SimSun', 'Noto Sans SC', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'SimSun', family: "SimSun, 'Songti SC', serif", category: 'World & Multi-Lingual' },
  { name: 'SimHei', family: "SimHei, 'PingFang SC', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'PingFang SC', family: "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans TC', family: "'Noto Sans TC', 'Microsoft JhengHei', 'PingFang TC', 'MingLiU', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans TC' },
  { name: 'Microsoft JhengHei', family: "'Microsoft JhengHei', 'PingFang TC', 'Noto Sans TC', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'MingLiU', family: "MingLiU, 'PMingLiU', serif", category: 'World & Multi-Lingual' },
  { name: 'PingFang TC', family: "'PingFang TC', 'Microsoft JhengHei', 'Noto Sans TC', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Bengali', family: "'Noto Sans Bengali', 'Vrinda', 'Shonar Bangla', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Bengali' },
  { name: 'Vrinda', family: "Vrinda, 'Noto Sans Bengali', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Shonar Bangla', family: "'Shonar Bangla', 'Noto Sans Bengali', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Tamil', family: "'Noto Sans Tamil', 'Latha', 'Nirmala UI', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Tamil' },
  { name: 'Latha', family: "Latha, 'Noto Sans Tamil', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Telugu', family: "'Noto Sans Telugu', 'Gautami', 'Nirmala UI', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Telugu' },
  { name: 'Gautami', family: "Gautami, 'Noto Sans Telugu', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Malayalam', family: "'Noto Sans Malayalam', 'Kartika', 'Nirmala UI', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Malayalam' },
  { name: 'Kartika', family: "Kartika, 'Noto Sans Malayalam', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Kannada', family: "'Noto Sans Kannada', 'Tunga', 'Nirmala UI', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Kannada' },
  { name: 'Tunga', family: "Tunga, 'Noto Sans Kannada', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Gujarati', family: "'Noto Sans Gujarati', 'Shruti', 'Nirmala UI', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Gujarati' },
  { name: 'Shruti', family: "Shruti, 'Noto Sans Gujarati', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Gurmukhi', family: "'Noto Sans Gurmukhi', 'Raavi', 'Nirmala UI', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Gurmukhi' },
  { name: 'Raavi', family: "Raavi, 'Noto Sans Gurmukhi', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Thai', family: "'Noto Sans Thai', 'Leelawadee UI', 'Angsana New', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Thai' },
  { name: 'Leelawadee UI', family: "'Leelawadee UI', 'Noto Sans Thai', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Angsana New', family: "'Angsana New', 'Leelawadee UI', serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Sinhala', family: "'Noto Sans Sinhala', 'Iskoola Pota', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Sinhala' },
  { name: 'Iskoola Pota', family: "'Iskoola Pota', 'Noto Sans Sinhala', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Myanmar', family: "'Noto Sans Myanmar', 'Myanmar Text', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Myanmar' },
  { name: 'Myanmar Text', family: "'Myanmar Text', 'Noto Sans Myanmar', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Khmer', family: "'Noto Sans Khmer', 'Khmer UI', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Khmer' },
  { name: 'Khmer UI', family: "'Khmer UI', 'Noto Sans Khmer', sans-serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Georgian', family: "'Noto Sans Georgian', 'Sylfaen', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Georgian' },
  { name: 'Sylfaen', family: "Sylfaen, 'Noto Sans Georgian', 'Noto Sans Armenian', serif", category: 'World & Multi-Lingual' },
  { name: 'Noto Sans Armenian', family: "'Noto Sans Armenian', 'Sylfaen', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Armenian' },
  { name: 'Noto Sans Ethiopic', family: "'Noto Sans Ethiopic', 'Nyala', sans-serif", category: 'World & Multi-Lingual', googleFont: 'Noto Sans Ethiopic' },
  { name: 'Nyala', family: "Nyala, 'Noto Sans Ethiopic', sans-serif", category: 'World & Multi-Lingual' }
];

// In-memory cache of dynamically loaded Google Fonts
const loadedGoogleFonts = new Set();

/**
 * Dynamically loads a Google Font if online, caching the link in document.head
 */
export function loadGoogleFont(fontName) {
  if (!fontName) return;
  const clean = fontName.replace(/['"]/g, '').split(',')[0].trim().toLowerCase();
  const font = WORLD_FONTS_CATALOG.find(f => f.name.toLowerCase() === clean);
  if (!font || !font.googleFont) return;

  const gName = font.googleFont;
  if (loadedGoogleFonts.has(gName)) return;
  loadedGoogleFonts.add(gName);

  try {
    if (typeof document !== 'undefined' && navigator.onLine !== false) {
      const linkId = `gfont-${gName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(gName)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700&display=swap`;
        document.head.appendChild(link);
      }
    }
  } catch (e) {}
}

/**
 * Returns the exact fallback font-family string by name
 */
export function getFontFamilyByName(name) {
  if (!name) return DEFAULT_FONT_FAMILY;
  const clean = name.replace(/['"]/g, '').split(',')[0].trim().toLowerCase();
  const found = WORLD_FONTS_CATALOG.find(f => f.name.toLowerCase() === clean);
  return found ? found.family : DEFAULT_FONT_FAMILY;
}

/**
 * Finds font entry by name or matching family
 */
export function findFont(nameOrFamily) {
  if (!nameOrFamily) return null;
  const clean = nameOrFamily.replace(/['"]/g, '').split(',')[0].trim().toLowerCase();
  return WORLD_FONTS_CATALOG.find(f => 
    f.name.toLowerCase() === clean || 
    f.family.toLowerCase().includes(clean)
  );
}

/**
 * Dynamically populates any HTML <select> element with organized <optgroup> categories
 */
export function populateFontSelect(selectElement, selectedValue = 'Calibri') {
  if (!selectElement) return;
  selectElement.innerHTML = '';

  const groups = {};
  WORLD_FONTS_CATALOG.forEach(f => {
    if (!groups[f.category]) groups[f.category] = [];
    groups[f.category].push(f);
  });

  const cleanSel = (selectedValue || '').replace(/['"]/g, '').split(',')[0].trim().toLowerCase();

  Object.entries(groups).forEach(([category, fonts]) => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = category.toUpperCase();
    fonts.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.family;
      opt.dataset.fontName = f.name;
      opt.textContent = f.name;
      opt.style.fontFamily = f.family;
      if (f.name.toLowerCase() === cleanSel || f.family.toLowerCase().includes(cleanSel)) {
        opt.selected = true;
      }
      optgroup.appendChild(opt);
    });
    selectElement.appendChild(optgroup);
  });
}
