
import os
import xml.etree.ElementTree as ET

BASE = "dataset/master_dataset"
IMAGE_DIR = os.path.join(BASE, "images")
XML_DIR = os.path.join(BASE, "annotations")
LABEL_DIR = "dataset/yolo_labels"

images = {
    os.path.splitext(f)[0]: f
    for f in os.listdir(IMAGE_DIR)
    if f.lower().endswith((".jpg", ".jpeg", ".png"))
}

xmls = {
    os.path.splitext(f)[0]: f
    for f in os.listdir(XML_DIR)
    if f.lower().endswith(".xml")
}

labels = {
    os.path.splitext(f)[0]: f
    for f in os.listdir(LABEL_DIR)
    if f.lower().endswith(".txt")
}

print("TOTAL IMAGES:", len(images))
print("TOTAL XML:", len(xmls))
print("TOTAL YOLO LABELS:", len(labels))

print("\nIMAGES WITHOUT XML:")
for name in sorted(set(images) - set(xmls)):
    print(images[name])

print("\nIMAGES WITHOUT YOLO LABELS:")
for name in sorted(set(images) - set(labels)):
    print(images[name])

print("\nXML WITHOUT IMAGES:")
for name in sorted(set(xmls) - set(images)):
    print(xmls[name])

print("\nXML FILENAME MISMATCHES:")

for name, xml_file in xmls.items():
    if name not in images:
        continue

    try:
        root = ET.parse(os.path.join(XML_DIR, xml_file)).getroot()
        filename = root.findtext("filename")

        if filename and filename != images[name]:
            print(xml_file, "references", filename)

    except Exception as e:
        print(xml_file, "ERROR:", e)
print("IMAGES WITHOUT XML COUNT:", len(set(images) - set(xmls)))
print("IMAGES WITHOUT YOLO LABELS COUNT:", len(set(images) - set(labels)))
print("XML WITHOUT IMAGES COUNT:", len(set(xmls) - set(images)))

print("\nFIRST 20 XML FILES WITHOUT IMAGES:")
for name in sorted(set(xmls) - set(images))[:20]:
    print(xmls[name])

print("\nFIRST 20 IMAGES WITHOUT XML:")
for name in sorted(set(images) - set(xmls))[:20]:
    print(images[name])

print("\nCHECKING XML INTERNAL FILENAMES:")

for name in sorted(set(xmls) - set(images))[:20]:
    path = os.path.join(XML_DIR, xmls[name])
    root = ET.parse(path).getroot()

    filename = root.findtext("filename")
    print(xmls[name], "->", filename)



print("\nAUDIT COMPLETE")
