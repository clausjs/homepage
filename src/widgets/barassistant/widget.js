import credentialedProxyHandler from "utils/proxy/handlers/credentialed";

const widget = {
  api: "{url}/bar/api/{endpoint}",
  proxyHandler: credentialedProxyHandler,

  mappings: {
    bars: {
      endpoint: "bars",
    },
    totalCocktails: {
      endpoint: "cocktails",
      params: ["bar_id", "per_page"],
    },
    shelfCocktails: {
      endpoint: "shelf/cocktails",
      params: ["bar_id"],
    },
  },
};

export default widget;
