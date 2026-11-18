from ultralytics import YOLO

model = YOLO("yolo26n.pt")

print("Model loaded successfully!")
print("Classes:", model.names)