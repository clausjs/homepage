import genericProxyHandler from "utils/proxy/handlers/generic"; 

const widget =  {
  api: "{url}/api/v2?apikey={key}&cmd=get_recently_added&{endpoint}" ,
  proxyHandler: genericProxyHandler ,

  mappings:  {
    movie:  {
      endpoint: "media_type=movie",
      params: ["count"]
    },
    tv: {
      endpoint: "media_type=show&section_id=1",
      params: ["count"]
    },
    music: {
      endpoint: "media_type=artist",
      params: ["count"]
    }
  },
};

export default widget;
