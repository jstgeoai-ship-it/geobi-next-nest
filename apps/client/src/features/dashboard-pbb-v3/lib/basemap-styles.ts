import type { StyleSpecification } from 'maplibre-gl';

export type Basemap = 'dark' | 'osm' | 'satellite';

const GLYPHS_URL = 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf';

export const BASEMAP_STYLES: Record<Basemap, string | StyleSpecification> = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  osm: {
    version: 8,
    glyphs: GLYPHS_URL,
    sources: {
      osm: {
        type: 'raster',
        tiles: [
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
        ],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors',
      },
    },
    layers: [{ id: 'osm-base', type: 'raster', source: 'osm' }],
  },
  satellite: {
    version: 8,
    glyphs: GLYPHS_URL,
    sources: {
      sat: {
        type: 'raster',
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: '© Esri, Maxar, Earthstar Geographics',
      },
    },
    layers: [{ id: 'sat-base', type: 'raster', source: 'sat' }],
  },
};

export const ATTR_TEXTS: Record<Basemap, string> = {
  dark: '© CARTO © OpenStreetMap',
  osm: '© OpenStreetMap contributors',
  satellite: '© Esri, Maxar, Earthstar Geographics',
};

/** Static tile thumbnails (Jakarta area, z9) used as previews on the basemap picker circles. */
export const BASEMAP_THUMBS: Record<Basemap, string> = {
  dark: 'https://a.basemaps.cartocdn.com/dark_all/9/407/264.png',
  osm: 'https://a.tile.openstreetmap.org/9/407/264.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/9/264/407',
};
