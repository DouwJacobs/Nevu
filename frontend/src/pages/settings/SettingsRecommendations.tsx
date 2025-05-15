import { Typography, Box, Switch, FormControlLabel, Slider, Select, MenuItem, FormControl, InputLabel, Divider } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSettingsStore } from "../../states/SettingsState";

function SettingsRecommendations() {
  const { recommendationsSettings, updateRecommendationsSettings } = useSettingsStore();
  const [settings, setSettings] = useState({
    showContinueWatching: true,
    showRecentlyAdded: true,
    showNewReleases: true,
    showBecauseYouWatched: true,
    showMoreLikeThis: true,
    showGenres: true,
    maxGenres: 8,
    contentDiversity: 50,
    preferredLanguages: [] as string[],
    showTrending: true,
    showPopular: true,
    showCriticallyAcclaimed: true,
    showStaffPicks: true,
    showHiddenGems: true,
    showSimilarToLastWatched: true,
    showUpcoming: true,
    showCollections: true,
    maxItemsPerCategory: 20,
  });

  useEffect(() => {
    if (recommendationsSettings) {
      setSettings(recommendationsSettings);
    }
  }, [recommendationsSettings]);

  const handleChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateRecommendationsSettings(newSettings);
  };

  return (
    <>
      <Typography variant="h4">Experience - Recommendations</Typography>

      <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h6">Content Sections</Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.showContinueWatching}
              onChange={(e) => handleChange("showContinueWatching", e.target.checked)}
            />
          }
          label="Show Continue Watching"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showRecentlyAdded}
              onChange={(e) => handleChange("showRecentlyAdded", e.target.checked)}
            />
          }
          label="Show Recently Added"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showNewReleases}
              onChange={(e) => handleChange("showNewReleases", e.target.checked)}
            />
          }
          label="Show New Releases"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showTrending}
              onChange={(e) => handleChange("showTrending", e.target.checked)}
            />
          }
          label="Show Trending"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showPopular}
              onChange={(e) => handleChange("showPopular", e.target.checked)}
            />
          }
          label="Show Popular"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showCriticallyAcclaimed}
              onChange={(e) => handleChange("showCriticallyAcclaimed", e.target.checked)}
            />
          }
          label="Show Critically Acclaimed"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showStaffPicks}
              onChange={(e) => handleChange("showStaffPicks", e.target.checked)}
            />
          }
          label="Show Staff Picks"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showHiddenGems}
              onChange={(e) => handleChange("showHiddenGems", e.target.checked)}
            />
          }
          label="Show Hidden Gems"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showBecauseYouWatched}
              onChange={(e) => handleChange("showBecauseYouWatched", e.target.checked)}
            />
          }
          label="Show Because You Watched"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showMoreLikeThis}
              onChange={(e) => handleChange("showMoreLikeThis", e.target.checked)}
            />
          }
          label="Show More Like This"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showSimilarToLastWatched}
              onChange={(e) => handleChange("showSimilarToLastWatched", e.target.checked)}
            />
          }
          label="Show Similar to Last Watched"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showUpcoming}
              onChange={(e) => handleChange("showUpcoming", e.target.checked)}
            />
          }
          label="Show Upcoming"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showCollections}
              onChange={(e) => handleChange("showCollections", e.target.checked)}
            />
          }
          label="Show Collections"
        />

        <FormControlLabel
          control={
            <Switch
              checked={settings.showGenres}
              onChange={(e) => handleChange("showGenres", e.target.checked)}
            />
          }
          label="Show Genre Categories"
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Display Settings</Typography>

        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Number of Genre Categories</Typography>
          <Slider
            value={settings.maxGenres}
            onChange={(_, value) => handleChange("maxGenres", value)}
            min={4}
            max={12}
            marks
            step={1}
            disabled={!settings.showGenres}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Items Per Category</Typography>
          <Slider
            value={settings.maxItemsPerCategory}
            onChange={(_, value) => handleChange("maxItemsPerCategory", value)}
            min={10}
            max={50}
            marks={[
              { value: 10, label: "10" },
              { value: 20, label: "20" },
              { value: 30, label: "30" },
              { value: 40, label: "40" },
              { value: 50, label: "50" },
            ]}
            step={5}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Content Diversity</Typography>
          <Slider
            value={settings.contentDiversity}
            onChange={(_, value) => handleChange("contentDiversity", value)}
            min={0}
            max={100}
            marks={[
              { value: 0, label: "Similar" },
              { value: 50, label: "Balanced" },
              { value: 100, label: "Diverse" },
            ]}
          />
        </Box>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Preferred Languages</InputLabel>
          <Select
            multiple
            value={settings.preferredLanguages}
            onChange={(e) => handleChange("preferredLanguages", e.target.value)}
            label="Preferred Languages"
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
            <MenuItem value="de">German</MenuItem>
            <MenuItem value="it">Italian</MenuItem>
            <MenuItem value="ja">Japanese</MenuItem>
            <MenuItem value="ko">Korean</MenuItem>
            <MenuItem value="zh">Chinese</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
}

export default SettingsRecommendations;