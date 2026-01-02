const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const cargoPath = path.join(root, "src-tauri", "Cargo.toml");

const required = ["system-tray", "custom-protocol"];

const readFile = () => fs.readFileSync(cargoPath, "utf8");

const normalizeFeatures = (features) => {
  const seen = new Set();
  const ordered = [];
  for (const feature of features) {
    const trimmed = feature.trim();
    if (!trimmed) continue;
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    ordered.push(trimmed);
  }
  for (const feature of required) {
    if (!seen.has(feature)) {
      ordered.push(feature);
      seen.add(feature);
    }
  }
  return ordered;
};

const updateTauriDependency = (content) => {
  const re = /^tauri\s*=\s*\{[^}]*features\s*=\s*\[([^\]]*)\][^}]*\}/m;
  const match = content.match(re);
  if (!match) return { content, changed: false };

  const list = match[1]
    .split(",")
    .map((item) => item.replace(/["']/g, "").trim())
    .filter(Boolean);
  const next = normalizeFeatures(list);
  const updated = match[0].replace(
    /\[[^\]]*\]/,
    `[ ${next.map((value) => `"${value}"`).join(", ")} ]`
  );

  if (updated === match[0]) return { content, changed: false };
  return {
    content: content.replace(match[0], updated),
    changed: true,
  };
};

const updateFeaturesSection = (content) => {
  const featuresIndex = content.indexOf("[features]");
  if (featuresIndex === -1) {
    const block =
      "\n[features]\n" +
      `default = ["${required.join('", "')}"]\n` +
      required.map((feature) => `${feature} = []`).join("\n") +
      "\n";
    return { content: `${content.trimEnd()}${block}`, changed: true };
  }

  const section = content.slice(featuresIndex);
  const endIndex = section.search(/\n\[[^\]]+\]/);
  const sectionBody =
    endIndex === -1 ? section : section.slice(0, endIndex);
  const defaultMatch = sectionBody.match(/default\s*=\s*\[([^\]]*)\]/);

  let updatedSection = sectionBody;
  if (defaultMatch) {
    const list = defaultMatch[1]
      .split(",")
      .map((item) => item.replace(/["']/g, "").trim())
      .filter(Boolean);
    const next = normalizeFeatures(list);
    const updatedDefault = defaultMatch[0].replace(
      /\[[^\]]*\]/,
      `[ ${next.map((value) => `"${value}"`).join(", ")} ]`
    );
    updatedSection = updatedSection.replace(defaultMatch[0], updatedDefault);
  } else {
    updatedSection += `\ndefault = ["${required.join('", "')}"]`;
  }

  for (const feature of required) {
    const line = new RegExp(`^${feature}\\s*=`, "m");
    if (!line.test(updatedSection)) {
      updatedSection += `\n${feature} = []`;
    }
  }

  if (updatedSection === sectionBody) return { content, changed: false };
  return {
    content: content.replace(sectionBody, updatedSection),
    changed: true,
  };
};

try {
  let content = readFile();
  let changed = false;

  const dep = updateTauriDependency(content);
  if (dep.changed) {
    content = dep.content;
    changed = true;
  }

  const features = updateFeaturesSection(content);
  if (features.changed) {
    content = features.content;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(cargoPath, content, "utf8");
    console.log("Updated Cargo.toml features.");
  }
} catch (error) {
  console.error("Failed to ensure Tauri features:", error);
  process.exitCode = 1;
}
