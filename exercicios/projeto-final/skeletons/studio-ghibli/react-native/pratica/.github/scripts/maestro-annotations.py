"""Publica no GitHub Actions os flows que falharam e o que havia na tela no momento da falha."""

import json
import xml.etree.ElementTree as ET
from pathlib import Path

MAX_CHARS = 1500


def annotation_text(text):
    return text[:MAX_CHARS].replace("%", "%25").replace("\r", "").replace("\n", "%0A")


def screen_labels(node):
    attributes = node.get("attributes", {})
    labels = [
        attributes[key]
        for key in ("resource-id", "text", "accessibilityText")
        if attributes.get(key) and "com.android.systemui" not in attributes.get("resource-id", "")
    ]
    if labels:
        labels.append(attributes.get("bounds", ""))
    for child in node.get("children") or []:
        labels += screen_labels(child)
    return labels


for testcase in ET.parse("maestro-report.xml").iter("testcase"):
    failure = testcase.find("failure")
    if failure is None:
        continue
    print(f"::error title=Flow {testcase.get('name')}::{annotation_text(failure.text or '')}")

# O rglob também percorre a pasta oculta (.maestro) onde o Maestro guarda os arquivos.
for path in Path("maestro-debug").rglob("screen-hierarchy/*.json"):
    with path.open(encoding="utf-8") as file:
        labels = screen_labels(json.load(file))
    print(f"::error title={path.name}::{annotation_text(' | '.join(labels))}")
