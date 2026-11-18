
from pathlib import Path

labels = Path("dataset/yolo_dataset/labels")
images = Path("dataset/yolo_dataset/images")

class_names = {
    0: "Deer",
    1: "Elephant",
    2: "Horse",
    3: "Lion",
    4: "Tiger"
}

errors = []
count = 0

for file in labels.glob("*.txt"):
    for line_no, line in enumerate(file.read_text().splitlines(), 1):
        parts = line.split()

        if len(parts) != 5:
            errors.append(f"{file.name}: invalid format")
            continue

        cls, x, y, w, h = map(float, parts)

        if cls not in class_names:
            errors.append(f"{file.name}: invalid class")
        elif not all(0 <= v <= 1 for v in [x, y, w, h]):
            errors.append(f"{file.name}: invalid coordinates")
        else:
            count += 1

print("Valid bounding boxes:", count)
print("Label files:", len(list(labels.glob("*.txt"))))
print("Image files:", len(list(images.iterdir())))
print("Errors:", len(errors))

for error in errors[:20]:
    print(error)

image_extensions = {".jpg", ".jpeg", ".png"}

image_names = {
    p.stem for p in images.iterdir()
    if p.suffix.lower() in image_extensions
}

label_names = {
    p.stem for p in labels.glob("*.txt")
}

print("\nImages without labels:")
for name in sorted(image_names - label_names):
    print(name)

print("\nLabels without images:")
for name in sorted(label_names - image_names):
    print(name)

from collections import Counter

stems = [
    p.stem for p in images.iterdir()
    if p.suffix.lower() in image_extensions
]

duplicates = [
    name for name, count in Counter(stems).items()
    if count > 1
]

print("\nDUPLICATE IMAGE NAMES:")
for name in duplicates:
    print(name)

print("Total duplicates:", len(duplicates))
print("\nNON-IMAGE FILES:")
for p in images.iterdir():
    if p.suffix.lower() not in image_extensions:
        print(p.name)

