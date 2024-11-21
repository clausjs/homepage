import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import useWidgetAPI from "utils/proxy/use-widget-api";

const DEFAULT_DATE_DISPLAY = {
  format: "relativeDate", // Default format is relativeDate. See README for more information
  scale: 1000, // Default scale is 1000. See README for more information
  locale: "en-US", // Default locale is en-US. See README for more information
  style: "narrow", // Default style is narrow. See README for more information
  numeric: "auto", // Default numeric is auto. See README for more information
  color: "theme", // Default color is theme. See README for more information
};

function getColor(value, color) {
  switch (color) {
    case "adaptive":
      try {
        const number = parseFloat(value);
        return number > 0 ? "text-emerald-300" : "text-rose-300";
      } catch (e) {
        return "";
      }
    case "black":
      return `text-black`;
    case "white":
      return `text-white`;
    case "theme":
      return `text-theme-500`;
    default:
      return `text-theme-500`; // Default color is theme
  }
}

const getMediaName = (item, mediaType) => {
  let mediaName = "";
  switch (mediaType) {
    case "movie":
      mediaName = item.title;
      break;
    case "tv":
      mediaName = `${item.grandparent_title} S${item.parent_media_index}E${item.media_index} - ${item.title}`;
      break;
    case "music":
      mediaName = `${item.parent_title} - ${item.title}`;
      break;
    default:
      break;
  }

  return mediaName;
};

const formatTime = (t, item, meta) => {
  // eslint-disable-next-line no-param-reassign
  if (!meta) meta = DEFAULT_DATE_DISPLAY;
  const timeValue = t(`common.${meta.format}`, {
    value: item.added_at * meta.scale,
    locale: meta.locale,
    style: meta.style,
    numeric: meta.numeric,
  });

  return timeValue;
};

export default function Component({ service }) {
  const { t } = useTranslation();
  const { widget } = service;
  let { fields } = widget;

  // If one field, count is 6
  // If 2 fields, count is 3 each
  // If 3 fields, count is 2 each
  const count = 6 / (fields && fields?.length ? fields.length : 3);
  const { data: movieData, error: movieError } = useWidgetAPI(widget, "movie", { count });
  const { data: tvData, error: tvError } = useWidgetAPI(widget, "tv", { count });
  const { data: musicData, error: musicError } = useWidgetAPI(widget, "music", { count });

  const defaultFields = ["movie", "tv", "music"];
  if (!fields) fields = defaultFields;

  if (fields.find((field) => !defaultFields.includes(field)))
    return <Container service={service} error="Media type must be at least one of 'movie' or 'tv' or 'music'" />;

  if (movieError || tvError || musicError) {
    let error;
    if (movieError) error = movieError;
    if (tvError) error = tvError;
    if (musicError) error = musicError;
    if (error) return <Container service={service} error={error} />;
  }

  if (!movieData || !tvData || !musicData) {
    <Container service={service} error="Unable to fetch media data from api" />;
  }

  const getData = (data) => {
    if (!data) return [];
    return data.response?.data?.recently_added;
  };

  return (
    <Container service={service}>
      {fields.map((field) => {
        let data;
        switch (field) {
          case "movie":
            data = getData(movieData);
            break;
          case "tv":
            data = getData(tvData);
            break;
          case "music":
            data = getData(musicData);
            break;
          default:
            break;
        }

        return (
          <div key={`tautullirecents.${field}`} label={`tautullirecents.${field}`} className="flex flex-col w-full">
            {data?.map((item) => (
              <div
                key={item.title}
                className="bg-theme-200/50 dark:bg-theme-900/20 rounded m-1 flex-1 flex flex-row items-center justify-between p-1 text-xs"
              >
                <div className="scrolling-text font-bold pl-2">{getMediaName(item, field)}</div>
                <div className="flex flex-row text-right">
                  <div className={`font-thin mr-2 ${getColor(item.added_at, widget?.date?.color)}`}>
                    {formatTime(t, item, widget?.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </Container>
  );
}
