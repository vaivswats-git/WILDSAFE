
from risk_analysis import assess_risk
from notification import create_notification

animal = "elephant"
zones = ["Zone 1", "Zone 3"]

risk = assess_risk(animal)

message = create_notification(
    risk["animal"],
    zones,
    risk
)

print(message)
