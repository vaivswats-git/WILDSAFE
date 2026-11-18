
# Wildlife Risk Assessment

ANIMAL_RISK = {
    "deer": {
        "crop_risk": 65,
        "life_risk": 15
    },
    "elephant": {
        "crop_risk": 90,
        "life_risk": 85
    },
    "horse": {
        "crop_risk": 45,
        "life_risk": 30
    },
    "lion": {
        "crop_risk": 5,
        "life_risk": 95
    },
    "tiger": {
        "crop_risk": 5,
        "life_risk": 95
    }
}


def assess_risk(animal):

    animal = animal.lower()

    if animal not in ANIMAL_RISK:
        return None

    crop_risk = ANIMAL_RISK[animal]["crop_risk"]
    life_risk = ANIMAL_RISK[animal]["life_risk"]

    return {
        "animal": animal.title(),
        "crop_risk": crop_risk,
        "life_risk": life_risk
    }
