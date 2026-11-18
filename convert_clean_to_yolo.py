
import xml.etree.ElementTree as ET
from pathlib import Path
import shutil

BASE = Path("dataset/clean_dataset")
OUT = Path("dataset/yolo_dataset")

IMG_OUT = OUT / "images"
LABEL_OUT = OUT / "labels"

IMG_OUT.mkdir(parents=True, exist_ok=True)
LABEL_OUT.mkdir(parents=True, exist_ok=True)

classes = {
    "deer": 0,
    "elephant": 1,
    "horse": 2,
    "lion": 3,
    "tiger": 4
}

converted = 0

for xml_file in (BASE / "annotations").glob("*.xml"):

    root = ET.parse(xml_file).getroot()

    filename = root.findtext("filename")
    if not filename:
        continue

    image_path = BASE / "images" / filename

    if not image_path.exists():
        continue

    size = root.find("size")
    width = int(size.findtext("width"))
    height = int(size.findtext("height"))

    lines = []

    for obj in root.findall("object"):

        name = obj.findtext("name").lower()

        if name not in classes:
            continue

        box = obj.find("bndbox")

        xmin = float(box.findtext("xmin"))
        ymin = float(box.findtext("ymin"))
        xmax = float(box.findtext("xmax"))
        ymax = float(box.findtext("ymax"))

        x_center = ((xmin + xmax) / 2) / width
        y_center = ((ymin + ymax) / 2) / height

        box_width = (xmax - xmin) / width
        box_height = (ymax - ymin) / height

        lines.append(
            f"{classes[name]} {x_center:.6f} "
            f"{y_center:.6f} {box_width:.6f} "
            f"{box_height:.6f}"
        )

    if not lines:
        continue

    shutil.copy2(image_path, IMG_OUT / image_path.name)

    label_file = LABEL_OUT / f"{image_path.stem}.txt"
    label_file.write_text("\n".join(lines))

    converted += 1

print("YOLO conversion completed!")
print("Images converted:", converted)
print("Labels created:", converted)
