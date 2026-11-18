
def create_notification(animal, zones, risk):

    crop = risk["crop_risk"]
    life = risk["life_risk"]

    alerts = []

    if crop >= 50:
        alerts.append("CROP PROTECTION ALERT")

    if life >= 50:
        alerts.append("LIFE SAFETY ALERT")

    if not alerts:
        alerts.append("MONITORING ALERT")

    message = f"""
========== WILDLIFE ALERT ==========

Animal Detected: {animal}

Detected Zones: {", ".join(zones)}

Crop Damage Risk: {crop}/100
Life Safety Risk: {life}/100

Alert Type: {", ".join(alerts)}

====================================
"""

    return message
