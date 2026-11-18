
ZONES = {
    7: "Zone 1",
    8: "Zone 2",
    9: "Zone 3",
    10: "Zone 4",
    11: "Zone 5"
}

def get_zone(marker_id):
    return ZONES.get(int(marker_id), "Unknown Zone")
