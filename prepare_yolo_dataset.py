
import random
import shutil
from pathlib import Path

random.seed(42)

BASE = Path("dataset")
IMAGE_DIR = BASE / "master_dataset" / "images"
LABEL_DIR = BASE / "yolo_labels"

OUTPUT = BASE / "yolo_dataset"

splits = {
    "train": 0.8,
    "val": 0.1,
    "test": 0.1
}

images = [
    p for p in IMAGE_DIR.iterdir()
    if p.suffix.lower() in [".jpg", ".jpeg", ".png"]
]

random.shuffle(images)

n = len(images)
train_end = int(n * 0.8)
val_end = train_end + int(n * 0.1)

groups = {
    "train": images[:train_end],
    "val": images[train_end:val_end],
    "test": images[val_end:]
}

for split, files in groups.items():

    img_out = OUTPUT / "images" / split
    lbl_out = OUTPUT / "labels" / split

    img_out.mkdir(parents=True, exist_ok=True)
    lbl_out.mkdir(parents=True, exist_ok=True)

    for img in files:
        label = LABEL_DIR / (img.stem + ".txt")

        if not label.exists():
            print("Missing label:", img.name)
            continue

        shutil.copy2(img, img_out / img.name)
        shutil.copy2(label, lbl_out / label.name)

    print(split, ":", len(files), "images")

print("Dataset splitting completed!")
