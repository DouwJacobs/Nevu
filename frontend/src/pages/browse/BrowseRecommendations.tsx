import { Box, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import HeroDisplay from "../../components/HeroDisplay";
import MovieItemSlider, {
  shuffleArray,
} from "../../components/MovieItemSlider";
import { getLibrary, getLibraryDir, getLibraryMeta } from "../../plex";
import { getIncludeProps } from "../../plex/QuickFunctions";
import { motion } from "framer-motion";
import { useSettingsStore } from "../../states/SettingsState";

interface Category {
  title: string;
  dir: string;
  props?: { [key: string]: any };
  filter?: (item: Plex.Metadata) => boolean;
  link: string;
  shuffle?: boolean;
}

function BrowseRecommendations() {
  const { libraryID } = useParams<{ libraryID: string }>();
  const [library, setLibrary] = React.useState<Plex.MediaContainer | null>(null);
  const { recommendationsSettings } = useSettingsStore();

  const [featuredItem, setFeaturedItem] = React.useState<Plex.Metadata | null>(null);
  const [categories, setCategories] = React.useState<Category[] | null>([]);

  useEffect(() => {
    if (!libraryID) return;
    getLibrary(libraryID).then((data) => {
      setLibrary(data);
    });
  }, [libraryID]);

  useEffect(() => {
    setFeaturedItem(null);
    setCategories([]);

    if (!library) return;
    getLibraryDir(
      `/library/sections/${library.librarySectionID.toString()}/unwatched`
    ).then(async (media) => {
      const data = media.Metadata;
      if (!data) return;
      const item = data[Math.floor(Math.random() * data.length)];

      const meta = await getLibraryMeta(item.ratingKey);
      setFeaturedItem(meta);
    });

    (async () => {
      let categoryPool: Category[] = [];

      // Only fetch genres if enabled in settings
      if (recommendationsSettings.showGenres) {
        const getGenres = new Promise<Category[]>((resolve) => {
          getLibraryDir(
            `/library/sections/${library.librarySectionID.toString()}/genre`
          ).then(async (media) => {
            const genres = media.Directory;
            if (!genres || !genres.length) return;
            const genreSelection: Plex.Directory[] = [];

            // Get random genres based on user preference
            while (genreSelection.length < Math.min(recommendationsSettings.maxGenres, genres.length)) {
              const genre = genres[Math.floor(Math.random() * genres.length)];
              if (genreSelection.includes(genre)) continue;
              genreSelection.push(genre);
            }

            resolve(
              shuffleArray(genreSelection).map((genre) => ({
                title: genre.title,
                dir: `/library/sections/${library.librarySectionID}/genre/${genre.key}`,
                link: `/library/sections/${library.librarySectionID}/genre/${genre.key}`,
                shuffle: true,
              }))
            );
          });
        });

        const genres = await getGenres;
        categoryPool = [...categoryPool, ...genres];
      }

      const getLastViewed = new Promise<Plex.Metadata[]>((resolve) => {
        getLibraryDir(
          `/library/sections/${library.librarySectionID.toString()}/all`,
          {
            type: library.Type?.[0].type === "movie" ? "1" : "2",
            sort: "lastViewedAt:desc",
            limit: "20",
            unwatched: "0",
          }
        ).then(async (media) => {
          let data = media.Metadata;
          if (!data) return resolve([]);
          resolve(data.filter((item) => ["movie", "show"].includes(item.type)));
        });
      });

      const lastViewed = await getLastViewed;

      if (recommendationsSettings.showBecauseYouWatched && lastViewed[0]) {
        const lastViewItem = await getLibraryMeta(lastViewed[0].ratingKey);

        if (lastViewItem?.Related?.Hub?.[0]?.Metadata?.[0]) {
          let shortenedTitle = lastViewItem.title;
          if (shortenedTitle.length > 40)
            shortenedTitle = `${shortenedTitle.slice(0, 40)}...`;

          categoryPool.push({
            title: `Because you watched ${shortenedTitle}`,
            dir: lastViewItem.Related.Hub[0].hubKey,
            link: lastViewItem.Related.Hub[0].key,
            shuffle: true,
          });
        }
      }

      if (recommendationsSettings.showMoreLikeThis && lastViewed.length > 3) {
        const randomItem =
          lastViewed[Math.floor(Math.random() * lastViewed.length)];
        const randomMeta = await getLibraryMeta(randomItem.ratingKey);

        let shortenedTitle = randomMeta.title;
        if (shortenedTitle.length > 40)
          shortenedTitle = `${shortenedTitle.slice(0, 40)}...`;

        if (randomMeta?.Related?.Hub?.[0]?.Metadata?.[0]) {
          categoryPool.push({
            title: `More Like ${shortenedTitle}`,
            dir: randomMeta.Related.Hub[0].hubKey,
            link: randomMeta.Related.Hub[0].key,
            shuffle: true,
          });
        }
      }

      if (library.Type?.[0].type === "show" && recommendationsSettings.showRecentlyAdded) {
        categoryPool.push({
          title: "Recently Added",
          dir: `/hubs/home/recentlyAdded`,
          link: ``,
          props: {
            type: "2",
            limit: "30",
            sectionID: library.librarySectionID,
            contentSectionID: library.librarySectionID,
            ...getIncludeProps(),
          },
          filter: (item) => item.type === "show",
        });
      }

      categoryPool = shuffleArray(categoryPool);

      // Create a new array for the final order
      let finalCategories: Category[] = [];

      // Add Continue Watching first if enabled
      if (recommendationsSettings.showContinueWatching) {
        finalCategories.push({
          title: "Continue Watching",
          dir: `/library/sections/${library.librarySectionID}/onDeck`,
          link: `/library/sections/${library.librarySectionID}/onDeck`,
          shuffle: false,
        });
      }

      // Add Recently Added right after Continue Watching
      if (library.Type?.[0].type === "movie" && recommendationsSettings.showRecentlyAdded) {
        finalCategories.push({
          title: "Recently Added",
          dir: `/library/sections/${library.librarySectionID}/recentlyAdded`,
          link: `/library/sections/${library.librarySectionID}/recentlyAdded`,
        });
      } else if (library.Type?.[0].type === "show" && recommendationsSettings.showRecentlyAdded) {
        finalCategories.push({
          title: "Recently Added",
          dir: `/hubs/home/recentlyAdded`,
          link: ``,
          props: {
            type: "2",
            limit: "30",
            sectionID: library.librarySectionID,
            contentSectionID: library.librarySectionID,
            ...getIncludeProps(),
          },
          filter: (item) => item.type === "show",
        });
      }

      // Add New Releases if enabled
      if (recommendationsSettings.showNewReleases) {
          finalCategories.push({
            title: "New Releases",
            dir: `/library/sections/${library.librarySectionID}/newest`,
            link: `/library/sections/${library.librarySectionID}/newest`,
          });
      }

      // Add Trending section
      if (recommendationsSettings.showTrending) {
        finalCategories.push({
          title: "Trending",
          dir: `/library/sections/${library.librarySectionID}/all`,
          link: ``,
          props: {
            type: library.Type?.[0].type === "movie" ? "1" : "2",
            sort: "viewCount:desc",
            limit: recommendationsSettings.maxItemsPerCategory.toString(),
            ...getIncludeProps(),
          },
        });
      }

      // Add Popular section
      if (recommendationsSettings.showPopular) {
        finalCategories.push({
          title: "Popular",
          dir: `/library/sections/${library.librarySectionID}/all`,
          link: ``,
          props: {
            type: library.Type?.[0].type === "movie" ? "1" : "2",
            sort: "rating:desc",
            limit: recommendationsSettings.maxItemsPerCategory.toString(),
            ...getIncludeProps(),
          },
        });
      }

      // Add Critically Acclaimed section
      if (recommendationsSettings.showCriticallyAcclaimed) {
        finalCategories.push({
          title: "Critically Acclaimed",
          dir: `/library/sections/${library.librarySectionID}/all`,
          link: ``,
          props: {
            type: library.Type?.[0].type === "movie" ? "1" : "2",
            sort: "rating:desc",
            limit: recommendationsSettings.maxItemsPerCategory.toString(),
            ...getIncludeProps(),
          },
          filter: (item) => Boolean(item.rating && parseFloat(String(item.rating)) >= 8.0),
        });
      }

      // Add Staff Picks section
      if (recommendationsSettings.showStaffPicks) {
        finalCategories.push({
          title: "Staff Picks",
          dir: `/library/sections/${library.librarySectionID}/all`,
          link: ``,
          props: {
            type: library.Type?.[0].type === "movie" ? "1" : "2",
            sort: "rating:desc",
            limit: recommendationsSettings.maxItemsPerCategory.toString(),
            ...getIncludeProps(),
          },
          filter: (item) => Boolean(item.rating && parseFloat(String(item.rating)) >= 7.5),
        });
      }

      // Add Hidden Gems section
      if (recommendationsSettings.showHiddenGems) {
        finalCategories.push({
          title: "Hidden Gems",
          dir: `/library/sections/${library.librarySectionID}/all`,
          link: ``,
          props: {
            type: library.Type?.[0].type === "movie" ? "1" : "2",
            sort: "rating:desc",
            limit: recommendationsSettings.maxItemsPerCategory.toString(),
            ...getIncludeProps(),
          },
          filter: (item) => Boolean(
            item.rating && 
            parseFloat(String(item.rating)) >= 7.0 && 
            (!item.viewCount || parseInt(String(item.viewCount)) < 10)
          ),
        });
      }

      // Add Collections section
      if (recommendationsSettings.showCollections) {
        finalCategories.push({
          title: "Collections",
          dir: `/library/sections/${library.librarySectionID}/collection`,
          link: ``,
          props: {
            ...getIncludeProps(),
          },
        });
      }

      // Add the rest of the categories
      finalCategories = [...finalCategories, ...categoryPool];

      // Apply content diversity setting
      if (recommendationsSettings.contentDiversity < 50) {
        // More similar content - reduce variety, but keep the first few categories
        const firstCategories = finalCategories.slice(0, 3);
        const remainingCategories = finalCategories.slice(3);
        const reducedCategories = remainingCategories.slice(0, Math.floor(remainingCategories.length * 0.7));
        finalCategories = [...firstCategories, ...reducedCategories];
      } else if (recommendationsSettings.contentDiversity > 50) {
        // More diverse content - add some random categories, but keep the first few categories
        const firstCategories = finalCategories.slice(0, 3);
        const remainingCategories = finalCategories.slice(3);
        const randomCategories = shuffleArray(remainingCategories).slice(0, 2);
        finalCategories = [...firstCategories, ...remainingCategories, ...randomCategories];
      }

      setCategories(finalCategories);
    })();
  }, [library, recommendationsSettings]);

  if (!featuredItem || !categories || !library)
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: "100vw",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        pb: 8,
      }}
    >
      <HeroDisplay item={featuredItem} />
      <Box
        sx={{
          zIndex: 1,
          mt: "-20vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: 8,
        }}
      >
        {categories &&
          categories.map((category, index) => (
            <MovieItemSlider
              key={index}
              title={category.title}
              dir={category.dir}
              props={category.props}
              filter={category.filter}
              link={category.link}
              shuffle={category.shuffle}
            />
          ))}
      </Box>
    </Box>
  );
}

export default BrowseRecommendations;
