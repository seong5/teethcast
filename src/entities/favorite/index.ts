/* 즐겨찾기 엔티티 */

export type { FavoriteLocation } from './model'
export { useFavorites, useFavoritesStore } from './useFavorites'
export {
  roundTo6Decimals,
  roundTo5Decimals,
  generateFavoriteId,
  generateFavoriteIdCoarse,
} from './coordinates'
