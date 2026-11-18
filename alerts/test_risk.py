
from risk_analysis import assess_risk

animals = ["deer", "elephant", "horse", "lion", "tiger"]

for animal in animals:

    result = assess_risk(animal)

    print("\nAnimal:", result["animal"])
    print("Crop Damage Risk:", result["crop_risk"], "/100")
    print("Life Safety Risk:", result["life_risk"], "/100")
