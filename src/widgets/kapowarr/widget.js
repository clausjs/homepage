import genericProxyHandler from "utils/proxy/handlers/generic";

const widget = {
  api: "{url}/api/{endpoint}?api_key={key}",
  proxyHandler: genericProxyHandler,

  mappings: {
    volumes: {
      endpoint: "volumes",
    },
    queue: {
      endpoint: "activity/queue",
    },
    wanted: {
      endpoint: "volumes",
      params: ["filter"],
    },
    history: {
      endpoint: "activity/history",
      params: ["offset"],
    },
    blocked: {
      endpoint: "blocklist",
      params: ["offset"],
    },
  },
};

export default widget;
