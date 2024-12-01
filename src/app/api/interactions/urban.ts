import { UrbanDictionaryDefinition } from "@/types/urban";
import { MessageFlags } from "discord-api-types/v10";

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
export const sortType: {[key: string]: {name: string, icon: string, style?: number, sort: (a: UrbanDictionaryDefinition, b: UrbanDictionaryDefinition) => number}} = {
  "tu": {
    name: "Most Likes",
    icon: "🔍", // default
    sort: (a: UrbanDictionaryDefinition, b: UrbanDictionaryDefinition) => b.thumbs_up - a.thumbs_up,
  },
  "rt": {
    name: "Ratio",
    icon: "➗",
    style: 1,
    sort: (a: UrbanDictionaryDefinition, b: UrbanDictionaryDefinition) => (b.thumbs_up / b.thumbs_down) - (a.thumbs_up / a.thumbs_down),
  },
  "d": {
    name: "Date",
    icon: "📅",
    sort: (a: UrbanDictionaryDefinition, b: UrbanDictionaryDefinition) => new Date(b.written_on).getTime() - new Date(a.written_on).getTime(),
  },
}

export const getEmbedData = async (_value: string, isPublic: boolean, _page: number = 0, sort: keyof typeof sortType = "tu", showRandomBtn: boolean = false) => {
  let value = _value;
  let rand = showRandomBtn ? "t" : "f";
  if (_value === "random") { // spaghetti code lol
    // console.log("fetching random");
    const { list } = await fetch("https://api.urbandictionary.com/v0/random").then((res) => {
      return res.json()
    });
    value = list[0].word;
    rand = "t";
  }
  // re-fetch down here so we can get a full paginate-able list
  let { list }: { list: UrbanDictionaryDefinition[] } = await fetch(`https://api.urbandictionary.com/v0/define?term=${value}`).then((res) => {
    return res.json()
  })
  if (list.length === 0) {
    return false;
  }
  const s = sortType[sort];
  const currentSortIndex = Object.keys(sortType).findIndex((key) => key === sort);
  const nextSort = Object.keys(sortType)[(currentSortIndex + 1) % Object.keys(sortType).length];
  const sorted = list.sort((a, b) => s.sort(a, b));
  const page = Math.min(Math.max(_page, 0), sorted.length - 1);
  const definition = sorted[page];
  if (!definition) {
    return false;
  }

  // yoink https://github.com/Vendicated/Vencord/commit/93dc880bc026ad83ff47bddc588d274909a67bff
  const linkify = (text: string) => text
    .replaceAll("\r\n", "\n")
    .replace(/([*>_`~\\])/gi, "\\$1")
    .replace(/\[(.+?)\]/g, (_, word) => `[${word}](https://www.urbandictionary.com/define.php?term=${encodeURIComponent(word)} "Define '${word}' on Urban Dictionary")`)
    .trim();
  let example = definition.example;
  if (example.length > 256) {
    example = example.slice(0, 253) + "...";
  }
  let description = definition.definition;
  if (description.length > 256) {
    description = description.slice(0, 253) + "...";
  }
  const permalink = "https://www.urbandictionary.com/define.php?term=" + encodeURIComponent(definition.word) + "&defid=" + definition.defid;
  const disableNext = page === sorted.length - 1;
  const disablePrevious = page === 0 || !page;
  const date: string = new Date(definition.written_on).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const encoded = encodeURIComponent(value);

  const data = {
    embeds: [
      {
        type: "rich",
        title: capitalizeFirstLetter(definition.word),
        description: linkify(description),
        author: {
          name: `Written by ${definition.author}`,
          url: permalink,
        },
        url: permalink,
        fields: [
          {
            name: "Example",
            value: linkify(example),
          }
        ],
        footer: {
          text: `👍 ${definition.thumbs_up} | 👎 ${definition.thumbs_down}${list.length > 1 ? ` • ${s.icon}${s.name}` : ""} • ${page + 1}/${list.length} • ${date}`,
          icon_url: "https://urbandictionary.fyi/upload/logo1.png",
        },
        color: 0xf1fc47,
        // timestamp: new Date(definition.written_on).toISOString(),
      }
    ],
    // using acronyms for custom_id to save character space
    components: [
      {
        "type": 1,
        "components": [
            {
              "type": 2,
              "emoji": {
                "id": null,
                "name": "⏪"
              },
              "style": 2,
              "custom_id": `j:0:${isPublic}:${sort}:${rand}:${encoded}`,
              "disabled": disablePrevious,
            },
            {
              "type": 2,
              "emoji": {
                "id": null,
                "name": "⬅️"
              }, 
              "style": 2,
              "custom_id": `p:${page - 1}:${isPublic}:${sort}:${rand}:${encoded}`,
              "disabled": disablePrevious
            },
            {
              "type": 2,
              "emoji": {
                "id": null,
                "name": s.icon,
              },
              "style": s.style ?? 2,
              "custom_id": `cs:${isPublic}:${nextSort}:${rand}:${encoded}`,
              "disabled": list.length <= 1,
            },
            {
              "type": 2,
              "emoji": {
                "id": null,
                "name": "➡️"
              },
              "style": 2,
              "custom_id": `p:${page + 1}:${isPublic}:${sort}:${rand}:${encoded}`,
              "disabled": disableNext,
            },
            {
              "type": 2,
              "emoji": {
                "id": null,
                "name": "⏩"
              },
              "style": 2,
              "custom_id": `j1:${sorted.length - 1}:${isPublic}:${sort}:${rand}:${encoded}`,
              "disabled": disableNext,
            }
        ]
      },
      ...(showRandomBtn ? [
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 1,
              "emoji": {
                "id": null,
                "name": "🎲"
              },
              "custom_id": `r:0:${isPublic}:${sort}:t:random`,
            }
          ]
        }
      ] : [])
    ],
    flags: isPublic ? undefined : MessageFlags.Ephemeral,
  };
  return data;
}