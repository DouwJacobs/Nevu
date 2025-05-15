import { Typography, Box, Slider } from "@mui/material";
import React, { useState } from "react";
import CheckBoxOption from "../../components/settings/CheckBoxOption";
import { useUserSettings } from "../../states/UserSettingsState";

function SettingsPlayback() {
  const { settings, setSetting } = useUserSettings();
  const [sliderValue, setSliderValue] = useState(parseFloat(settings.DEFAULT_PLAYBACK_SPEED) || 1.0);

  return (
    <>
      <Typography variant="h4">Experience - Playback</Typography>

      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <CheckBoxOption
          title="Disable Watchscreen Darkening"
          subtitle="Disables the darkening effect when interacting with the watchscreen."
          checked={settings.DISABLE_WATCHSCREEN_DARKENING === "true"}
          onChange={() => {
            setSetting(
              "DISABLE_WATCHSCREEN_DARKENING",
              settings["DISABLE_WATCHSCREEN_DARKENING"] === "true"
                ? "false"
                : "true"
            );
          }}
        />

        <CheckBoxOption
          title="Auto-Match Tracks"
          subtitle="Automatically select subtitles and audio tracks based on your previous choices. (Same language for each episode of a show)"
          checked={settings.AUTO_MATCH_TRACKS === "true"}
          onChange={() => {
            setSetting(
              "AUTO_MATCH_TRACKS",
              settings["AUTO_MATCH_TRACKS"] === "true" ? "false" : "true"
            );
          }}
        />

        <CheckBoxOption
          title="Auto-Play Next Episode"
          subtitle="Automatically play the next episode when the current one ends."
          checked={settings.AUTO_NEXT_EP === "true"}
          onChange={() => {
            setSetting(
              "AUTO_NEXT_EP",
              settings["AUTO_NEXT_EP"] === "true" ? "false" : "true"
            );
          }}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: "1rem", ml: 1 }}>
          Default Playback Speed
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
          Set the default playback speed for videos. This will be applied automatically when playback starts.
        </Typography>
        <Slider
          value={sliderValue}
          min={0.5}
          max={2.5}
          step={0.1}
          onChange={(_, newValue) => {
            setSliderValue(newValue);
          }}
          onChangeCommitted={(_, newValue) => {
            setSetting("DEFAULT_PLAYBACK_SPEED", newValue.toString());
          }}
          valueLabelDisplay="auto"
          sx={{ ml: 1 }}
        />
      </Box>
    </>
  );
}

export default SettingsPlayback;
