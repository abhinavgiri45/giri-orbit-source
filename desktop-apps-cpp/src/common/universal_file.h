#pragma once
#ifndef UNIVERSAL_FILE_H
#define UNIVERSAL_FILE_H

#include <string>
#include <vector>
#include <fstream>
#include <sstream>
#include <filesystem>

struct SovereignDocument {
    std::wstring toolType; // "drift", "axis", "kinetic"
    std::wstring title;
    std::wstring author;
    std::string  payload; // RTF content, CSV spreadsheet data, or JSON presentation deck
};

inline bool SaveUniversalGiriFile(const std::wstring& filePath, const std::wstring& toolType, const std::wstring& title, const std::string& content) {
    std::filesystem::path p(filePath);
    std::ofstream out(p, std::ios::binary);
    if (!out.is_open()) return false;

    // Sovereign .giri file signature header
    out << "GIRI_ORBIT_SOVEREIGN_V1\n";
    out << "TOOL:" << (toolType == L"drift" ? "drift" : (toolType == L"axis" ? "axis" : "kinetic")) << "\n";
    out << "AUTHOR:Abhinav Giri\n";
    out << "ENCODING:UTF-8\n";
    out << "DATA_START\n";
    out << content;
    out.close();
    return true;
}

inline bool LoadUniversalGiriFile(const std::wstring& filePath, std::string& outContent, std::string& outToolType) {
    std::filesystem::path p(filePath);
    std::ifstream in(p, std::ios::binary);
    if (!in.is_open()) return false;

    std::string line;
    bool inData = false;
    std::ostringstream ss;

    while (std::getline(in, line)) {
        // Strip trailing \r on Windows
        if (!line.empty() && line.back() == '\r') line.pop_back();

        if (!inData) {
            if (line.rfind("TOOL:", 0) == 0) {
                outToolType = line.substr(5);
            }
            if (line == "DATA_START") {
                inData = true;
            }
        } else {
            ss << line << "\n";
        }
    }
    in.close();

    if (inData) {
        outContent = ss.str();
        return true;
    }

    // Fallback: Read raw content if normal text/rtf or Web App HTML polyglot
    std::ifstream raw(p, std::ios::binary);
    std::ostringstream rawSS;
    rawSS << raw.rdbuf();
    std::string fullText = rawSS.str();

    // Check if HTML container from Web App
    size_t panelPos = fullText.find("class=\"giri-content-panel\"");
    if (panelPos != std::string::npos) {
        size_t start = fullText.find(">", panelPos);
        size_t end = fullText.find("</div>", start);
        if (start != std::string::npos && end != std::string::npos) {
            outContent = fullText.substr(start + 1, end - start - 1);
            outToolType = "drift";
            return true;
        }
    }

    outContent = fullText;
    outToolType = "drift";
    return true;
}

#endif // UNIVERSAL_FILE_H
