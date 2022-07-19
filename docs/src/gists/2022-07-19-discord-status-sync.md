---
title: Discord Status sync
---

!!! note "TL;DR"

    * get discord api token [instructions here](https://www.androidauthority.com/get-discord-token-3149920/).
    * use `hcitool` to monitor bluetooth: `hcitool rssi <MAC>`.
    * send command to discord when level falls below threshold.


# Motivation

At work we have a "Home Office" discord channel to communicate and share info.
Sometimes somene from my team will connect to the audio channel and start
talking, expecting to get a response, but as I'm making a coffee, they end up
sending a PM instead (probably after not receiving an audio respoinse on my
side after several "hello?" on their part...)

So I made a small script to update my status each time I'm not at the computer,
useing as a proxy the bluetooth signal power form my phone.

# Setup

## Prerequisites:

* python 3.10 (`3.10.4` tested)
* A library to access the discord api (eg requests, httpx, or urllib, etc ).
  Example below uses `requests==2.28.1`.
* [OPTIONAL] a library to store secrets in a safe manner.
  Example below uses `keyring==23.7.0`

## discord client

```py
# change_status.py
import enum
import requests

class DiscordUserStatus(str, enum.Enum):
    ONLINE = "online"
    IDLE = "idle"
    DO_NOT_DISTURB = "dnd"
    INVISIBLE = "invisible"

class CustomStatus(str, enum.Enum):
    AFK = "AFK"
    BACK_IN_5 = "Back in 5"

def ensure_token(token:str):
    if token:
        return token
    import keyring
    return keyring.get_password("system", "discord-token")

class Discord:
    
    def __init__(
        self,
        token: str,
        api_url: str = "https://discord.com/api/v8"
    ):
        self.token = token = ensure_token(token)
        self.headers = {
            "Authorization": token,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36",
            "Content-Type": "application/json",
            "Accept": "*/*"
        }
        self.api_url = api_url

    @property
    def settings_url(self):
        return f"{self.api_url}/users/@me/settings"

    def change_status(
        self,
        status,
        custom_status: str = "",
    ):
        body = {
            "status": status,
            "custom_status": {
                "text": custom_status,
            } if custom_status else None
        }

        r = requests.patch(
            self.settings_url,
            headers=self.headers,
            json=body
        )
        r.raise_for_status()

def change_status(
    status,
    *,
    token: str="",
    custom_status: str = "",
):
    discord = Discord(token)
    discord.change_status(status, custom_status)

```


## discord client

```python
# bluetooth_monitor.py

import time
import enum
from shlex import split
import subprocess as sp
import sys
from typing import Callable
from typing import Literal
from typing import NoReturn

from change_status import change_status
from change_status import CustomStatus
from change_status import DiscordUserStatus

class RssiKnownState(str, enum.Enum):
    """
    Known states of the RSSI.
    """
    NOT_CONNECTED = "Not connected."
    SIGNAL = "RSSI return value: "
    UNKNOWN = "Unknown RSSI."


def decode(
    hcitool_rssi: str
) -> int|None:
    """Decode the RSSI string."""

    if RssiKnownState.SIGNAL in hcitool_rssi:
        return int(hcitool_rssi.split(RssiKnownState.SIGNAL)[1])
    return None


def get_bluetooth_rssi(
    mac: str = "E4:84:D3:13:F8:98",
) -> int|None:
    """Get the RSSI of the bluetooth device."""

    try:
        return decode(sp.check_output(split(f"hcitool rssi {mac}"), text=True))
    except sp.CalledProcessError:
        return None

def main(
    mac: str,
    polling_interval: int = 1,
    min_rssi: int = 0,
    on_disconnect: Callable[[], None] = lambda: None,
    on_connect: Callable[[], None] = lambda: None,
) -> NoReturn:
    last_strength = None
    while True:
        then = time.time()
        strength = get_bluetooth_rssi(mac)
        the_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(then))
        print(f"{the_time} - {strength=}\r", end="")

        if strength == last_strength:
            pass
        elif strength is None:
            print(RssiKnownState.NOT_CONNECTED)
            on_disconnect()
        elif strength >= min_rssi:
            print(RssiKnownState.SIGNAL + str(strength))
            on_connect()
        elif strength < min_rssi:
            print(RssiKnownState.SIGNAL + str(strength))
            on_disconnect()
        last_strength = strength
        now = time.time()
        time.sleep(max(0,polling_interval-(then-now)))

if __name__ == "__main__":
    main(
        mac=sys.argv[1],
        polling_interval=5,
        min_rssi=0,
        on_disconnect=lambda: change_status(
            DiscordUserStatus.DO_NOT_DISTURB,
            custom_status=CustomStatus.AFK
        ),
        on_connect=lambda: change_status(
            DiscordUserStatus.ONLINE
        ),
    )

```


This script basically polls for the rssi and acts when its signal changes.
