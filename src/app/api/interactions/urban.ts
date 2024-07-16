import { UrbanDictionaryDefinition } from "@/types/urban";
import { MessageFlags } from "discord-api-types/v10";

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
export const getEmbedData = async (value: string, isPublic: boolean, page: number = 0) => {
  const { list }: { list: UrbanDictionaryDefinition[] } = await fetch(`https://api.urbandictionary.com/v0/define?term=${value}`).then((res) => {
    return res.json()
  })
  if (list.length === 0) {
    return false;
  }
  const sorted = list.sort((a, b) => b.thumbs_up - a.thumbs_up);
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
  const disablePrevious = page === 0;

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
          },
        ],
        footer: {
          text: `👍 ${definition.thumbs_up} | 👎 ${definition.thumbs_down}`,
          icon_url: "https://urbandictionary.fyi/upload/logo1.png",
        },
        color: 0xf1fc47,
        timestamp: new Date(definition.written_on).toISOString(),
      }
    ],
    components: [
      {
        "type": 1,
        "components": [
            {
              "type": 2,
              "label": "Previous",
              "style": 2,
              "custom_id": `page:${page - 1}:${isPublic}:${encodeURIComponent(value)}`,
              "disabled": disablePrevious
            },
            {
                "type": 2,
                "label": "Next",
                "style": 2,
                "custom_id": `page:${page + 1}:${isPublic}:${encodeURIComponent(value)}`,
                "disabled": disableNext,
            }
        ]
    }
    ],
    flags: isPublic ? undefined : MessageFlags.Ephemeral,
  };
  return data;
}