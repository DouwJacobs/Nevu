import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecommendationsSettings {
  showContinueWatching: boolean;
  showRecentlyAdded: boolean;
  showNewReleases: boolean;
  showBecauseYouWatched: boolean;
  showMoreLikeThis: boolean;
  showGenres: boolean;
  maxGenres: number;
  contentDiversity: number;
  preferredLanguages: string[];
  showTrending: boolean;
  showPopular: boolean;
  showCriticallyAcclaimed: boolean;
  showStaffPicks: boolean;
  showHiddenGems: boolean;
  showSimilarToLastWatched: boolean;
  showUpcoming: boolean;
  showCollections: boolean;
  maxItemsPerCategory: number;
}

interface ContentDisplaySettings {
  showContentRatings: boolean;
  showReleaseYear: boolean;
  showDuration: boolean;
  showAudioLanguages: boolean;
  showSubtitles: boolean;
  autoPlayTrailers: boolean;
}

interface SettingsState {
  recommendationsSettings: RecommendationsSettings;
  contentDisplaySettings: ContentDisplaySettings;
  updateRecommendationsSettings: (settings: RecommendationsSettings) => void;
  updateContentDisplaySettings: (settings: ContentDisplaySettings) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      recommendationsSettings: {
        showContinueWatching: true,
        showRecentlyAdded: true,
        showNewReleases: true,
        showBecauseYouWatched: true,
        showMoreLikeThis: true,
        showGenres: true,
        maxGenres: 8,
        contentDiversity: 50,
        preferredLanguages: [],
        showTrending: true,
        showPopular: true,
        showCriticallyAcclaimed: true,
        showStaffPicks: true,
        showHiddenGems: true,
        showSimilarToLastWatched: true,
        showUpcoming: true,
        showCollections: true,
        maxItemsPerCategory: 20,
      },
      contentDisplaySettings: {
        showContentRatings: true,
        showReleaseYear: true,
        showDuration: true,
        showAudioLanguages: true,
        showSubtitles: true,
        autoPlayTrailers: false,
      },
      updateRecommendationsSettings: (settings) =>
        set({ recommendationsSettings: settings }),
      updateContentDisplaySettings: (settings) =>
        set({ contentDisplaySettings: settings }),
    }),
    {
      name: 'settings-storage',
    }
  )
); 