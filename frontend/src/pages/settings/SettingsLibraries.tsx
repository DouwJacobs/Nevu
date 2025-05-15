import { Typography, Box } from "@mui/material";
import React, { useEffect } from "react";
import {
  getAllLibraries
} from "../../plex";
import CheckBoxOption from "../../components/settings/CheckBoxOption";
import { useUserSettings } from "../../states/UserSettingsState";
import CenteredSpinner from "../../components/CenteredSpinner";

function SettingsLibraries() {
    const [libraries, setLibraries] = React.useState<Plex.LibarySection[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { settings, setSetting } = useUserSettings();

    useEffect(() => {
        async function fetchData() {
          setLoading(true);
          try {
            const librariesData = await getAllLibraries();
            const filteredLibraries = librariesData.filter((lib) =>
              ["movie", "show"].includes(lib.type)
            );
            setLibraries(filteredLibraries);
          } catch (error) {
            console.error("Error fetching data", error);
          } finally {
            setLoading(false);
          }
        }
        fetchData();
    }, []);

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>Experience - Libraries</Typography>
          <Typography variant="body1" color="text.secondary">
            Manage which libraries are visible in your home screen and recommendations.
          </Typography>
        </Box>

        {loading ? (
          <CenteredSpinner />
        ) : (
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: 2,
              borderRadius: "8px",
              p: 2,
            }}
          >
            {libraries.map((library) => {
              const key = `LIBRARY_${library.uuid}`;
              const rawValue = settings[key];
              const checked = rawValue === undefined ? true : rawValue === "true";

              return (
                <CheckBoxOption
                  key={library.key}
                  title={library.title}
                  subtitle={`Type: ${library.type.toUpperCase()}`}
                  checked={checked}
                  onChange={() => {
                    setSetting(key, checked ? "false" : "true");
                  }}
                />
              );
            })}
          </Box>
        )}
      </Box>
    );
}
export default SettingsLibraries;