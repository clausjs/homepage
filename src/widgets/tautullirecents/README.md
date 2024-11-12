# Tautulli Recents Homepage Widget

This is a Tautulli based widget for [Homepage](https://github.com/gethomepage/homepage). It was originally written in/and tested for `v0.9.11`. While I will attempt to maintain it moving forward the only version it is _guranteed_ to work on will be v0.9.11

---

The first example I ever came across of listing Tautulli recents in a Homepage widget was on reddit in [this thread](https://www.reddit.com/r/selfhosted/comments/1fzsp2m/homepage_the_possibilities_are_endless/). Muizaz88 is using the [customapi](https://gethomepage.dev/widgets/services/customapi/) widget to call the Tautulli api and parse the results. This comes with the short coming of only being able to list 2 values for each entry in the api results. So for results like TV shows, there was no way to list the show title, season number, episode number, and episode title.

A user on the Homepage Discord came up with a [different solution](https://github.com/10mfox/Gethomepage-Tautulli-Custom-Api?tab=readme-ov-file). This solution uses a separate server which will query the Tuautulli api and compile the results in a format that allows the customapi widget to use its 2 field availability to show all the information. The biggest drawback to this solution is that Homepage still has to make a request. So one service requests info from Tautulli and Homepage then requests that information in a format it can parse. That's 2 requests for every list.

I set out to find a way to acheive this that could use Homepage's built in and powerful [custom widget building](https://gethomepage.dev/widgets/authoring/) to do what the separate server was acheiving without the need to run a separate server which was separately handling requests.

Introducing the `tautullirecents` widget.

## Display

### Number of results

The `tautullirecents` widget is customizable for what data it will display. Using the `fields` property in the widget settings, it can configure which media types the widget will query for.

Acceptable fields are: `movie`, `tv`, or `music`. The configuration can supply any combination of the valid results or none. If none are supplied, all 3 will be queried. The widget will always display 6 results.

- If you supply 1 field, it will display 6 results for that media type
- If you supply 2 fields, it will display 3 results for each media type
- If you supply 3 fields, it will display 2 results for each media type
- Supplying no fields will default in all 3 media types

### Date formatting

The `added_at` display can customized with the same parameters used with the customapi approach in the previously mentioned inspirations for this project. If these are no configured the default display properties will be:

```
format: 'relativeDate',
scale: 1000,
locale: 'en-US',
style: 'narrow',
numeric: 'auto',
color: 'theme'
```

**NOTE:** To enable the ability to customize the date display you'll have to uncomment the code in [/src/utils/config/service-helpers.js](/src/utils/config/service-helpers.js) and rebuild so your widget confirguration will pass these properties to the component

## services.yml

### One widget per media type

```yml
- My Service Group:
    - Recent Movies:
      icon: radarr.png
      widget:
        type: tautullirecents
        url: http://<IP:PORT>
        key: someTautulliApiKey
        fields: ["movie"]
    - Recent TV:
      icon: sonarr.png
      widget:
        type: tautullirecents
        url: http://<IP:PORT>
        key: someTautulliApiKey
        fields: ["tv"]
    - Recent Music:
      icon: lidarr.png
      widget:
        type: tautullirecents
        url: http://<IP:PORT>
        key: someTautulliApiKey
        fields: ["music"]
```

### One widget for all media types

```yml
- My Service Group:
    - Recent Media:
      icon: radarr.png
      widget:
        type: tautullirecents
        url: http://<IP:PORT>
        key: someTautulliApiKey
```
