import { Typography, Box, Switch, FormControlLabel, Divider } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSettingsStore } from "../../states/SettingsState";

function SettingsContentDisplay() {
  const { contentDisplaySettings, updateContentDisplaySettings } = useSettingsStore();
  const [settings, setSettings] = useState({
    showContentRatings: true,
    showReleaseYear: true,
    showDuration: true,
    showAudioLanguages: true,
    showSubtitles: true,
    autoPlayTrailers: false,
  });

  useEffect(() => {
    if (contentDisplaySettings) {
      setSettings(contentDisplaySettings);
    }
  }, [contentDisplaySettings]);

  const handleChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateContentDisplaySettings(newSettings);
  };

  return (
    <>
      <Typography variant="h4">Experience - Content Display</Typography>

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h6">Content Information</Typography>

        <FormControlLabel
          control={
            <Switch
              checked={settings.showContentRatings}
              onChange={(e) => handleChange("showContentRatings", e.target.checked)}
            />
          }
          label="Show Content Ratings"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showReleaseYear}
              onChange={(e) => handleChange("showReleaseYear", e.target.checked)}
            />
          }
          label="Show Release Year"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showDuration}
              onChange={(e) => handleChange("showDuration", e.target.checked)}
            />
          }
          label="Show Duration"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showAudioLanguages}
              onChange={(e) => handleChange("showAudioLanguages", e.target.checked)}
            />
          }
          label="Show Audio Languages"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showSubtitles}
              onChange={(e) => handleChange("showSubtitles", e.target.checked)}
            />
          }
          label="Show Available Subtitles"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.autoPlayTrailers}
              onChange={(e) => handleChange("autoPlayTrailers", e.target.checked)}
            />
          }
          label="Auto-play Trailers"
        />
      </Box>
    </>
  );
}

export default SettingsContentDisplay; 