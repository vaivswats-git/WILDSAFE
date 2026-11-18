
import os
import shutil
import xml.etree.ElementTree as ET
from pathlib import Path

BASE = Path("dataset/master_dataset")
IMAGE_DIR = BASE / "images"
XML_DIR = BASE / "annotations"

OUTPUT = Path("dataset/clean_dataset")

for split in ["images", "annotations"]:
    (OUTPUT / split).mkdir(parents=True, exist_ok=True)

image_map = {
    p.stem.lower(): p
    for p in IMAGE_DIR.iterdir()
    if p.suffix.lower() in [".jpg", ".jpeg", ".png"]
}

matched = 0
unmatched = 0

for xml_file in XML_DIR.glob("*.xml"):
    try:
        root = ET.parse(xml_file).getroot()
        filename = root.findtext("filename")

        if not filename:
            unmatched += 1
            continue

        image_stem = Path(filename).stem.lower()

        if image_stem not in image_map:
            unmatched += 1
            continue

        image_path = image_map[image_stem]

        shutil.copy2(image_path, OUTPUT / "images" / image_path.name)
        shutil.copy2(xml_file, OUTPUT / "annotations" / xml_file.name)

        matched += 1

    except Exception as e:
        print("Error:", xml_file.name, e)
        unmatched += 1

print("Matched image-annotation pairs:", matched)
print("Unmatched annotations:", unmatched)
print("Clean dataset prepared.")
