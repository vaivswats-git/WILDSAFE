
from risk_analysis import assess_risk
from alarm_system import trigger_alarm, stop_alarm

animal = "elephant"

risk = assess_risk(animal)
trigger_alarm(risk)

input("Press ENTER to stop the alarms...")
stop_alarm()
