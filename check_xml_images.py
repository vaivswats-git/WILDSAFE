
import os
import xml.etree.ElementTree as ET

XML_DIR = "dataset/master_dataset/annotations"
IMAGE_DIR = "dataset/master_dataset/images"

image_stems = {
    os.path.splitext(f)[0].lower()
    for f in os.listdir(IMAGE_DIR)
    if f.lower().endswith((".jpg", ".jpeg", ".png"))
}

matched = 0
missing = []

for xml_file in os.listdir(XML_DIR):
    if not xml_file.lower().endswith(".xml"):
        continue

    root = ET.parse(os.path.join(XML_DIR, xml_file)).getroot()
    filename = root.findtext("filename")

    if filename:
        stem = os.path.splitext(filename)[0].lower()

        if stem in image_stems:
            matched += 1
        else:
            missing.append((xml_file, filename))

print("MATCHED BY FILENAME:", matched)
print("STILL MISSING:", len(missing))

for item in missing[:20]:
    print(item)
