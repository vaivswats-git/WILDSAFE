
import pygame
import os

# Alarm audio files
CROP_ALARM = "C:/Users/vaivs/Downloads/flutie8211-high-pitch-alarm-buzzer-464349.mp3"
LIFE_ALARM = "C:/Users/vaivs/Downloads/freesound_community-siren-alarm-96503.mp3"

# Initialize audio mixer
pygame.mixer.init()
pygame.mixer.set_num_channels(2)

crop_sound = pygame.mixer.Sound(CROP_ALARM)
life_sound = pygame.mixer.Sound(LIFE_ALARM)

# Separate alarm channels
crop_channel = pygame.mixer.Channel(0)
life_channel = pygame.mixer.Channel(1)

# Default alarm preference
alarm_preference = "both"


def set_alarm_preference(preference):
    global alarm_preference

    if preference not in ["life", "crop", "both"]:
        return False

    alarm_preference = preference

    if preference == "life":
        crop_channel.stop()

    elif preference == "crop":
        life_channel.stop()

    print("Alarm preference updated:", preference)
    return True


def trigger_alarm(risk):
    crop = risk["crop_risk"]
    life = risk["life_risk"]

    if alarm_preference in ["crop", "both"]:
        if crop >= 50 and not crop_channel.get_busy():
            crop_channel.play(crop_sound, loops=-1)
            print("CROP PROTECTION ALARM ACTIVE")
    else:
        crop_channel.stop()

    if alarm_preference in ["life", "both"]:
        if life >= 50 and not life_channel.get_busy():
            life_channel.play(life_sound, loops=-1)
            print("LIFE SAFETY ALARM ACTIVE")
    else:
        life_channel.stop()


def stop_alarm():
    crop_channel.stop()
    life_channel.stop()
    print("All alarms stopped.")
