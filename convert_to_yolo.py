
import os
import xml.etree.ElementTree as ET

# Dataset paths
BASE = "dataset/master_dataset"
ANNOTATIONS = os.path.join(BASE, "annotations")
OUTPUT = "dataset/yolo_labels"

os.makedirs(OUTPUT, exist_ok=True)

# Class mapping
classes = {
    "deer": 0,
    "elephant": 1,
    "horse": 2,
    "lion": 3,
    "tiger": 4
}

converted = 0
errors = []

for file in os.listdir(ANNOTATIONS):

    if not file.endswith(".xml"):
        continue

    xml_path = os.path.join(ANNOTATIONS, file)

    try:
        root = ET.parse(xml_path).getroot()

        size = root.find("size")
        width = int(size.find("width").text)
        height = int(size.find("height").text)

        lines = []

        for obj in root.findall("object"):

            name = obj.find("name").text.lower()

            if name not in classes:
                raise ValueError(f"Unknown class: {name}")

            box = obj.find("bndbox")

            xmin = float(box.find("xmin").text)
            ymin = float(box.find("ymin").text)
            xmax = float(box.find("xmax").text)
            ymax = float(box.find("ymax").text)

            x_center = ((xmin + xmax) / 2) / width
            y_center = ((ymin + ymax) / 2) / height
            box_width = (xmax - xmin) / width
            box_height = (ymax - ymin) / height

            class_id = classes[name]

            lines.append(
                f"{class_id} {x_center} {y_center} "
                f"{box_width} {box_height}"
            )

        image_name = root.find("filename").text
        output_file = os.path.splitext(image_name)[0] + ".txt"
        with open(os.path.join(OUTPUT, output_file), "w") as f:
            f.write("\n".join(lines))

        converted += 1

    except Exception as e:
        errors.append(f"{file}: {e}")

print("Conversion completed!")
print("Files converted:", converted)
print("Errors:", len(errors))

for error in errors:
    print(error)
